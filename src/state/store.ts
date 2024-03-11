import { nanoid } from "nanoid";
import { create } from "zustand";
import yeah from "../assets/9562781_yeah_rock and roll_cool_rock_done_icon.min.svg";
import { Context, Whiteboard } from "../utils/MouseStrategy";

export const Tool = {
  Rectangle: "cross-hair",
  Sticker: "default",
  Circle: "cross-hair",
  Select: "default",
  Arrow: "default",
  Image: "default",
  Text: "text",
  Pan: "grab",
};

interface ShapeBase {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface OtherShapeProps extends ShapeBase {
  href: string;
}

interface ShapeProps extends ShapeBase {
  fill: string;
}

interface TextProps extends ShapeBase {
  format: "bold" | "italic" | "normal";
  fontSize: number;
  color: string;
}

type Shape =
  | {
      id: string;
      type: "text";
      props: TextProps;
    }
  | {
      id: string;
      type: "shape";
      props: OtherShapeProps;
    }
  | {
      id: string;
      type: "circle";
      props: ShapeProps;
    }
  | {
      id: string;
      type: "rectangle";
      props: ShapeProps;
    };

type ShapeEditorState =
  | {
      show: true;
      x: number;
      y: number;
    }
  | { show: false };

type ViewBox = { x: number; y: number; width: number; height: number };
type Coords = { x: number; y: number };

export interface BearState {
  shapeEditor: ShapeEditorState;
  toolInUseName: keyof typeof Tool;
  focusedComponentId: string;
  board: Shape[];
  isDragging: boolean;
  isCommentSectionToggeled: boolean;
  startCoords: Coords;
  viewBox: ViewBox;
  whiteboardCursor: string;
  scale: number;
  context: Context;
  // collaboratorCursorPosition: Coords | undefined;
  setScale: (factor: number) => void;
  setViewBox: (viewbox: ViewBox) => void;
  setStartCoords: (startCoords: Coords) => void;
  setDragging: (draggingState: boolean) => void;
  setCommentSectionToToggled: (isToggled: boolean) => void;
  setFocusedComponentId: (id: string) => void;
  getElementProps: (id: string) => Shape | undefined;
  setElementProps: (id: string, props: object) => void;
  setWhiteboardCursor: (cursor: string) => void;
  setToolInUseName: (toolName: keyof typeof Tool) => void;
  setShapeEditor: (shapeEditor: ShapeEditorState) => void;
  addBoardElement: (element: Shape) => void;
  // setCollaboratorCursor: (shapeEditor: ShapeEditorState) => void;
}

const INITIAL_DRAWING: Shape[] = [
  {
    id: nanoid(6),
    type: "rectangle",
    props: {
      x: 100,
      y: 100,
      width: 1,
      height: 1,
      fill: "blue",
    },
  },
  {
    id: nanoid(6),
    type: "shape",
    props: {
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      href: "https://cdn.dribbble.com/userupload/13481011/file/original-bef44b9b571f8611f52002612f26be3d.png?resize=400x300&vertical=center",
    },
  },
  {
    id: nanoid(6),
    type: "rectangle",
    props: {
      x: 200,
      y: 400,
      width: 200,
      height: 300,
      fill: "red",
    },
  },
  {
    id: nanoid(6),
    type: "shape",
    props: {
      x: 800,
      y: 500,
      width: 200,
      height: 300,
      href: "https://cdn.dribbble.com/userupload/13308142/file/still-02a795b0bd22783893f7f5167eb8b0b3.png?resize=400x300&vertical=center",
    },
  },
  {
    id: nanoid(6),
    type: "circle",
    props: {
      x: 900,
      y: 400,
      width: 200,
      height: 300,
      fill: "yellow",
    },
  },
  {
    id: nanoid(6),
    type: "text",
    props: {
      x: 900,
      y: 400,
      width: 200,
      height: 300,
      color: "black",
      format: "normal",
      fontSize: 12,
    },
  },
  {
    id: nanoid(6),
    type: "shape",
    props: {
      x: 100,
      y: 100,
      width: 1,
      height: 1,
      href: yeah,
    },
  },
];

const useStore = create<BearState>()((set, get) => ({
  context: new Context(new Whiteboard()),
  shapeEditor: { show: false },
  whiteboardCursor: "arrow",
  toolInUseName: "Select",
  isCommentSectionToggeled: false,
  focusedComponentId: "",
  scale: 1,
  startCoords: { x: 0, y: 0 },
  isDragging: false,
  board: INITIAL_DRAWING,
  viewBox: { x: 0, y: 0, width: screen.availWidth, height: screen.availHeight },
  setScale(factor) {
    set((state) => ({ ...state, scale: factor }));
  },
  setViewBox({ x, y, width, height }) {
    set((state) => {
      return {
        ...state,
        viewBox: {
          x: x,
          y: y,
          width: width,
          height: height,
        },
      };
    });
  },

  setStartCoords: ({ x, y }) =>
    set((state) => ({ ...state, startCoords: { x: x, y: y } })),

  setDragging(isDrag) {
    set((state) => ({ ...state, isDragging: isDrag }));
  },

  getElementProps: (id) => {
    return get().board.find((shape) => shape.id === id);
  },

  setElementProps(id, props) {
    set((state) => {
      const board = [...state.board];
      const index = board.findIndex((shape) => shape.id === id);
      if (index === -1) return state;

      board[index] = {
        ...board[index],
        props: { ...board[index].props, ...props },
      } as Shape;
      return { ...state, shapeEditor: { show: false }, board: board };
    });
  },

  setFocusedComponentId(id) {
    set((state) => ({ ...state, focusedComponentId: id }));
  },

  setCommentSectionToToggled(isToggled) {
    set((state) => ({ ...state, isCommentSectionToggeled: isToggled }));
  },

  setWhiteboardCursor(cursor) {
    set((state) => ({ ...state, whiteboardCursor: cursor }));
  },

  setToolInUseName(toolName) {
    set((state) => ({ ...state, toolInUseName: toolName }));
  },

  setShapeEditor(shapeEditor) {
    set((state) => ({ ...state, shapeEditor: shapeEditor }));
  },

  addBoardElement(element: Shape) {
    set((state) => ({ ...state, board: [...get().board, element] }));
  },
}));

export default useStore;
