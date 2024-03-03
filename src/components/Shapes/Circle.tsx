// import useStore from "../../state/store";

import { memo } from "react";

interface RectangleProps extends React.SVGProps<SVGRectElement> {
  id: string;
}

export const Circle = memo((props: RectangleProps) => {
  //   const { getElementProps, updateDrawing } = useStore((state) => state);
  return (
    <rect
      rx={(props.width as number) / 2}
      ry={(props.height as number) / 2}
      {...props}
    />
  );
});
