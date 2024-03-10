import { memo, useEffect, useRef } from "react";
import { usePreventBrowserZoom } from "../hooks/usePreventBrowserZoom";
import { useFullScreen } from "../hooks/useFullScreen";
import { Rectangle } from "./Shapes/Rectangle";
import { Shape } from "./Shapes/Shape";
import { Text } from "./Shapes/Text";
import { Circle } from "./Shapes/Circle";

import useStore from "../state/store";
import Resizer from "./Resizer";
import MouseEventContext, { Whiteboard } from "../utils/MouseEventContext";

// import useWebsocket from "../hooks/useWebsocket";

const SketchBoard = memo(() => {
  const whiteboardRef = useRef<SVGSVGElement>(null);
  const whiteboard = useRef(new MouseEventContext(new Whiteboard()));
  const { board, backgroundPosition, viewBox, scale, whiteboardCursor } =
    useStore();

  useFullScreen(whiteboardRef);
  usePreventBrowserZoom();
  useEffect(() => {
    Whiteboard.whiteboardReference = whiteboardRef;
  });

  useEffect(() => {
    if (!whiteboardRef.current) return;
    const whiteboard = whiteboardRef.current;
    whiteboard.style.cursor = `${whiteboardCursor}`;
  }, [whiteboardCursor]);

  // useWebsocket(whiteboardRef);

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
      className="absolute top-0 left-0 overflow-hidden"
      data-type="whiteboard"
      style={{
        backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
        backgroundSize: `${12 / scale}px ${12 / scale}px`,
        backgroundImage: `radial-gradient(circle, #c8d3de ${
          1 / scale
        }px, #ffffff ${1 / scale}px)`,
      }}
    >
      {board.map(({ id, type, props }) => {
        switch (type) {
          case "rectangle":
            return (
              <Resizer key={id}>
                <Rectangle {...props} key={id} id={id} rx="15" />
              </Resizer>
            );

          case "circle":
            return (
              <Resizer key={id}>
                <Circle key={id} id={id} {...props} />
              </Resizer>
            );

          case "text":
            return (
              <Resizer key={id}>
                <Text key={id} id={id} {...props} />
              </Resizer>
            );

          case "shape":
            return (
              <Resizer key={id}>
                <Shape key={id} id={id} {...props} />
              </Resizer>
            );

          default:
            return <></>;
        }
      })}
    </svg>
  );
});

export default SketchBoard;
