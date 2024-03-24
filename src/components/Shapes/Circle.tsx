import { memo } from "react";
import { Rectangle, RectangleProps } from "./Rectangle";

export const Circle = memo((props: RectangleProps) => {
  return (
    <Rectangle
      rx={(props.width as number) / 2}
      ry={(props.height as number) / 2}
      {...props}
      ref={null}
    />
  );
});
