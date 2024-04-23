import { Circle, Connector, Rectangle, Shape, Text } from "Components/Shapes";
import { memo } from "react";

import { Collaboration, Resizer } from "Components";
import useStore from "Store";

export const SketchBoard = memo(() => {
  const { board } = useStore();

  return (
    <>
      <g>
        {board.map(({ id, type, props }) => {
          switch (type) {
            case "rectangle":
              return <Rectangle {...props} key={id} id={id} rx="8" />;

            case "circle":
              return <Circle key={id} id={id} {...props} />;

            case "text":
              return <Text key={id} id={id} {...props} />;

            case "shape":
              return <Shape key={id} id={id} {...props} />;

            case "connector":
              return <Connector key={id} id={id} {...props} />;

            default:
              return <></>;
          }
        })}
      </g>
      <g>
        <Resizer />
      </g>
      <Collaboration />
    </>
  );
});
