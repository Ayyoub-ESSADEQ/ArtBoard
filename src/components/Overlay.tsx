import { HTMLProps, memo } from "react";
import useStore from "../state/store";
import * as Icons from "./icons/Icons";

const Editor = memo((props: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className="animate-slidein opacity-0 flex flex-row shadow-md border-2 z-10 sticky bg-white w-fit gap-1 p-1 rounded-md h-fit items-center"
    >
      <div className="h-10 w-10 hover:bg-[#f2efee] flex rounded-md items-center justify-center">
        <Icons.Italic />
      </div>
      <div className="h-10 w-10 hover:bg-[#f2efee] flex rounded-md items-center justify-center">
        <Icons.Bold />
      </div>
      <div className="h-10 w-10 hover:bg-[#f2efee] flex rounded-md items-center justify-center">
        <Icons.ColorPallete />
      </div>
      <div className="h-10 w-10 hover:bg-[#f2efee] flex rounded-md items-center justify-center">
        4
      </div>
    </div>
  );
});

const Overlay = memo(() => {
  const { shapeEditor } = useStore();

  const position = shapeEditor.show
    ? {
        top: `${shapeEditor.y}px`,
        left: `${shapeEditor.x}px`,
      }
    : {};

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
      {shapeEditor.show && <Editor style={position} />}
    </div>
  );
});

export default Overlay;
