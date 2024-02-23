import React from "react";

interface ResizerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactComponentElement<any>;
}

export default function Resizer(props: Readonly<ResizerProps>) {
  return (
    <div className="border-2 border-blue-600">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between h-0 overflow-visible">
          <div className="h-2 w-2 bg-white border-blue-600 border-2 translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer"></div>
          <div className="h-2 w-2 bg-white border-blue-600 border-2 translate-x-[50%] translate-y-[-50%] hover:cursor-pointer"></div>
        </div>
        <div>{props.children}</div>
        <div className="flex flex-row justify-between h-0">
          <div className="h-2 w-2 bg-white border-blue-600 border-2 translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer"></div>
          <div className="h-2 w-2 bg-white border-blue-600 border-2 translate-x-[50%] translate-y-[-50%] hover:cursor-pointer"></div>
        </div>
      </div>
    </div>
  );
}
