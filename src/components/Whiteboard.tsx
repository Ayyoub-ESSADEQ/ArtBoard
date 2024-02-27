import React, { useRef, useState } from "react";
import Panel from "./Panel";
import { usePreventBrowserZoom } from "../hooks/usePreventBrowserZoom";
import useStore from "../state/store";
import Rectangle from "./Shapes/Rectangle";
import Resizer from "./Resizer";
import { useFullScreen } from "../hooks/useFullScreen";
import MouseEventContext, { Whiteboard } from "../utils/MouseEventContext";

export default function SketchBoard() {
  const whiteboardRef = useRef<SVGSVGElement>(null);
  const state = useStore((state) => state);
  const [whiteboard] = useState(new MouseEventContext(new Whiteboard()));

  const {
    initialDrawing,
    backgroundPosition,
    viewBox,
    setBackgroundPosition,
    setViewBox,
  } = state;

  usePreventBrowserZoom();
  useFullScreen(whiteboardRef);

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (!whiteboardRef.current) return;

    if (e.ctrlKey) {
      const point = new DOMPoint();
      const scale = e.deltaY > 0 ? 1 / 1.1 : 1.1;

      point.x = e.clientX;
      point.y = e.clientY;

      const startPoint = point.matrixTransform(
        whiteboardRef.current.getScreenCTM()?.inverse()
      );

      setViewBox({
        x: viewBox.x - (startPoint.x - viewBox.x) * (scale - 1),
        y: viewBox.y - (startPoint.y - viewBox.y) * (scale - 1),
        width: viewBox.width * scale,
        height: viewBox.height * scale,
      });

      return;
    }

    if (e.shiftKey) {
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

      return;
    }

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
  };

  return (
    <>
      <svg
        ref={whiteboardRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={whiteboard.handleMouseDown}
        onMouseMove={whiteboard.handleMouseMove}
        onMouseUp={whiteboard.handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="bg-dotted-grid overflow-hidden"
        data-type="whiteboard"
        style={{
          backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
        }}
      >
        {initialDrawing.map(({ id, width, height, fill, x, y }) => (
          <Resizer key={id}>
            <Rectangle
              width={width}
              height={height}
              x={x}
              y={y}
              fill={fill}
              key={id}
              id={id}
            />
          </Resizer>
        ))}
      </svg>
      <Panel />
    </>
  );
}
