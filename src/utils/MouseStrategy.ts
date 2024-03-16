/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEvent, WheelEvent } from "react";
import useStore, { Shape as ShapeProps } from "../state/store";
import { nanoid } from "nanoid";

interface Position {
  x: number;
  y: number;
}

interface Coords extends Position {
  width: number;
  height: number;
}

abstract class Strategy {
  public abstract handleMouseDown(e: MouseEvent<any>): void;
  public abstract handleMouseUp(e: MouseEvent<any>): void;
  public abstract handleMouseMove(e: MouseEvent<any>): void;

  private handleZoom = (e: WheelEvent<SVGSVGElement>) => {
    if (!Whiteboard.whiteboardReference || !e.ctrlKey) return;

    const { viewBox, scale, setViewBox, setScale } = useStore.getState();

    const point = new DOMPoint();
    const SCALING_FACTOR = e.deltaY > 0 ? 1.1 : 1 / 1.1;

    point.x = e.clientX;
    point.y = e.clientY;

    setScale(scale * SCALING_FACTOR);

    const startPoint = point.matrixTransform(
      Whiteboard.whiteboardReference.getScreenCTM()?.inverse()
    );

    setViewBox({
      x: startPoint.x - (startPoint.x - viewBox.x) * SCALING_FACTOR,
      y: startPoint.y - (startPoint.y - viewBox.y) * SCALING_FACTOR,
      width: viewBox.width * SCALING_FACTOR,
      height: viewBox.height * SCALING_FACTOR,
    });
  };

  private handleScrollHorizontally = (e: WheelEvent<SVGSVGElement>) => {
    if (!e.shiftKey) return;

    const { viewBox, scale, setViewBox } = useStore.getState();

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x + e.deltaY * scale,
      y: viewBox.y,
    });
  };

  private handleScrollVertically = (e: WheelEvent<SVGSVGElement>) => {
    if (e.shiftKey || e.ctrlKey) return;
    const { viewBox, scale, setViewBox } = useStore.getState();

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x + e.deltaX * scale,
      y: viewBox.y + e.deltaY * scale,
    });
  };

  public handleMouseWheel = (e: WheelEvent<SVGSVGElement>) => {
    const { setShapeEditor } = useStore.getState();
    setShapeEditor({ show: false });
    this.handleZoom(e);
    this.handleScrollHorizontally(e);
    this.handleScrollVertically(e);
  };

  public mouseToSvgCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = Whiteboard.whiteboardReference;
    const point = new DOMPoint();

    point.x = e.clientX;
    point.y = e.clientY;

    return point.matrixTransform(svg?.getScreenCTM()?.inverse());
  };
}

export class Context {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  public setStrategy(newStrategy: Strategy) {
    this.strategy = newStrategy;
  }

  public getStrategy() {
    return this.strategy;
  }

  public handleMouseDown = (e: MouseEvent<any>) => {
    this.strategy.handleMouseDown(e);
  };

  public handleMouseMove = (e: MouseEvent<any>) => {
    this.strategy.handleMouseMove(e);
  };

  public handleMouseUp = (e: MouseEvent<any>) => {
    this.strategy.handleMouseUp(e);
  };

  public handleMouseWheel = (e: WheelEvent<any>) => {
    this.strategy.handleMouseWheel(e);
  };
}

export class Whiteboard extends Strategy {
  static whiteboardReference?: SVGSVGElement | null;
  private isDragging = false;
  private startCoords!: Position;

  public handleMouseMove = (e: MouseEvent<any>): void => {
    const { scale, viewBox, setViewBox, setWhiteboardCursor } =
      useStore.getState();

    if (!this.isDragging) return;

    const deltaX = e.clientX - this.startCoords.x;
    const deltaY = e.clientY - this.startCoords.y;

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x - deltaX * scale,
      y: viewBox.y - deltaY * scale,
    });

    setWhiteboardCursor("cursor-grabbing");

    this.startCoords = { x: e.clientX, y: e.clientY };
  };

  public handleMouseDown = (e: MouseEvent<any>) => {
    const { setShapeEditor } = useStore.getState();
    setShapeEditor({ show: false });

    this.isDragging = true;
    this.startCoords = { x: e.clientX, y: e.clientY };
  };

  public handleMouseUp() {
    const { setShapeEditor, setWhiteboardCursor } = useStore.getState();
    this.isDragging = false;
    setShapeEditor({ show: false });
    setWhiteboardCursor("cursor-grab");
  }
}

export class Handler extends Strategy {
  private x!: number;
  private y!: number;
  private id!: string;
  private width!: number;
  private height!: number;
  private isDragging = false;
  private orientation!: string;
  private preserveAspectRatio = false;

  public handleMouseDown = (e: MouseEvent<any>) => {
    const target = e.target as HTMLElement;

    const { getElementProps } = useStore.getState();

    this.id = target.id;

    const { type, props } = getElementProps(this.id)!;
    const { x, y, width, height } = props;
    this.preserveAspectRatio = type == "shape";

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.orientation = target.dataset.orientation!;
    this.isDragging = true;
  };

  public handleMouseUp = () => {
    const { setShapeEditor, setWhiteboardCursor } = useStore.getState();
    this.isDragging = false;
    setShapeEditor({ show: false });
    setWhiteboardCursor("cursor-select");
  };

  public handleMouseMove = (e: MouseEvent<any>): void => {
    const { setElementProps } = useStore.getState();
    if (!this.isDragging) return;

    const cursor = this.mouseToSvgCoords(e);
    const deltaX = cursor.x - this.x;
    const deltaY = cursor.y - this.y;
    const ratio = this.width / this.height;
    const limit = 25;

    const orientationPropsRef: Record<string, () => Position> = {
      "top-left": () => ({
        x: this.width - limit + this.x,
        y: this.height - limit + this.y,
      }),
      "top-right": () => ({
        x: this.x,
        y: this.height - limit + this.y,
      }),
      "bottom-left": () => ({
        x: this.width - limit + this.x,
        y: this.y,
      }),
      "bottom-right": () => ({
        x: this.x,
        y: this.y,
      }),
      "top-middle": () => ({
        x: this.x,
        y: this.height - limit + this.y,
      }),
      "bottom-middle": () => ({
        x: this.x,
        y: this.y,
      }),
      "middle-left": () => ({
        x: this.width - limit + this.x,
        y: this.y,
      }),
      "middle-right": () => ({
        x: this.x,
        y: this.y,
      }),
    };

    const orientationProps: Record<string, () => Coords> = {
      "top-left": () => ({
        x: cursor.x,
        y: cursor.y,
        width: this.width - deltaX,
        height: this.height - deltaY,
      }),
      "top-right": () => ({
        x: this.x,
        y: cursor.y,
        width: deltaX,
        height: this.height - deltaY,
      }),
      "bottom-left": () => ({
        x: cursor.x,
        y: this.y,
        width: this.width - deltaX,
        height: deltaY,
      }),
      "bottom-right": () => ({
        x: this.x,
        y: this.y,
        width: deltaX,
        height: deltaY,
      }),
      "top-middle": () => ({
        x: this.x,
        y: cursor.y,
        width: this.width,
        height: this.height - deltaY,
      }),
      "bottom-middle": () => ({
        x: this.x,
        y: this.y,
        width: this.width,
        height: deltaY,
      }),
      "middle-left": () => ({
        x: cursor.x,
        y: this.y,
        width: this.width - deltaX,
        height: this.height,
      }),
      "middle-right": () => ({
        x: this.x,
        y: this.y,
        width: deltaX,
        height: this.height,
      }),
    };

    const orientationPropsConstrained: Record<string, () => Coords> = {
      "top-left": () => ({
        x: this.x + deltaY * ratio,
        y: cursor.y,
        width: this.width - deltaY * ratio,
        height: this.height - deltaY,
      }),
      "top-right": () => ({
        x: this.x,
        y: this.y + deltaY,
        width: this.width - deltaY * ratio,
        height: this.height - deltaY,
      }),
      "bottom-left": () => ({
        x: cursor.x,
        y: this.y,
        width: this.width - deltaX,
        height: ((this.width - deltaX) * 1) / ratio,
      }),
      "bottom-right": () => ({
        x: this.x,
        y: this.y,
        width: deltaX,
        height: (deltaX * 1) / ratio,
      }),
      "top-middle": () => ({
        x: this.x,
        y: this.y + deltaY,
        width: this.width - deltaY * ratio,
        height: this.height - deltaY,
      }),
      "bottom-middle": () => ({
        x: this.x,
        y: this.y,
        width: deltaY * ratio,
        height: deltaY,
      }),
      "middle-left": () => ({
        x: cursor.x,
        y: this.y,
        width: this.width - deltaX,
        height: ((this.width - deltaX) * 1) / ratio,
      }),
      "middle-right": () => ({
        x: this.x,
        y: this.y,
        width: deltaX,
        height: (deltaX * 1) / ratio,
      }),
    };

    const props = (
      this.preserveAspectRatio ? orientationPropsConstrained : orientationProps
    )[this.orientation]();

    const propsRef = orientationPropsRef[this.orientation]();

    if (props.width < limit) {
      props.width = limit;
      props.x = propsRef.x;
    }

    if (props.height < limit) {
      props.height = this.preserveAspectRatio ? limit / ratio : limit;
      props.y = propsRef.y;
    }

    setElementProps(this.id, props);
  };
}

export class Shape extends Strategy {
  private id!: string;
  private deltaX = 0;
  private deltaY = 0;
  private isDragging = false;

  public handleMouseDown = (e: MouseEvent<any>) => {
    const target = e.target as HTMLElement;

    const { getElementProps, setFocusedComponentId, setWhiteboardCursor } =
      useStore.getState();

    this.id = target.id;
    this.isDragging = true;

    setFocusedComponentId(target.id);
    setWhiteboardCursor("cursor-select");

    const { x, y } = getElementProps(this.id)!.props;
    const startPoint = this.mouseToSvgCoords(e);

    this.deltaX = startPoint.x - x;
    this.deltaY = startPoint.y - y;
  };

  public handleMouseUp = () => {
    this.isDragging = false;
  };

  public handleMouseMove = (e: MouseEvent<any>): void => {
    const { setElementProps, setShapeEditor } = useStore.getState();

    if (!this.isDragging) return;

    const startPoint = this.mouseToSvgCoords(e);

    setShapeEditor({ show: false });
    setElementProps(this.id, {
      x: startPoint.x - this.deltaX,
      y: startPoint.y - this.deltaY,
    });
  };
}

export class DrawRectangle extends Strategy {
  private id = nanoid(6);
  private topLeftCorner!: Position;
  private bottomRightCorner!: Position;
  private isDragging = false;

  public handleMouseDown = (e: MouseEvent<any>) => {
    const { setShapeEditor, addBoardElement, setFocusedComponentId } =
      useStore.getState();
    this.isDragging = true;
    setShapeEditor({ show: false });

    const startPoint = this.mouseToSvgCoords(e);

    this.topLeftCorner = { x: startPoint.x, y: startPoint.y };
    this.bottomRightCorner = this.topLeftCorner;

    const rectangle: ShapeProps = {
      id: this.id,
      type: "rectangle",
      props: {
        x: startPoint.x,
        y: startPoint.y,
        width: 0,
        height: 0,
        fill: "orange",
      },
    };

    addBoardElement(rectangle);
    setFocusedComponentId(this.id);
  };

  public handleMouseMove = (e: MouseEvent<any>) => {
    const { setElementProps } = useStore.getState();
    if (!this.isDragging) return;

    const endPoint = this.mouseToSvgCoords(e);

    this.topLeftCorner = { x: endPoint.x, y: endPoint.y };

    setElementProps(this.id, {
      width: Math.max(this.topLeftCorner.x - this.bottomRightCorner.x, 25),
      height: Math.max(this.topLeftCorner.y - this.bottomRightCorner.y, 25),
    });
  };

  public handleMouseUp = () => {
    this.isDragging = false;
    const { setToolInUseName, setWhiteboardCursor } = useStore.getState();
    setToolInUseName("Select");
    setWhiteboardCursor("cursor-select");
  };
}

export class DrawCircle extends Strategy {
  private id = nanoid(6);
  private topLeftCorner!: Position;
  private bottomRightCorner!: Position;
  private isDragging = false;

  public handleMouseDown = (e: MouseEvent<any>) => {
    const { setShapeEditor, addBoardElement, setFocusedComponentId } =
      useStore.getState();
    this.isDragging = true;
    setShapeEditor({ show: false });

    const startPoint = this.mouseToSvgCoords(e);

    this.topLeftCorner = { x: startPoint.x, y: startPoint.y };
    this.bottomRightCorner = this.topLeftCorner;

    const rectangle: ShapeProps = {
      id: this.id,
      type: "circle",
      props: {
        x: startPoint.x,
        y: startPoint.y,
        width: 0,
        height: 0,
        fill: "orange",
      },
    };

    addBoardElement(rectangle);
    setFocusedComponentId(this.id);
  };

  public handleMouseMove = (e: MouseEvent<any>) => {
    if (!this.isDragging) return;

    const { setElementProps } = useStore.getState();
    const endPoint = this.mouseToSvgCoords(e);

    this.topLeftCorner = { x: endPoint.x, y: endPoint.y };

    setElementProps(this.id, {
      width: Math.max(this.topLeftCorner.x - this.bottomRightCorner.x, 25),
      height: Math.max(this.topLeftCorner.y - this.bottomRightCorner.y, 25),
    });
  };

  public handleMouseUp = () => {
    this.isDragging = false;
    const { setToolInUseName, setWhiteboardCursor } = useStore.getState();
    setToolInUseName("Select");
    setWhiteboardCursor("cursor-select");
  };
}

export class DrawCustomShape extends Strategy {
  private id = nanoid(6);
  private topLeftCorner!: Position;
  private bottomRightCorner!: Position;
  private isDragging = false;
  private href: string;

  constructor(href: string) {
    super();
    this.href = href;
  }

  public handleMouseDown = (e: MouseEvent<any>) => {
    const { setShapeEditor, addBoardElement, setFocusedComponentId } =
      useStore.getState();
    this.isDragging = true;
    setShapeEditor({ show: false });

    const startPoint = this.mouseToSvgCoords(e);

    this.topLeftCorner = { x: startPoint.x, y: startPoint.y };
    this.bottomRightCorner = this.topLeftCorner;

    const rectangle: ShapeProps = {
      id: this.id,
      type: "shape",
      props: {
        x: startPoint.x,
        y: startPoint.y,
        width: 0,
        height: 0,
        href: this.href,
      },
    };

    addBoardElement(rectangle);
    setFocusedComponentId(this.id);
  };

  public handleMouseMove = (e: MouseEvent<any>) => {
    if (!this.isDragging) return;
    const { setElementProps } = useStore.getState();

    const endPoint = this.mouseToSvgCoords(e);

    this.topLeftCorner = { x: endPoint.x, y: endPoint.y };

    setElementProps(this.id, {
      width: Math.max(this.topLeftCorner.x - this.bottomRightCorner.x, 25),
      height: Math.max(this.topLeftCorner.y - this.bottomRightCorner.y, 25),
    });
  };

  public handleMouseUp = () => {
    this.isDragging = false;
    const { setToolInUseName, setWhiteboardCursor } = useStore.getState();
    setToolInUseName("Select");
    setWhiteboardCursor("cursor-select");
  };
}
