import { NavBar } from "../components/Navbar";
import { DrawingBoard } from "../components/icons/Icons";

const Draft = () => {
  return (
    <div className="flex-grow flex flex-col w-[243px] max-w-[243px] h-[200px] rounded-md border shadow-sm">
      <div className="bg-orange-200 flex-grow rounded-t-md"></div>
      <div className="flex flex-col w-full h-fit p-3">
        <div className="text-[12px] inter-bold">Collaboration Board</div>
        <div className="text-[10px] inter-regular text-gray-500">
          Created in 12/08/2024
        </div>
      </div>
    </div>
  );
};

export function Whiteboards() {
  return (
    <div className="w-full h-full flex flex-row">
      <NavBar />
      <div className="w-full h-full flex flex-col">
        <div className="bg-white border-b h-fit p-3 w-full flex flex-row justify-between items-center">
          <div>
            <div className="inter-bold text-[12px]">Hello There 👋</div>
            <div className="text-[12px] text-gray-500">
              It's nice to see you{" "}
            </div>
          </div>
          <div className="px-3 py-1 text-[14px] hover:cursor-pointer select-none bg-[#469aff] h-[30px] flex gap-2 items-center flex-row text-white rounded-md shadow-sm">
            <DrawingBoard />
            <div>New Whiteboard</div>
          </div>
        </div>
        <div className="flex-grow flex flex-row flex-wrap p-2 gap-3 overflow-y-auto">
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
          <Draft />
        </div>
      </div>
    </div>
  );
}
