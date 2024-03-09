import { memo } from "react";

interface AssetPanelProps extends React.HTMLProps<HTMLDivElement> {}

const AssetsPanel = memo((props: AssetPanelProps) => {
  return (
    <div
      {...props}
      className={`${props.className} h-full transition-[left] duration-200 ease-in-out fixed top-0 left-0 shadow-md bg-white`}
    ></div>
  );
});

export default AssetsPanel;
