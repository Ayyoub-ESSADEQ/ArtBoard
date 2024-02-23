type onWheelCallback = (e: React.WheelEvent<SVGSVGElement>) => void;

interface WheelContextInt {
  state?: KeyboardState;
  zoom: onWheelCallback;
  scroll: onWheelCallback;
  setState: onWheelCallback;
}

interface KeyboardState {
  provideFunctionality: () => void;
}

class WheelContext implements WheelContext {}

class CtrlHolded implements KeyboardState {}

class ShiftHolded implements KeyboardState {}
