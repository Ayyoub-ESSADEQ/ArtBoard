import { Circle } from "./icons/Circle";
import { Rectangle } from "./icons/Rectangle";
import { Image } from "./icons/Image";
import { Text } from "./icons/Text";
import { Sticker } from "./icons/Sticker";
import { Drag } from "./icons/Drag";
import { Select } from "./icons/Select";
import { Arrow } from "./icons/Arrow";
import useStore, { Tool } from "../state/store";
import { memo } from "react";

interface ToolProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactComponentElement<any> | string;
  functionality: keyof typeof Tool;
}

const ToolItem = (props: ToolProps) => {
  const { toolInUseName } = useStore();
  const { setToolInUseName, setWhiteboardCursor } = useStore();

  const active =
    toolInUseName === props.functionality ? "bg-violet-300" : "bg-white";

  const setToolAndCursor = () => {
    setToolInUseName(props.functionality);
    setWhiteboardCursor(Tool[props.functionality]);
    console.log(Tool[props.functionality]);
  };

  return (
    <div
      onClick={setToolAndCursor}
      className={`h-12 w-12 select-none ${
        active === "bg-white" ? "hover:bg-gray-100" : ""
      } cursor-pointer ${active} rounded-md flex justify-center items-center`}
    >
      {props?.children}
    </div>
  );
};

const ToolBox = memo(() => {
  return (
    <div className="bg-white rounded-md shadow-md border-solid border-2 border-gray-200 p-1 box-border flex flex-row gap-1 fixed bottom-2 left-[50%] translate-x-[-50%]">
      <ToolItem functionality={"Rectangle"}>
        <Rectangle />
      </ToolItem>
      <ToolItem functionality={"Circle"}>
        <Circle />
      </ToolItem>
      <ToolItem functionality={"Image"}>
        <Image />
      </ToolItem>
      <ToolItem functionality={"Text"}>
        <Text />
      </ToolItem>
      <ToolItem functionality={"Sticker"}>
        <Sticker />
      </ToolItem>
      <ToolItem functionality={"Pan"}>
        <Drag />
      </ToolItem>
      <ToolItem functionality={"Arrow"}>
        <Arrow />
      </ToolItem>
      <ToolItem functionality={"Select"}>
        <Select />
      </ToolItem>
    </div>
  );
});

export default ToolBox;
