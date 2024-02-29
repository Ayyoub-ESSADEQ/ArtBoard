import { useEffect, useRef } from "react";
import { usePreventBrowserZoom } from "../hooks/usePreventBrowserZoom";
import useStore from "../state/store";
import Resizer from "./Resizer";
import { useFullScreen } from "../hooks/useFullScreen";
import MouseEventContext, { Whiteboard } from "../utils/MouseEventContext";
import Rectangle from "./Shapes/Rectangle";
import Image from "./Shapes/Image";
import Text from "./Shapes/Text";
import Circle from "./Shapes/Circle";

export default function SketchBoard() {
  const whiteboardRef = useRef<SVGSVGElement>(null);
  const whiteboard = useRef(new MouseEventContext(new Whiteboard()));

  const { initialDrawing, backgroundPosition, viewBox, scale } = useStore();

  useFullScreen(whiteboardRef);
  usePreventBrowserZoom();
  useEffect(() => {
    Whiteboard.whiteboardReference = whiteboardRef;
  });

  return (
      <svg
        id="whiteboard"
        ref={whiteboardRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={whiteboard.current.handleMouseDown}
        onMouseMove={whiteboard.current.handleMouseMove}
        onMouseUp={whiteboard.current.handleMouseUp}
        onWheel={whiteboard.current.handleMouseWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute top-0 left-0 bg-dotted-grid overflow-hidden"
        data-type="whiteboard"
        style={{
          backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
          backgroundSize: `${2.9 / scale}rem ${2.9 / scale}rem`,
        }}
      >
        {initialDrawing.map(({ id, width, height, fill, x, y, type }) => {
          switch (type) {
            case "rect":
              return (
                <Resizer key={id}>
                  <Rectangle
                    width={width}
                    height={height}
                    fill={fill}
                    key={id}
                    id={id}
                    x={x}
                    y={y}
                  />
                </Resizer>
              );

            case "circle":
              return (
                <Resizer key={id}>
                  <Circle
                    width={width}
                    height={height}
                    fill={fill}
                    key={id}
                    id={id}
                    x={x}
                    y={y}
                  />
                </Resizer>
              );

            case "image":
              return (
                <Resizer key={id}>
                  <Image
                    x={x}
                    y={y}
                    id={id}
                    key={id}
                    fill={fill}
                    href="https://cdn.dribbble.com/users/2635269/screenshots/18048306/media/139de3faf49d288071a1dc7a94dad10a.png?resize=1000x750&vertical=center"
                  />
                </Resizer>
              );

            case "text":
              return (
                <Resizer key={id}>
                  <Text
                    key={id}
                    id={id}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    className="z-[100]"
                  />
                </Resizer>
              );
            default:
              return <></>;
          }
        })}
      </svg>
  );
}
