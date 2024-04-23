import { SVGProps, createContext, memo, useContext } from "react";
import useStore from "Store";

type Horizontal = "left" | "right";
type Vertical = "top" | "bottom";

type Orientation =
  | `${Vertical}-${Horizontal}`
  | `middle-${Horizontal}`
  | `${Vertical}-middle`;

interface ResizeHandlerProps extends SVGProps<SVGRectElement> {
  orientation: Orientation;
}

interface ResizableFrameProps {
  width: number;
  height: number;
  id: string;
  x: number;
  y: number;
}

const idContext = createContext<ResizableFrameProps>({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  id: "",
});

export const ResizeHandler = memo((props: ResizeHandlerProps) => {
  const corner = 8;
  const { id } = useContext(idContext);
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

const ResizeHandlers = memo(() => {
  const { width, height } = useContext(idContext);

  return (
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
  );
});

export const ResizableFrame = memo(() => {
  const { scale } = useStore();
  const { width, height, x, y } = useContext(idContext);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        strokeWidth={2 * scale}
        className="stroke-blue-500"
      />
      <ResizeHandlers />
    </g>
  );
});

export const ResizableFrameForText = memo(() => {
  const { scale } = useStore();
  const { width, height, x, y } = useContext(idContext);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        strokeWidth={2 * scale}
        className="stroke-blue-500"
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
    </g>
  );
});

export const Resizer = memo(() => {
  const { getElementProps, focusedComponentId } = useStore();
  if (!focusedComponentId || focusedComponentId === "whiteboard") return <></>;
  const { type, props } = getElementProps(focusedComponentId)!;

  return (
    <>
      <idContext.Provider value={{ ...props, id: focusedComponentId }}>
        {type === "text" ? <ResizableFrameForText /> : <ResizableFrame />}
      </idContext.Provider>
    </>
  );
});