import { Whiteboard } from "Utils";

export function mouseToSvgCoords(e: React.MouseEvent<unknown>) {
  const svg = Whiteboard.whiteboardReference;
  const point = new DOMPoint();

  point.x = e.clientX;
  point.y = e.clientY;

  return point.matrixTransform(svg?.getScreenCTM()?.inverse());
}
