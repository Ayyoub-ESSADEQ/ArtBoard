/* eslint-disable @typescript-eslint/no-unused-vars */
type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class Context {
  protected state: KeyboardState;
  protected setViewBox: React.Dispatch<React.SetStateAction<ViewBox>>;

  constructor(
    state: KeyboardState,
    callback: React.Dispatch<React.SetStateAction<ViewBox>>
  ) {
    this.setViewBox = callback;
    this.state = state;
  }

  public changeState(state: KeyboardState) {
    this.state = state;
  }
}

abstract class KeyboardState {
  protected context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  abstract zoom(e: React.WheelEvent<SVGSVGElement>): void;
  abstract scrollHorizontally(e: React.WheelEvent<SVGSVGElement>): void;
  abstract scrollVertically(e: React.WheelEvent<SVGSVGElement>): void;
}

class CtrlHolded extends KeyboardState {
  zoom(e: React.WheelEvent<SVGSVGElement>): void {
    if (e.shiftKey) {
      this.context.changeState(new ShiftHolded(this.context));
    }
  }

  scrollHorizontally(_e: React.WheelEvent<SVGSVGElement>): void {}

  scrollVertically(_e: React.WheelEvent<SVGSVGElement>): void {}
}

class ShiftNotHolded extends KeyboardState {
  zoom(_e: React.WheelEvent<SVGSVGElement>): void {}
  scrollHorizontally(_e: React.WheelEvent<SVGSVGElement>): void {}
  scrollVertically(_e: React.WheelEvent<SVGSVGElement>): void {}
}

class ShiftHolded extends KeyboardState {
  zoom(_e: React.WheelEvent<SVGSVGElement>): void {}
  scrollHorizontally(_e: React.WheelEvent<SVGSVGElement>): void {}
  scrollVertically(_e: React.WheelEvent<SVGSVGElement>): void {}
}
