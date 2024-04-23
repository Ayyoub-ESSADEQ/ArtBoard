import { useFullScreen, usePreventBrowserZoom } from "Hooks";
import { Whiteboard, handleMouseDown } from "Utils";
import { memo, useEffect, useRef } from "react";

import { BackgroundGrid, SketchBoard } from "Components";
import { useWebsocket } from "Hooks";
import useStore from "Store";

export const Board = memo(() => {
  const whiteboardRef = useRef<SVGSVGElement>(null);
  const { viewBox, whiteboardCursor, context } = useStore();

  useFullScreen(whiteboardRef);
  usePreventBrowserZoom();
  useWebsocket(whiteboardRef);

  useEffect(() => {
    Whiteboard.whiteboardReference = whiteboardRef.current;
  });

  useEffect(() => {
    if (!whiteboardRef.current) return;
    const whiteboard = whiteboardRef.current;
    const classList = whiteboard.classList;
    const previousCursor = classList.item(classList.length - 1)!;
    classList.remove(previousCursor);
    classList.add(whiteboardCursor);
  }, [whiteboardCursor]);

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
      className="absolute top-0 left-0 overflow-hidden cursor-select"
    >
      <BackgroundGrid />
      <SketchBoard />
    </svg>
  );
});
