import { ReactNode } from "react";
import { Share } from "./icons/Share";
import { Messages } from "./icons/Messages";

const Side = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`${className} flex flex-row items-center`}>{children}</div>
  );
};

const Collaborator = () => {
  return (
    <div className="ml-[-16px] avatar bg border-2 border-white h-7 w-7 bg-orange-200 rounded-full "></div>
  );
};

export default function Header() {
  return (
    <div className="border-b z-50 px-3 box-border shadow-sm flex-grow border-b-gray-200 top-0 flex flex-row items-center justify-between left-0 h-10 bg-white">
      <Side> </Side>
      <Side>/📌 Whiteboard Collaboration Project</Side>
      <Side className="gap-4">
        <Side className="w-7 h-7 text-gray-600 justify-center rounded-md hover:cursor-pointer hover:bg-gray-100">
          <Messages />
        </Side>

        <Side>
          <Collaborator />
          <Collaborator />
          <Collaborator />
        </Side>

        <Side className="bg-violet-600 select-none hover:bg-violet-800 hover:cursor-pointer gap-2 w-[80px] h-[30px] box-border justify-center text-[13px] rounded-md px-2 text-white">
          <Share />
          <span>Share</span>
        </Side>
      </Side>
    </div>
  );
}
