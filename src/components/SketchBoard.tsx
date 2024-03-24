import { memo } from "react";
import { Rectangle } from "./Shapes/Rectangle";
import { Shape } from "./Shapes/Shape";
import { Text } from "./Shapes/Text";
import { Circle } from "./Shapes/Circle";

import useStore from "../state/store";
import Collaboration from "./Collaboration";
import Resizer from "./Resizer";

const SketchBoard = memo(() => {
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

export default SketchBoard;
