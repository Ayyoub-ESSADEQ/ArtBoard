import { useState, MouseEvent, useRef, WheelEvent } from "react";
import Panel from "./Panel";
import Resizer from "./Resizer";
import Transformer from "./Transformer";
import useStore from "../state/store";
import { usePreventBrowserZoom } from "../hooks/usePreventBrowserZoom";

export default function Whiteboard() {
  const board = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const { shiftBy, setOffset, offset, scale, setScale, setOrigin } = useStore(
    (state) => state
  );
  usePreventBrowserZoom();

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.id !== "canvas") return;
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    shiftBy(deltaX + offset.x, deltaY + offset.y);
  };

  const handleMouseUp = () => {
    setOffset();
    setIsDragging(false);
  };

  const handleZoom = (event: WheelEvent) => {
    if (!event.ctrlKey) return;
    const delta = event.deltaY; // Get zoom direction
    const newZoom = Math.min(Math.max(scale.x + delta * 0.01, 0.5), 2); // Constrain zoom
    setOrigin(event.pageX, -event.pageY);
    setScale(newZoom);
  };

  return (
    <div
      className="w-full relative h-full bg-dotted-grid overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleZoom}
      ref={board}
      id="canvas"
    >
      <Transformer x={10} y={20}>
        <Resizer>
          <div className="h-12 w-12 rounded-full bg-cyan-300" />
        </Resizer>
      </Transformer>

      <Transformer x={200} y={100}>
        <Resizer>
          <div className="h-12 w-12 bg-red-300" />
        </Resizer>
      </Transformer>

      <Transformer x={1000} y={20}>
        <Resizer>
          <img src="https://cdn.dribbble.com/userupload/3669591/file/original-a3af71499069c1ea4edb90c17ad39453.png?resize=450x338&vertical=center" />
        </Resizer>
      </Transformer>
      <Panel />
    </div>
  );
}
