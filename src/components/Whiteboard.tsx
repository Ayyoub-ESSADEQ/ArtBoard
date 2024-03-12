import { memo, useEffect, useRef } from "react";
import { usePreventBrowserZoom } from "../hooks/usePreventBrowserZoom";
import { useFullScreen } from "../hooks/useFullScreen";
import { Rectangle } from "./Shapes/Rectangle";
import { Shape } from "./Shapes/Shape";
import { Text } from "./Shapes/Text";
import { Circle } from "./Shapes/Circle";

import useStore from "../state/store";
import Resizer from "./Resizer";
import BackgroundGrid from "./BackgroundGrid";
import { Whiteboard } from "../utils/MouseStrategy";
import { handleMouseDown } from "../utils/ManageWhiteboardStrategies";

// import useWebsocket from "../hooks/useWebsocket";

const SketchBoard = memo(() => {
  const whiteboardRef = useRef<SVGSVGElement>(null);
  const { board, viewBox, whiteboardCursor, context } = useStore();

  useFullScreen(whiteboardRef);
  usePreventBrowserZoom();
  useEffect(() => {
    Whiteboard.whiteboardReference = whiteboardRef.current;
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
      onMouseDown={handleMouseDown}
      onMouseMove={context.handleMouseMove}
      onMouseUp={context.handleMouseUp}
      onWheel={context.handleMouseWheel}
      onContextMenu={(e) => e.preventDefault()}
      className="absolute top-0 left-0 overflow-hidden"
    >
      <BackgroundGrid />
      <g>
        {board.map(({ id, type, props }) => {
          switch (type) {
            case "rectangle":
              return (
                <Resizer key={id}>
                  <Rectangle {...props} key={id} id={id} rx="8" />
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
      </g>
    </svg>
  );
});

export default SketchBoard;
