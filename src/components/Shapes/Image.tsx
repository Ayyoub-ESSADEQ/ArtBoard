import useStore from "../../state/store";

interface ImageProps extends React.SVGProps<SVGImageElement> {
  id: string;
}

export default function Image(props: ImageProps) {
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
          id="star"
          patternUnits="objectBoundingBox"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <image
            href="https://cdn.dribbble.com/users/2635269/screenshots/18048306/media/139de3faf49d288071a1dc7a94dad10a.png?resize=1000x750&vertical=center"
            onLoad={handleImageLoad}
          />

          <image
            href="https://cdn.dribbble.com/users/2635269/screenshots/18048306/media/139de3faf49d288071a1dc7a94dad10a.png?resize=1000x750&vertical=center"
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
        fill="url(#star)"
      />
    </>
  );
}
