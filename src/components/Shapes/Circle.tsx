// import useStore from "../../state/store";

interface RectangleProps extends React.SVGProps<SVGRectElement> {
  id: string;
}

export default function Circle(props: RectangleProps) {
  //   const { getElementProps, updateDrawing } = useStore((state) => state);
  return (
    <rect
      rx={(props.width as number) / 2}
      ry={(props.height as number) / 2}
      {...props}
    />
  );
}
