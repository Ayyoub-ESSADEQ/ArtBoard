import { SVGProps, memo } from "react";
import { Italic, Bold, ColorPallete } from "./icons/TextFormat";

interface ShapeModifierProps extends SVGProps<SVGGElement> {}

const ShapeModifier = memo((props: ShapeModifierProps) => {
  return (
    <g {...props}>
      <g transform="translate(-92, -60)">
        <foreignObject className="overflow-visible" x={0} y={0}>
          <div className="flex flex-row shadow-md border-2 bg-white w-fit gap-1 p-1 rounded-md h-fit items-center">
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
        </foreignObject>
      </g>
    </g>
  );
});

export default ShapeModifier;
