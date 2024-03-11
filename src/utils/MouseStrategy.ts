/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEvent, WheelEvent } from "react";
import useStore from "../state/store";

interface Coords {
  x: number;
  y: number;
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

  public mouseToSvgCoords = (e: React.MouseEvent<unknown>) => {
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

  public handleMouseMove = (e: MouseEvent<any>): void => {
    const {
      scale,
      viewBox,
      startCoords,
      isDragging,
      setViewBox,
      setStartCoords,
    } = useStore.getState();

    if (!isDragging) return;

    const deltaX = e.clientX - startCoords.x;
    const deltaY = e.clientY - startCoords.y;

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x - deltaX * scale,
      y: viewBox.y - deltaY * scale,
    });

    setStartCoords({ x: e.clientX, y: e.clientY });
  };

  public handleMouseDown = (e: MouseEvent<any>) => {
    const { setDragging, setStartCoords, setShapeEditor } = useStore.getState();
    setDragging(true);
    setShapeEditor({ show: false });
    setStartCoords({ x: e.clientX, y: e.clientY });
  };

  public handleMouseUp() {
    const { setDragging, setShapeEditor } = useStore.getState();
    setDragging(false);
    setShapeEditor({ show: false });
  }
}

export class Handler extends Strategy {
  private x!: number;
  private y!: number;
  private id!: string;
  private width!: number;
  private height!: number;
  private orientation!: string;
  private preserveAspectRatio = false;

  public handleMouseDown = (e: MouseEvent<any>) => {
    const target = e.target as HTMLElement;

    const { setDragging, getElementProps } = useStore.getState();

    this.id = target.id;

    const { type, props } = getElementProps(this.id)!;
    const { x, y, width, height } = props;
    this.preserveAspectRatio = type == "shape";

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.orientation = target.dataset.orientation!;
    setDragging(true);
  };

  public handleMouseUp = () => {
    const { setDragging, setShapeEditor } = useStore.getState();
    setDragging(false);
    setShapeEditor({ show: false });
  };

  public handleMouseMove = (e: MouseEvent<any>): void => {
    const { isDragging, setElementProps } = useStore.getState();
    if (!isDragging) return;

    const cursor = this.mouseToSvgCoords(e);
    const deltaX = cursor.x - this.x;
    const deltaY = cursor.y - this.y;
    const ratio = this.width / this.height;

    const orientationProps: Record<string, () => Coords> = {
      "top-left": () => ({
        x: cursor.x,
        y: cursor.y,
        width: this.width - deltaX,
        height: this.height - deltaY,
      }),
      "top-right": () => ({
        x: this.x,
        y: this.y + deltaY,
        width: deltaX,
        height: this.height - deltaY,
      }),
      "bottom-left": () => ({
        x: this.x + deltaX,
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

    setElementProps(this.id, props);
  };
}

export class Shape extends Strategy {
  private id!: string;
  private deltaX = 0;
  private deltaY = 0;

  public handleMouseDown = (e: MouseEvent<any>) => {
    const target = e.target as HTMLElement;

    const {
      setDragging,
      setStartCoords,
      getElementProps,
      setFocusedComponentId,
    } = useStore.getState();

    this.id = target.id;

    setDragging(true);
    setStartCoords({ x: e.clientX, y: e.clientY });
    setFocusedComponentId(target.id);

    const { x, y } = getElementProps(this.id)!.props;
    const startPoint = this.mouseToSvgCoords(e);

    this.deltaX = startPoint.x - x;
    this.deltaY = startPoint.y - y;
  };

  public handleMouseUp = () => {
    const { setDragging } = useStore.getState();
    setDragging(false);
  };

  public handleMouseMove = (e: MouseEvent<any>): void => {
    const { isDragging, setElementProps, setShapeEditor } = useStore.getState();

    if (!isDragging) return;

    const startPoint = this.mouseToSvgCoords(e);

    setShapeEditor({ show: false });
    setElementProps(this.id, {
      x: startPoint.x - this.deltaX,
      y: startPoint.y - this.deltaY,
    });
  };
}
