import { ReactComponentElement, SVGProps, createContext } from "react";
import useStore from "../state/store";

type Element = "div" | "svg" | "rect" | "circle";
type Orientation =
  | "top-left"
  | "top-middle"
  | "top-right"
  | "middle-left"
  | "middle-right"
  | "bottom-left"
  | "bottom-right"
  | "bottom-middle";

interface ResizerProps {
  children: ReactComponentElement<Element>;
}

interface ResizeHandlerProps extends SVGProps<SVGRectElement> {
  orientation: Orientation;
}

interface ResizableFrameProps {
  width: number;
  height: number;
  x: number;
  y: number;
}

const idContext = createContext("");

const ResizeHandler = (props: ResizeHandlerProps) => {
  const corner = 8;

  return (
    <rect
      transform={`translate(${-corner / 2}, ${-corner / 2})`}
      stroke="black"
      width={corner}
      height={corner}
      fill="red"
      {...props}
    />
  );
};

const ResizableFrame = ({ width, height, x, y }: ResizableFrameProps) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        fill="transparent"
        stroke="black"
        strokeWidth={1}
        onClick={() => console.log("Hello world")}
      />
      <ResizeHandler
        className="hover:cursor-nw-resize"
        orientation="top-left"
      />
      <ResizeHandler
        x={width / 2}
        className="hover:cursor-n-resize"
        orientation="top-middle"
      />
      <ResizeHandler
        x={width}
        className="hover:cursor-ne-resize"
        orientation="top-right"
      />
      <ResizeHandler
        y={height}
        className="hover:cursor-sw-resize"
        orientation="bottom-left"
      />
      <ResizeHandler
        y={height / 2}
        className="hover:cursor-e-resize"
        orientation="middle-left"
      />
      <ResizeHandler
        x={width}
        y={height / 2}
        className="hover:cursor-e-resize"
        orientation="middle-right"
      />
      <ResizeHandler
        x={width / 2}
        y={height}
        className="hover:cursor-n-resize"
        orientation="bottom-middle"
      />
      <ResizeHandler
        x={width}
        y={height}
        className="hover:cursor-se-resize"
        orientation="bottom-right"
      />
    </g>
  );
};

export default function Resizer(props: Readonly<ResizerProps>) {
  const { getElementProps } = useStore((state) => state);
  const { width, height, x, y } = getElementProps(props.children.key!)!;
  return (
    <>
      {props.children}
      <idContext.Provider value={props.children.key!}>
        <ResizableFrame width={width} height={height} x={x} y={y} />
      </idContext.Provider>
    </>
  );
}
