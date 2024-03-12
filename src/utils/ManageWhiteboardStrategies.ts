import useStore from "../state/store";
import {
  Whiteboard,
  Shape as ShapeStrategy,
  Handler,
  Draw,
} from "../utils/MouseStrategy";

//I need to create a flow diagram so that I will manage the flow state of
//our tools

export const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
  const type = (e.target as HTMLElement).dataset.type;
  const { context, toolInUseName, setFocusedComponentId, setShapeEditor } =
    useStore.getState();

  switch (toolInUseName) {
    case "Pan":
      setFocusedComponentId("whiteboard");
      context.setStrategy(new Whiteboard());
      context.handleMouseDown(e);
      break;

    case "Select":
      switch (type) {
        case "shape":
          context.setStrategy(new ShapeStrategy());
          context.handleMouseDown(e);
          break;

        case "handler":
          context.setStrategy(new Handler());
          context.handleMouseDown(e);
          break;

        case "whiteboard":
          setFocusedComponentId("whiteboard");
          setShapeEditor({ show: false });
          break;
      }
      break;

    case "Rectangle":
      context.setStrategy(new Draw());
      context.handleMouseDown(e);
      break;
  }
};
