import { Circle } from "./icons/Circle";
import { Rectangle } from "./icons/Rectangle";
import { Image } from "./icons/Image";
import { Text } from "./icons/Text";
import { Sticker } from "./icons/Sticker";
import { Drag } from "./icons/Drag";
import { Select } from "./icons/Select";
import { Arrow } from "./icons/Arrow";

interface ToolProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactComponentElement<any> | string;
}

const Tool = (props: ToolProps) => {
  return (
    <div className="h-12 w-12 select-none hover:bg-gray-400 cursor-pointer bg-white rounded-md flex justify-center items-center">
      {props?.children}
    </div>
  );
};

export default function ToolBox() {
  return (
    <div className="bg-white rounded-md shadow-md border-solid border-2 border-gray-200 p-1 box-border flex flex-row gap-1 fixed bottom-2 left-[50%] translate-x-[-50%]">
      <Tool>
        <Rectangle />
      </Tool>
      <Tool>
        <Circle />
      </Tool>
      <Tool>
        <Image />
      </Tool>
      <Tool>
        <Text />
      </Tool>
      <Tool>
        <Sticker />
      </Tool>
      <Tool>
        <Drag />
      </Tool>
      <Tool>
        <Arrow />
      </Tool>
      <Tool>
        <Select />
      </Tool>
    </div>
  );
}
