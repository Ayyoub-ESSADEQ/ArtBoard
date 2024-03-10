import { memo } from "react";
import useStore from "../../state/store";

interface ShapeProps extends React.SVGProps<SVGImageElement> {
  id: string;
}

export const Shape = memo((props: ShapeProps) => {
  const { setElementProps } = useStore();

  const handleImageLoad = (e: React.SyntheticEvent<SVGImageElement, Event>) => {
    const { width, height } = e.currentTarget.getBBox();
    setElementProps(props.id, { width: width, height: height });
    e.currentTarget.style.display = "none";
  };

  return (
    <>
      <defs>
        <pattern
          id={props.id}
          patternUnits="objectBoundingBox"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <image href={props.href} onLoad={handleImageLoad} />

          <image
            href={props.href}
            width="1"
            height="1"
            preserveAspectRatio="none"
          />
        </pattern>
      </defs>

      <rect
        x={props.x}
        y={props.y}
        id={props.id}
        // key={props.key}
        width={props.width}
        height={props.height}
        fill={`url(#${props.id})`}
      />
    </>
  );
});
