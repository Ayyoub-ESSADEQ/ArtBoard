import { memo } from "react";
import { Rectangle } from "./Shapes/Rectangle";
import { Shape } from "./Shapes/Shape";
import { Text } from "./Shapes/Text";
import { Circle } from "./Shapes/Circle";

import useStore from "../state/store";
import Resizer from "./Resizer";
import Collaboration from "./Collaboration";

const SketchBoard = memo(() => {
  const { board } = useStore();

  return (
    <>
      <g>
        {board.map(({ id, type, props }) => {
          switch (type) {
            case "rectangle":
              return (
                <Resizer key={id}>
                  <Rectangle {...props} key={id} id={id} rx="8" />
                </Resizer>
              );

            case "circle":
              return (
                <Resizer key={id}>
                  <Circle key={id} id={id} {...props} />
                </Resizer>
              );

            case "text":
              return (
                <Resizer key={id}>
                  <Text key={id} id={id} {...props} />
                </Resizer>
              );

            case "shape":
              return (
                <Resizer key={id}>
                  <Shape key={id} id={id} {...props} />
                </Resizer>
              );

            default:
              return <></>;
          }
        })}
      </g>
      <Collaboration />
    </>
  );
});

export default SketchBoard;
