import { memo } from "react";

interface RectangleProps extends React.SVGProps<SVGRectElement> {
  id: string;
}

export const Rectangle = memo((props: RectangleProps) => {
  return <rect {...props}/>;
});
