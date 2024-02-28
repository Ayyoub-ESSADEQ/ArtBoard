/* eslint-disable @typescript-eslint/no-explicit-any */
import useStore from "../state/store";
import { MouseEvent, WheelEvent } from "react";

/// Here is the state intereface that each concrete implementation should implement
abstract class State {
  public abstract handleMouseDown(e: MouseEvent<any>): void;
  public abstract handleMouseUp(e: MouseEvent<any>): void;
  public abstract handleMouseMove(e: MouseEvent<any>): void;
  public abstract handleMouseWheel(e: WheelEvent<SVGSVGElement>): void;
  protected context!: MouseEventContext;

  public setContext(context: MouseEventContext) {
    this.context = context;
  }
}

class MouseEventContext {
  private state: State;

  constructor(initialState: State) {
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.changeState = this.changeState.bind(this);
    this.getState = this.getState.bind(this);
    this.changeState(initialState);
    this.state = initialState;
  }

  public handleMouseDown(e: MouseEvent<any>) {
    this.state.handleMouseDown(e);
  }

  public handleMouseUp(e: MouseEvent<any>) {
    this.state.handleMouseUp(e);
  }

  public handleMouseMove(e: MouseEvent<any>) {
    this.state.handleMouseMove(e);
  }

  public handleMouseWheel(e: WheelEvent<SVGSVGElement>) {
    this.state.handleMouseWheel(e);
  }

  public changeState(state: State) {
    this.state = state;
    this.state.setContext(this);
  }

  public getState() {
    return this.state;
  }
}

export class Whiteboard extends State {
  static whiteboardReference?: React.RefObject<SVGSVGElement>;

  private handleZoom(e: WheelEvent<SVGSVGElement>) {
    if (!Whiteboard.whiteboardReference?.current || !e.ctrlKey) return;

    const {
      backgroundPosition,
      viewBox,
      setBackgroundPosition,
      setViewBox,
      scale,
      setScale,
    } = useStore.getState();

    const point = new DOMPoint();
    const SCALING_FACTOR = e.deltaY > 0 ? 1 / 1.1 : 1.1;

    point.x = e.clientX;
    point.y = e.clientY;

    setScale(scale * SCALING_FACTOR);

    const startPoint = point.matrixTransform(
      Whiteboard.whiteboardReference.current.getScreenCTM()?.inverse()
    );

    setViewBox({
      x: viewBox.x - (startPoint.x - viewBox.x) * (SCALING_FACTOR - 1),
      y: viewBox.y - (startPoint.y - viewBox.y) * (SCALING_FACTOR - 1),
      width: viewBox.width * SCALING_FACTOR,
      height: viewBox.height * SCALING_FACTOR,
    });

    setBackgroundPosition({
      x:
        backgroundPosition.x -
        (startPoint.x - viewBox.x) * (SCALING_FACTOR - 1),
      y:
        backgroundPosition.y -
        (startPoint.x - viewBox.y) * (SCALING_FACTOR - 1),
    });
  }

  private handleScrollHorizontally(e: WheelEvent<SVGSVGElement>) {
    if (!e.shiftKey) return;

    const { backgroundPosition, viewBox, setBackgroundPosition, setViewBox } =
      useStore.getState();

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x - e.deltaY,
      y: viewBox.y,
    });

    setBackgroundPosition({
      x: backgroundPosition.x + e.deltaY,
      y: backgroundPosition.y,
    });
  }

  private handleScrollVertically(e: WheelEvent<SVGSVGElement>) {
    if (e.shiftKey || e.ctrlKey) return;
    const { backgroundPosition, viewBox, setBackgroundPosition, setViewBox } =
      useStore.getState();

    setViewBox({
      width: viewBox.width,
      height: viewBox.height,
      x: viewBox.x - e.deltaX,
      y: viewBox.y - e.deltaY,
    });

    setBackgroundPosition({
      x: backgroundPosition.x + e.deltaX,
      y: backgroundPosition.y + e.deltaY,
    });
  }

  public handleMouseWheel(e: WheelEvent<SVGSVGElement>) {
    this.handleZoom(e);
    this.handleScrollHorizontally(e);
    this.handleScrollVertically(e);
  }

  public handleMouseMove(e: MouseEvent<any>): void {
    const {
      scale,
      viewBox,
      backgroundPosition,
      startCoords,
      isDragging,
      setViewBox,
      setBackgroundPosition,
      setStartCoords,
    } = useStore.getState();

    if (!isDragging) return;
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
  }

  public handleMouseDown(e: MouseEvent<any>) {
    const target = e.target as HTMLElement;
    
    const { setDragging, setStartCoords, setFocusedComponentId } = useStore.getState();
    setFocusedComponentId(target.id);

    switch (target.dataset.type) {
      case "handler":
        this.context.changeState(new Handler());
        this.context.getState().handleMouseDown(e);
        return;

      case "whiteboard":
        this.context.changeState(this);
        setDragging(true);
        setStartCoords({ x: e.clientX, y: e.clientY });
        return;

      case "shape":
        this.context.changeState(new Shape());
        this.context.getState().handleMouseDown(e);
        return;
    }
  }

  public handleMouseUp() {
    const { setDragging } = useStore.getState();
    setDragging(false);
  }
}

export class Handler extends State {
  handleMouseWheel() {}

  handleMouseDown(e: MouseEvent<any>) {
    const target = e.target as HTMLElement;

    if (target.dataset.type === "whiteboard") {
      this.context.changeState(new Whiteboard());
      this.context.getState().handleMouseDown(e);
      console.log("Go back to whiteboard");
      return;
    }

    console.log("Go to ResizableFrame");
  }

  handleMouseUp() {
    // console.log(e);
  }

  public handleMouseMove(): void {
    // const state = useStore.getState();
    // const { startCoords, isDragging, setStartCoords, setElementProps, getElementProps } = state;
    // if (!isDragging) return;
    // const deltaX = e.clientX - startCoords.x;
    // const deltaY = e.clientY - startCoords.y;
    // setElementProps('', {})
    // setStartCoords({ x: e.clientX, y: e.clientY });
  }
}

export class Shape extends State {
  private id!: string;
  private deltaX = 0;
  private deltaY = 0;

  handleMouseWheel() {}
  handleMouseDown(e: MouseEvent<any>) {
    const target = e.target as HTMLElement;
    const {
      setDragging,
      setStartCoords,
      getElementProps,
      setFocusedComponentId,
    } = useStore.getState();

    if (target.dataset.type === "whiteboard") {
      this.context.changeState(new Whiteboard());
      this.context.getState().handleMouseDown(e);
      console.log("Go back to whiteboard");
      return;
    }

    this.id = target.id;
    setFocusedComponentId(target.id);

    const { x, y } = getElementProps(this.id)!;

    setDragging(true);
    setStartCoords({ x: e.clientX, y: e.clientY });
    const svg = document.getElementById("whiteboard")! as any;
    const point = new DOMPoint();

    point.x = e.clientX;
    point.y = e.clientY;

    const startPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

    this.deltaX = startPoint.x - x;
    this.deltaY = startPoint.y - y;
  }

  handleMouseUp() {
    const { setDragging } = useStore.getState();
    setDragging(false);
  }

  public handleMouseMove(e: MouseEvent<any>): void {
    const { isDragging, setElementProps } = useStore.getState();
    if (!isDragging) return;

    const svg = document.getElementById("whiteboard")! as any;
    const point = new DOMPoint();

    point.x = e.clientX;
    point.y = e.clientY;

    const startPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

    setElementProps(this.id, {
      x: startPoint.x - this.deltaX,
      y: startPoint.y - this.deltaY,
    });
  }
}

export default MouseEventContext;
