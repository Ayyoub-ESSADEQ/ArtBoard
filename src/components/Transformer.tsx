import { useRef, useState } from "react";
import useStore from "../state/store";

export default function Transformer({
  children,
  x,
  y,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactComponentElement<any>;
  x: number;
  y: number;
}) {
  const { shift, scale, transformOrigin } = useStore((state) => state);
  const [isDragging, setIsDragging] = useState(false);
  const target = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.id !== "canvas") return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (target.current) {
      target.current.style.top = `${e.clientY}px`;
      target.current.style.left = `${e.clientX}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      ref={target}
      style={{
        position: "absolute",
        transform: `matrix(${scale.x}, 0, 0, ${scale.y}, ${shift.x}, ${shift.y})`,
        transformOrigin: `${transformOrigin.x}px ${transformOrigin.y}px`,
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      {children}
    </div>
  );
}
