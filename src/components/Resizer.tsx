import {
  ReactComponentElement,
  SVGProps,
  createContext,
  useContext,
} from "react";
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
  const id = useContext(idContext);
  const { scale } = useStore();
  return (
    <rect
      transform={`translate(${(-corner / 2) * scale}, ${
        (-corner / 2) * scale
      })`}
      width={corner * scale}
      height={corner * scale}
      fill="white"
      strokeWidth={1.5 * scale}
      rx={2 * scale}
      ry={2 * scale}
      stroke="#3b82f6"
      {...props}
      data-type="handler"
      data-orientation={props.orientation}
      id={`${id}`}
    />
  );
};

const ResizableFrame = ({ width, height, x, y }: ResizableFrameProps) => {
  const { scale, focusedComponentId } = useStore();
  const id = useContext(idContext);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        fill="transparent"
        strokeWidth={focusedComponentId === id ? 2 * scale : 0}
        className="stroke-blue-500"
        data-type="shape"
        id={`${id}`}
      />
      {focusedComponentId === id ? (
        <>
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
        </>
      ) : (
        <></>
      )}
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
