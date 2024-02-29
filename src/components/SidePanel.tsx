import { EmptyCommentSection } from "./icons/EmptyCommentSection";
import { RightPanelCollapse } from "./icons/RightPanelCollapse";

export default function SidePanel() {
  return (
    <div className="h-full w-[300px] bg-[#fbfbfb] z-50 border-x-2">
      <div className="w-full h-full flex flex-col items-center">
        <div className="flex h-10 w-full items-center text-gray-500 flex-row justify-between border-box px-2">
          <div className="font-medium">Comments</div>
          <div className="rounded-md hover:cursor-pointer hover:bg-gray-100 h-7 aspect-square flex items-center justify-center">
            <RightPanelCollapse />
          </div>
        </div>
        <div className="w-full text-gray-600 flex-grow flex flex-col items-center gap-2 justify-center">
          <EmptyCommentSection className="w-[200px] h-[200px] " />
          <div className="w-48 text-center font-medium">
            Lead the Discussion! Be the First to Share.
          </div>
        </div>
      </div>
    </div>
  );
}
