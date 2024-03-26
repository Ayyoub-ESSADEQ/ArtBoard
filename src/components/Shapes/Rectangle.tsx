import { memo } from "react";
import useStore from "../../state/store";

export interface RectangleProps extends React.SVGProps<SVGRectElement> {
  id: string;
}

export const Rectangle = memo((props: RectangleProps) => {
  const { scale, toolInUseName, setShapeEditor } = useStore();
  const edit = (e: React.MouseEvent<SVGRectElement>) => {
    if (toolInUseName !== "Select") return;
    const target = e.target as SVGRectElement;
    const { top, left } = target.getBoundingClientRect();
    setShapeEditor({
      show: true,
      x: left + parseFloat(props.width as string) / (2 * scale),
      y: top,
    });
  };
  return (
    <rect {...props} data-type="shape" id={`${props.id}`} onClick={edit} />
  );
});
