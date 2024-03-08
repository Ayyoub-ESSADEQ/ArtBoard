import { memo } from "react";

interface ImageProps extends React.SVGProps<SVGImageElement> {
  id: string;
}

export const Hexagonal = memo((props: ImageProps) => {
  return (
    <>
      <defs>
        <pattern
          id="hexagonal"
          patternUnits="objectBoundingBox"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          {/* We need to add the new element here and that's it */}
          <polygon
            points="0.5,0.005 0.995,0.25 0.995,0.75 0.5,0.995 0.005,0.75 0.005,0.25"
            fill="yellow"
            stroke="black"
            strokeWidth="0.01"
          />
        </pattern>
      </defs>

      <rect
        x={props.x}
        y={props.y}
        id={props.id}
        width={props.width}
        height={props.height}
        fill="url(#hexagonal)"
      />
    </>
  );
});
