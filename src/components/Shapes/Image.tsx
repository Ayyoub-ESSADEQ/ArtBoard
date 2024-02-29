import useStore from "../../state/store";

interface ImageProps extends React.SVGProps<SVGImageElement> {
  id: string;
}

export default function Image(props: ImageProps) {
  const { setElementProps } = useStore();

  const handleImageLoad = (e: React.SyntheticEvent<SVGImageElement, Event>) => {
    const { width, height } = e.currentTarget.getBBox();
    setElementProps(props.id, { width: width, height: height });
  };

  return (
    <image {...props} onLoad={handleImageLoad} preserveAspectRatio="true" />
  );
}
