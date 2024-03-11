import useStore, { Tool } from "../state/store";
import { MouseEvent, WheelEvent } from "react";
import mouseToSvgCoords from "./mouseToSvgCoords";

type GlobalTypes = "whiteboard" | "handler" | "shape";

interface Coords {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * @interface CustomMouseEvent
 */
interface CustomMouseEvent extends MouseEvent<SVGSVGElement> {
  /**
   * indicates that the state is being change from another state
   * meaning that the state should behave in a normal way without
   * using manageStateTransition
   *
   * @type {boolean}
   * @memberof CustomMouseEvent
   */
  skipStateTransition?: boolean;
}

/// Here is the state interface that each concrete implementation should implement
abstract class State {
  public abstract handleMouseDown(e: CustomMouseEvent): void;
  public abstract handleMouseUp(e: CustomMouseEvent): void;
  public abstract handleMouseMove(e: CustomMouseEvent): void;
  public abstract handleMouseWheel(e: WheelEvent<SVGSVGElement>): void;
  protected context!: MouseEventContext;

  public setContext(context: MouseEventContext) {
    this.context = context;
  }

  public manageStateTransition = (type: GlobalTypes) => {
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
  };
}

class MouseEventContext {
  private state: State;

  constructor(initialState: State) {
    this.changeState(initialState);
    this.state = initialState;
  }

  public handleMouseDown = (e: CustomMouseEvent) => {
    this.state.handleMouseDown(e);
  };

  public handleMouseUp = (e: CustomMouseEvent) => {
    this.state.handleMouseUp(e);
  };

  public handleMouseMove = (e: CustomMouseEvent) => {
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

    const { viewBox, scale, setViewBox, setScale } = useStore.getState();

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

  public handleMouseMove = (e: CustomMouseEvent): void => {
    const {
      scale,
      viewBox,
      startCoords,
      isDragging,
      toolInUseName,
      setViewBox,
      setWhiteboardCursor,
      setStartCoords,
    } = useStore.getState();

    if (!isDragging) return;

    if (toolInUseName === "Pan") setWhiteboardCursor("grabbing");

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

  public handleMouseDown = (e: CustomMouseEvent) => {
    const target = e.target as HTMLElement;
    const type = target.dataset.type as GlobalTypes;

    if (!e.skipStateTransition && type !== this.type) {
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

    if (!e.skipStateTransition) setFocusedComponentId(target.id);
    if (toolInUseName !== "Pan") return;

    setDragging(true);
    setShapeEditor({ show: false });
    setStartCoords({ x: e.clientX, y: e.clientY });
  };

  public handleMouseUp() {
    const { setDragging, setShapeEditor, toolInUseName, setWhiteboardCursor } =
      useStore.getState();
    setDragging(false);
    if (toolInUseName === "Pan") setWhiteboardCursor(Tool[toolInUseName]);
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
  private preserveAspectRatio = false;

  public handleMouseWheel = () => {};

  public handleMouseDown = (e: CustomMouseEvent) => {
    const target = e.target as HTMLElement;
    const dataType = target.dataset.type as GlobalTypes;

    if (dataType !== this.type) {
      this.manageStateTransition(dataType)(e);
      return;
    }

    const { setFocusedComponentId, setDragging, getElementProps } =
      useStore.getState();

    this.id = target.id;
    setFocusedComponentId(this.id);

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
    this.context.changeState(new Whiteboard());
  };

  public handleMouseMove = (e: CustomMouseEvent): void => {
    const { isDragging, setElementProps } = useStore.getState();
    if (!isDragging) return;

    const cursor = mouseToSvgCoords(e);
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

export class Shape extends State {
  private id!: string;
  private deltaX = 0;
  private deltaY = 0;
  private type = "shape";
  private tool = "Select";

  public handleMouseWheel() {}

  public handleMouseDown = (e: CustomMouseEvent) => {
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
      toolInUseName,
    } = useStore.getState();

    if (toolInUseName === "Pan") {
      e.skipStateTransition = true;
      this.context.changeState(new Whiteboard());
      this.context.getState().handleMouseDown(e);
      return;
    }

    if (this.tool !== toolInUseName) return;

    this.id = target.id;

    setDragging(true);
    setStartCoords({ x: e.clientX, y: e.clientY });
    setFocusedComponentId(target.id);

    const { x, y } = getElementProps(this.id)!.props;
    const startPoint = mouseToSvgCoords(e);

    this.deltaX = startPoint.x - x;
    this.deltaY = startPoint.y - y;
  };

  public handleMouseUp = () => {
    const { setDragging } = useStore.getState();
    setDragging(false);
    this.context.changeState(new Whiteboard());
  };

  public handleMouseMove = (e: CustomMouseEvent): void => {
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
