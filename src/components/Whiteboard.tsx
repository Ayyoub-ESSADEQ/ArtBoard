import React, { useEffect, useRef } from "react";
import Panel from "./Panel";
import { usePreventBrowserZoom } from "../hooks/usePreventBrowserZoom";
import useStore from "../state/store";
import Resizer from "./Resizer";
import { useFullScreen } from "../hooks/useFullScreen";
import MouseEventContext, { Whiteboard } from "../utils/MouseEventContext";
import Rectangle from "./Shapes/Rectangle";
import Image from "./Shapes/Image";
import Text from "./Shapes/Text";
import Header from "./Header";

export default function SketchBoard() {
  const whiteboardRef = useRef<SVGSVGElement>(null);
  const whiteboard = useRef(new MouseEventContext(new Whiteboard()));

  const { initialDrawing, backgroundPosition, viewBox, scale } = useStore(
    (state) => state
  );

  useFullScreen(whiteboardRef);
  usePreventBrowserZoom();
  useEffect(() => {
    Whiteboard.whiteboardReference = whiteboardRef;
  });

  return (
    <>
      <Header></Header>
      <svg
        id="whiteboard"
        ref={whiteboardRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={whiteboard.current.handleMouseDown}
        onMouseMove={whiteboard.current.handleMouseMove}
        onMouseUp={whiteboard.current.handleMouseUp}
        onWheel={whiteboard.current.handleMouseWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="bg-lined-grid overflow-hidden"
        data-type="whiteboard"
        style={{
          backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
          backgroundSize: `${2.9 / scale}rem ${2.9 / scale}rem`,
        }}
      >
        <Text />
        {initialDrawing.map(({ id, width, height, fill, x, y, type }) => {
          switch (type) {
            case "rect":
              return (
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
              );

            case "image":
              return (
                <Resizer key={id}>
                  <Image
                    x={x}
                    y={y}
                    fill={fill}
                    key={id}
                    id={id}
                    href="https://cdn.dribbble.com/userupload/13126159/file/original-ff60d211ab88356265a8f6370217f541.png?resize=400x300&vertical=center"
                  />
                </Resizer>
              );
            default:
              return <></>;
          }
        })}
      </svg>
      <Panel />
    </>
  );
}
