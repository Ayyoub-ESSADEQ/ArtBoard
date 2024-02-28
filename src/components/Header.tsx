import { ReactNode } from "react";

const Side = ({
  children,
  className,
}: {
  children: ReactNode;
  className ?: string;
}) => {
  return <div className={`${className} flex flex-row items-center`}>{children}</div>;
};

const Collaborator = () => {
  return <div className="ml-[-20px] border-2 border-white h-10 w-10 bg-orange-200 rounded-full "></div>;
};

export default function Header() {
  return (
    <div className="absolute border-b shadow-sm border-b-gray-200 top-0 flex flex-row items-center justify-between left-0 h-12 w-full bg-white">
      <Side>Test</Side>
      <Side>Hello world</Side>
      <Side>
        <Collaborator />
        <Collaborator />
        <Collaborator />
      </Side>
    </div>
  );
}
