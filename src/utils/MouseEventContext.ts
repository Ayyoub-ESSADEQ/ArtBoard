import useStore from "../state/store";
import { MouseEvent, WheelEvent } from "react";
import mouseToSvgCoords from "./mouseToSvgCoords";

type GlobalTypes = "whiteboard" | "handler" | "shape";

interface Coords {
  x: number;
  y: number;
  width: number;
  height: number;
}

/// Here is the state interface that each concrete implementation should implement
abstract class State {
  public abstract handleMouseDown(e: MouseEvent<SVGSVGElement>): void;
  public abstract handleMouseUp(e: MouseEvent<SVGSVGElement>): void;
  public abstract handleMouseMove(e: MouseEvent<SVGSVGElement>): void;
  public abstract handleMouseWheel(e: WheelEvent<SVGSVGElement>): void;
  protected context!: MouseEventContext;

  public setContext(context: MouseEventContext) {
    this.context = context;
  }

  public manageStateTransition(type: GlobalTypes) {
    switch (type) {
      case "handler":
        this.context.changeState(new Handler());
        return this.context.getState().handleMouseDown;

      case "whiteboard":
        this.context.changeState(new Whiteboard());
        return this.context.getState().handleMouseDown;

      case "shape":
        this.context.changeState(new Shape());
        return this.context.getState().handleMouseDown;
    }
  }
}

class MouseEventContext {
  private state: State;

  constructor(initialState: State) {
    this.changeState(initialState);
    this.state = initialState;
  }

  public handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    this.state.handleMouseDown(e);
  };

  public handleMouseUp = (e: MouseEvent<SVGSVGElement>) => {
    this.state.handleMouseUp(e);
  };

  public handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    this.state.handleMouseMove(e);
  };

  public handleMouseWheel = (e: WheelEvent<SVGSVGElement>) => {
    this.state.handleMouseWheel(e);
  };

  public changeState = (state: State) => {
    this.state = state;
    this.state.setContext(this);
  };

  public getState = () => {
    return this.state;
  };
}

export class Whiteboard extends State {
  static whiteboardReference?: React.RefObject<SVGSVGElement>;
  private type = "whiteboard";

  private handleZoom = (e: WheelEvent<SVGSVGElement>) => {
    if (!Whiteboard.whiteboardReference?.current || !e.ctrlKey) return;

    const {
      backgroundPosition,
      viewBox,
      scale,
      setBackgroundPosition,
      setViewBox,
      setScale,
    } = useStore.getState();

    const point = new DOMPoint();
    const SCALING_FACTOR = e.deltaY > 0 ? 1.1 : 1 / 1.1;

    point.x = e.clientX;
    point.y = e.clientY;

    setScale(scale * SCALING_FACTOR);

    const startPoint = point.matrixTransform(
      Whiteboard.whiteboardReference.current.getScreenCTM()?.inverse()
    );

    setViewBox({
      x: startPoint.x - (startPoint.x - viewBox.x) * SCALING_FACTOR,
      y: startPoint.y - (startPoint.y - viewBox.y) * SCALING_FACTOR,
      width: viewBox.width * SCALING_FACTOR,
      height: viewBox.height * SCALING_FACTOR,
    });

    setBackgroundPosition({
      x:
        e.clientX +
        (1 / (42 * SCALING_FACTOR)) * (e.clientX + backgroundPosition.x),
      y:
        e.clientY +
        (1 / (42 * SCALING_FACTOR)) * (e.clientY + backgroundPosition.y),
    });
  };

  private handleScrollHorizontally = (e: WheelEvent<SVGSVGElement>) => {
    if (!e.shiftKey) return;

    const {
      backgroundPosition,
      viewBox,
      scale,
      setBackgroundPosition,
      setViewBox,
    } = useStore.getState();

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x + e.deltaY * scale,
      y: viewBox.y,
    });

    setBackgroundPosition({
      x: backgroundPosition.x - e.deltaY,
      y: backgroundPosition.y,
    });
  };

  private handleScrollVertically = (e: WheelEvent<SVGSVGElement>) => {
    if (e.shiftKey || e.ctrlKey) return;
    const {
      backgroundPosition,
      viewBox,
      scale,
      setBackgroundPosition,
      setViewBox,
    } = useStore.getState();

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x + e.deltaX * scale,
      y: viewBox.y + e.deltaY * scale,
    });

    setBackgroundPosition({
      x: backgroundPosition.x - e.deltaX,
      y: backgroundPosition.y - e.deltaY,
    });
  };

  public handleMouseWheel = (e: WheelEvent<SVGSVGElement>) => {
    const { setShapeEditor } = useStore.getState();
    setShapeEditor({ show: false });
    this.handleZoom(e);
    this.handleScrollHorizontally(e);
    this.handleScrollVertically(e);
  };

  public handleMouseMove = (e: MouseEvent<SVGSVGElement>): void => {
    const {
      scale,
      viewBox,
      backgroundPosition,
      startCoords,
      isDragging,
      toolInUseName,
      setViewBox,
      setBackgroundPosition,
      setWhiteboardCursor,
      setStartCoords,
    } = useStore.getState();

    if (!isDragging) return;

    if (toolInUseName === "Pan") setWhiteboardCursor("grabbing");

    const deltaX = e.clientX - startCoords.x;
    const deltaY = e.clientY - startCoords.y;

    setBackgroundPosition({
      x: backgroundPosition.x + deltaX,
      y: backgroundPosition.y + deltaY,
    });

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x - deltaX * scale,
      y: viewBox.y - deltaY * scale,
    });

    setStartCoords({ x: e.clientX, y: e.clientY });
  };

  public handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLElement;
    const type = target.dataset.type as GlobalTypes;
    if (type !== this.type) {
      this.manageStateTransition(type)(e);
      return;
    }

    const {
      setDragging,
      setStartCoords,
      setFocusedComponentId,
      setShapeEditor,
      toolInUseName,
    } = useStore.getState();

    setFocusedComponentId(target.id);

    if (toolInUseName !== "Pan") return;

    setDragging(true);
    setShapeEditor({ show: false });
    setStartCoords({ x: e.clientX, y: e.clientY });
  };

  public handleMouseUp() {
    const { setDragging, setShapeEditor, toolInUseName, setWhiteboardCursor } =
      useStore.getState();
    setDragging(false);
    if (toolInUseName === "Pan") setWhiteboardCursor("grab");
    setShapeEditor({ show: false });
  }
}

export class Handler extends State {
  private x!: number;
  private y!: number;
  private id!: string;
  private width!: number;
  private height!: number;
  private orientation!: string;
  private type = "handler";

  public handleMouseWheel = () => {};

  public handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLElement;
    const type = target.dataset.type as GlobalTypes;

    if (type !== this.type) {
      this.manageStateTransition(type)(e);
      return;
    }

    const { setFocusedComponentId, setDragging } = useStore.getState();
    this.id = target.id;
    setFocusedComponentId(this.id);

    const { getElementProps } = useStore.getState();
    const { x, y, width, height } = getElementProps(this.id)!;

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
    this.context.changeState(new Whiteboard());
  };

  public handleMouseMove = (e: MouseEvent<SVGSVGElement>): void => {
    const { isDragging, setElementProps } = useStore.getState();
    if (!isDragging) return;

    const cursor = mouseToSvgCoords(e);
    const deltaX = cursor.x - this.x;
    const deltaY = cursor.y - this.y;

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

    const props = orientationProps[this.orientation]();
    setElementProps(this.id, props);
  };
}

export class Shape extends State {
  private id!: string;
  private deltaX = 0;
  private deltaY = 0;
  private type = "shape";

  public handleMouseWheel() {}

  public handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLElement;
    const type = target.dataset.type as GlobalTypes;

    if (type !== this.type) {
      this.manageStateTransition(type)(e);
      return;
    }

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

    const { x, y } = getElementProps(this.id)!;
    const startPoint = mouseToSvgCoords(e);

    this.deltaX = startPoint.x - x;
    this.deltaY = startPoint.y - y;
  };

  public handleMouseUp = () => {
    const { setDragging } = useStore.getState();
    setDragging(false);
    this.context.changeState(new Whiteboard());
  };

  public handleMouseMove = (e: MouseEvent<SVGSVGElement>): void => {
    const { isDragging, setElementProps, setShapeEditor } = useStore.getState();

    if (!isDragging) return;

    const startPoint = mouseToSvgCoords(e);

    setShapeEditor({ show: false });
    setElementProps(this.id, {
      x: startPoint.x - this.deltaX,
      y: startPoint.y - this.deltaY,
    });
  };
}

export default MouseEventContext;
