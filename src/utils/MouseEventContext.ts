/* eslint-disable @typescript-eslint/no-explicit-any */
import useStore, { BearState } from "../state/store";
import { MouseEvent } from "react";

/// Here is the state intereface that each concrete implementation should implement
interface State {
  handleMouseDown: (e: MouseEvent<any>) => void;
  handleMouseUp: (e: MouseEvent<any>) => void;
  handleMouseMove: (e: MouseEvent<any>) => void;
}

interface Context extends State {
  changeState: (state: State) => void;
}

class MouseEventContext implements Context {
  public state: State;

  constructor(initialState: State) {
    this.state = initialState;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
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

  public changeState(state: State) {
    this.state = state;
  }
}

export class Whiteboard implements State {
  private state: BearState = useStore.getState();

  constructor() {
    const listener = () => (this.state = useStore.getState());
    listener.bind(this);
    useStore.subscribe(listener);
  }

  handleMouseMove(e: MouseEvent<any>) {
    const {
      viewBox,
      backgroundPosition,
      startCoords,
      isDragging,
      setViewBox,
      setBackgroundPosition,
      setStartCoords,
    } = this.state;

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
      x: viewBox.x - deltaX,
      y: viewBox.y - deltaY,
    });

    setStartCoords({ x: e.clientX, y: e.clientY });
  }

  handleMouseDown(e: MouseEvent<any>) {
    const target = e.target as HTMLElement;
    const { setDragging, setStartCoords } = this.state;

    if (target.dataset.type !== "whiteboard") return;

    setDragging(true);
    setStartCoords({ x: e.clientX, y: e.clientY });
  }

  handleMouseUp() {
    const { setDragging } = this.state;
    setDragging(false);
  }
}

export default MouseEventContext;
