import useStore from "../state/store";
import {
  Whiteboard,
  Shape as ShapeStrategy,
  Handler,
} from "../utils/MouseStrategy";

//I need to create a flow diagram so that I will manage the flow state of 
//our tools

export const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
  const type = (e.target as HTMLElement).dataset.type;
  const { context, toolInUseName } = useStore.getState();

  switch (type) {
    case "whiteboard":
      if (toolInUseName !== "Pan") return;
      context.setStrategy(new Whiteboard());
      context.handleMouseDown(e);
      break;

    case "shape":
      if (toolInUseName === "Pan") {
        context.setStrategy(new Whiteboard());
        context.handleMouseDown(e);
      }

      if (toolInUseName !== "Select") return;

      context.setStrategy(new ShapeStrategy());
      context.handleMouseDown(e);
      break;

    case "handler":
      if (toolInUseName !== "Select") return;
      context.setStrategy(new Handler());
      context.handleMouseDown(e);
      break;
  }
};
