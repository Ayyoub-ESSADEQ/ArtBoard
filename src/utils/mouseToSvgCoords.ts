import { Whiteboard } from "./MouseEventContext";

export default function mouseToSvgCoords(e: React.MouseEvent<unknown>) {
  const svg = Whiteboard.whiteboardReference?.current;
  const point = new DOMPoint();

  point.x = e.clientX;
  point.y = e.clientY;

  return point.matrixTransform(svg?.getScreenCTM()?.inverse());
}
