import React, { useState, useRef, MouseEvent, useEffect } from "react";
import Panel from "./Panel";
import { usePreventBrowserZoom } from "../hooks/usePreventBrowserZoom";

export default function Whiteboard() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: screen.availWidth,
    height: screen.availHeight,
  });
  const isDragging = useRef(false);
  const startCoords = useRef({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

  usePreventBrowserZoom();
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.style.width = `${screen.availWidth}px`;
      svgRef.current.style.height = `${screen.availHeight}px`;
    }
  });

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    isDragging.current = true;
    startCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    if (e.ctrlKey) {
      const point = new DOMPoint();

      const scaleDelta = e.deltaY > 0 ? 1 / 1.1 : 1.1;

      point.x = e.clientX;
      point.y = e.clientY;

      const startPoint = point.matrixTransform(
        svgRef.current.getScreenCTM()?.inverse()
      );

      setViewBox((prevViewBox) => ({
        ...prevViewBox,
        x: prevViewBox.x - (startPoint.x - viewBox.x) * (scaleDelta - 1),
        y: prevViewBox.y - (startPoint.y - viewBox.y) * (scaleDelta - 1),
        width: prevViewBox.width * scaleDelta,
        height: prevViewBox.height * scaleDelta,
      }));
    } else {
      if (e.shiftKey) {
        setViewBox((prevViewBox) => ({
          ...prevViewBox,
          x: prevViewBox.x - e.deltaY,
          y: prevViewBox.y,
        }));

        setBackgroundPosition((bgPosition) => ({
          ...bgPosition,
          x: bgPosition.x + e.deltaY,
          y: bgPosition.y,
        }));
      } else {
        setViewBox((prevViewBox) => ({
          ...prevViewBox,
          x: prevViewBox.x - e.deltaX,
          y: prevViewBox.y - e.deltaY,
        }));
        setBackgroundPosition((bgPosition) => ({
          ...bgPosition,
          x: bgPosition.x + e.deltaX,
          y: bgPosition.y + e.deltaY,
        }));
      }
    }
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - startCoords.current.x;
    const deltaY = e.clientY - startCoords.current.y;

    setBackgroundPosition((bgPosition) => ({
      ...bgPosition,
      x: bgPosition.x + deltaX,
      y: bgPosition.y + deltaY,
    }));

    setViewBox((prevViewBox) => ({
      ...prevViewBox,
      x: prevViewBox.x - deltaX,
      y: prevViewBox.y - deltaY,
    }));

    startCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="bg-dotted-grid overflow-hidden"
        style={{
          backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
        }}
      >
        {/* <rect fill="blue" x={2000} y={0} width={100} height={200} /> */}
        <g transform="translate(50, 50)">
          <g stroke="black">
            <image
              x={100}
              y={200}
              href="https://cdn.dribbble.com/userupload/13167166/file/original-140642a2435ad661883bc040b37c9a76.png?resize=400x300&vertical=center "
            />
          </g>

          <foreignObject className="relative overflow-visible">
          
            <div
              contentEditable="plaintext-only"
              className="absolute left-0 top- text-nowrap"
              suppressContentEditableWarning={true}
            >
              Editable Text
            </div>
          </foreignObject>
        </g>
      </svg>
      <Panel />
    </>
  );
}
