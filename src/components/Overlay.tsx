import { memo } from "react";
import useStore from "../state/store";
import { Italic, Bold, ColorPallete } from "./icons/TextFormat";

const Overlay = memo(() => {
  const { shapeEditor } = useStore();

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
      {!shapeEditor.show ? (
        <></>
      ) : (
        <div
          style={{
            top: `${shapeEditor.y}px`,
            left: `${shapeEditor.x}px`,
          }}
          className="flex flex-row translate-x-[-50%] translate-y-[calc(-108%)] shadow-md border-2 z-10 sticky bg-white w-fit gap-1 p-1 rounded-md h-fit items-center"
        >
          <div className="h-10 w-10 hover:bg-[#f2efee] flex rounded-md items-center justify-center">
            <Italic />
          </div>
          <div className="h-10 w-10 hover:bg-[#f2efee] flex rounded-md items-center justify-center">
            <Bold />
          </div>
          <div className="h-10 w-10 hover:bg-[#f2efee] flex rounded-md items-center justify-center">
            <ColorPallete />
          </div>
          <div className="h-10 w-10 hover:bg-[#f2efee] flex rounded-md items-center justify-center">
            4
          </div>
        </div>
      )}
    </div>
  );
});

export default Overlay;
