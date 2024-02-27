// import useStore from "../../state/store";

interface RectangleProps extends React.SVGProps<SVGRectElement> {
  id: string;
}

export default function Rectangle(props: RectangleProps) {
//   const { getElementProps, updateDrawing } = useStore((state) => state);
  return <rect {...props} />;
}
