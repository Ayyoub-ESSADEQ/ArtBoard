import { memo } from "react";
import useStore from "../state/store";
import * as Icons from "./Icons";

export const CommentSection = memo(() => {
  const { isCommentSectionToggeled, setCommentSectionToToggled } = useStore();
  const visibility = isCommentSectionToggeled ? "block" : "hidden";

  return (
    <div
      className={`h-full min-w-[300px] max-w-[300px] ${visibility} shadow-sm bg-[#fbfbfb] z-50 border-x-2`}
    >
      <div className="w-full h-full flex flex-col items-center">
        <div className="flex h-10 w-full items-center text-gray-500 flex-row justify-between border-box px-2">
          <div className="font-medium">Comments</div>
          <div
            onClick={() => setCommentSectionToToggled(false)}
            className="rounded-md hover:cursor-pointer hover:bg-gray-100 h-7 aspect-square flex items-center justify-center"
          >
            <Icons.RightPanelCollapse />
          </div>
        </div>
        <div className="w-full text-gray-600 flex-grow flex flex-col items-center gap-2 justify-center">
          <Icons.EmptyCommentSection className="w-[200px] h-[200px] " />
          <div className="w-48 text-center">
            Lead the Discussion! Be the First to Comment.
          </div>
        </div>
        <div className="h-fit w-full relative bg-white box-border p-2 border-t">
          <div
            contentEditable="plaintext-only"
            className="bg-white resize-none custom-scrollbar max-h-[100px] pr-5 pt-1 hover:overflow-y-auto focus:overflow-y-auto text-sm rounded-md border overflow-x-hidden text-wrap h-fit outline-none px-1  w-full placeholder"
            data-placeholder="write a comment.."
          ></div>
          <div className="absolute flex justify-center items-center h-6 w-6 rounded-md bottom-3 right-4 hover:bg-gray-300">
            <Icons.Send />
          </div>
        </div>
      </div>
    </div>
  );
});
