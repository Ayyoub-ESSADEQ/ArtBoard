import {
  ReactComponentElement,
  SVGProps,
  createContext,
  memo,
  useContext,
} from "react";
import useStore from "../state/store";
import { Rectangle } from "./Shapes/Rectangle";
// import { Text } from "./Shapes/Text";

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

const ResizeHandler = memo((props: ResizeHandlerProps) => {
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
});

const ResizeHandlers = memo(
  ({ width, height }: { width: number; height: number }) => (
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
  )
);

const ResizableFrame = memo(({ width, height, x, y }: ResizableFrameProps) => {
  const { scale, focusedComponentId, setShapeEditor } = useStore();
  const id = useContext(idContext);
  const edit = (e: React.MouseEvent<SVGRectElement>) => {
    const target = e.target as SVGRectElement;
    const { top, left } = target.getBoundingClientRect();

    setShapeEditor({
      show: true,
      x: left + width / (2 * scale),
      y: top,
    });
  };

  return (
    <g transform={`translate(${x}, ${y})`}>

      <Rectangle
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        strokeWidth={focusedComponentId === id ? 2 * scale : 0}
        className="stroke-blue-500  hover:cursor-move"
        data-type="shape"
        id={`${id}`}
        onClick={edit}
      />
      {focusedComponentId === id ? (
        <ResizeHandlers width={width} height={height} />
      ) : (
        <></>
      )}
        
      {/* <Text x={20} y={20} width={width-40} height={height-20}/> */}

    </g>
  );
});

const Resizer = memo((props: Readonly<ResizerProps>) => {
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
});

export default Resizer;
