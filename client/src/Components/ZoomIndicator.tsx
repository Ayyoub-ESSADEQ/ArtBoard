import { memo } from "react";
import { Whiteboard } from "Utils";
import { Minus, Plus } from "Icons";
import useStore from "Store";

const SCALING_FACTOR = 1.1;

export const ZoomIndicator = memo(() => {
  const { scale, viewBox, isCommentSectionToggeled, setScale, setViewBox } =
    useStore();
  const right_offset = isCommentSectionToggeled
    ? "right-[308px]"
    : "right-[8px]";

  const className =
    "w-9 h-9 flex items-center hover:bg-[#788896] hover:cursor-pointer hover:border-0 hover:text-white justify-center border-x-[#fafbfc] border";
  const toPercentage = (n: number) => Math.round(n * 100) + "%";

  const zoom = (zoomFactor: number) => {
    const svg = Whiteboard.whiteboardReference;
    const point = new DOMPoint();

    point.x = screen.availWidth / 2;
    point.y = screen.availHeight / 2;

    const cursor = point.matrixTransform(svg?.getScreenCTM()?.inverse());

    setViewBox({
      x: cursor.x - (cursor.x - viewBox.x) * zoomFactor,
      y: cursor.y - (cursor.y - viewBox.y) * zoomFactor,
      width: viewBox.width * zoomFactor,
      height: viewBox.height * zoomFactor,
    });

    setScale(scale * zoomFactor);
  };

  return (
    <div
      className={`flex h-9 text-[#7c8b99] ${right_offset} font-medium overflow-hidden w-fit border-box items-center border border-solid  rounded-md justify-center flex-row bg-white shadow-md fixed bottom-2`}
    >
      <div className={className} onClick={() => zoom(SCALING_FACTOR)}>
        <Minus />
      </div>
      <div className="w-14 flex items-center justify-center">
        {toPercentage(1 / scale)}
      </div>
      <div className={className} onClick={() => zoom(1 / SCALING_FACTOR)}>
        <Plus />
      </div>
    </div>
  );
});
