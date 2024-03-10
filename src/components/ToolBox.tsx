import useStore, { Tool } from "../state/store";
import { HTMLProps, memo } from "react";
import FileUpload from "./Shapes/FileUpload";
import * as Icons from "./icons/Icons";
import * as Stickers from "./stickers/stickers";

interface ToolProps extends HTMLProps<HTMLDivElement> {
  functionality: keyof typeof Tool;
}

const ToolItem = memo((props: ToolProps) => {
  const { toolInUseName, setToolInUseName, setWhiteboardCursor } = useStore();
  const { functionality } = props;

  const active = toolInUseName === functionality ? "bg-violet-300" : "bg-white";
  const hover = active === "bg-white" ? "hover:bg-gray-100" : "";

  const setToolAndCursor = (e: React.MouseEvent<HTMLDivElement>) => {
    props.onClick?.(e);
    setToolInUseName(props.functionality);
    setWhiteboardCursor(Tool[props.functionality]);
  };

  return (
    <div
      {...props}
      onClick={setToolAndCursor}
      className={`${props.className} h-12 w-12 select-none ${hover} cursor-pointer ${active} rounded-md flex justify-center items-center`}
    >
      {props?.children}
    </div>
  );
});

const StickerItem = memo((props: HTMLProps<HTMLDivElement>) => {
  return (
    <div className="w-12 h-12 bg-white rounded-md p-1 box-border hover:bg-yellow-100">
      {props.children}
    </div>
  );
});

const StickerDrawer = memo(() => {
  return (
    <div className="flex flex-col animate-slideinLeftToRight items-center py-1 rounded-lg justify-center h-fit w-14 shadow-md bg-white border absolute left-0">
      <StickerItem>
        <Stickers.Yeah />
      </StickerItem>
      <StickerItem>
        <Stickers.AlmostDone />
      </StickerItem>
      <StickerItem>
        <Stickers.Ok />
      </StickerItem>
      <StickerItem>
        <Stickers.Thanks />
      </StickerItem>
      <StickerItem>
        <Stickers.Nope />
      </StickerItem>
      <StickerItem>
        <Stickers.Star />
      </StickerItem>
      <StickerItem>
        <Stickers.Busy />
      </StickerItem>
      <div className="h-2 w-2 bg-white border-b left-0 border-l rotate-45 absolute translate-x-[-50%] z-[-1]"></div>
    </div>
  );
});

const ToolBox = memo(() => {
  const { toolInUseName } = useStore();

  return (
    <div className="bg-white rounded-md shadow-md border-solid border-2 border-gray-200 p-1 box-border flex flex-col gap-1 fixed top-[50%] left-2 translate-y-[-50%]">
      <ToolItem functionality={"Rectangle"}>
        <Icons.Rectangle />
      </ToolItem>
      <ToolItem functionality={"Circle"}>
        <Icons.Circle />
      </ToolItem>
      <ToolItem functionality={"Image"}>
        <FileUpload />
      </ToolItem>
      <ToolItem functionality={"Text"}>
        <Icons.Text />
      </ToolItem>
      <ToolItem functionality={"Sticker"} className="relative">
        <Icons.Sticker />
        {toolInUseName === "Sticker" && <StickerDrawer />}
      </ToolItem>
      <ToolItem functionality={"Pan"}>
        <Icons.Drag />
      </ToolItem>
      <ToolItem functionality={"Arrow"}>
        <Icons.Arrow />
      </ToolItem>
      <ToolItem functionality={"Select"}>
        <Icons.Select />
      </ToolItem>
    </div>
  );
});

export default ToolBox;
