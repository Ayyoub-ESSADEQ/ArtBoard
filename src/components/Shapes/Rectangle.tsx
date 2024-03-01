
interface RectangleProps extends React.SVGProps<SVGRectElement> {
  id: string;
}

export default function Rectangle(props: RectangleProps) {
  return <rect {...props} />;
}
