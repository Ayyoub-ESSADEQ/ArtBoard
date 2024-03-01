import { nanoid } from "nanoid";
import { create } from "zustand";

interface Shape {
  height: number;
  width: number;
  type: string;
  fill: string;
  id: string;
  x: number;
  y: number;
}

type ViewBox = { x: number; y: number; width: number; height: number };
type Coords = { x: number; y: number };

export interface BearState {
  focusedComponentId: string;
  initialDrawing: Shape[];
  backgroundPosition: Coords;
  isDragging: boolean;
  isCommentSectionToggeled: boolean;
  startCoords: Coords;
  viewBox: ViewBox;
  scale: number;
  setScale: (factor: number) => void;
  setViewBox: (viewbox: ViewBox) => void;
  setStartCoords: (startCoords: Coords) => void;
  setDragging: (draggingState: boolean) => void;
  setCommentSectionToToggled: (isToggled: boolean) => void;
  setBackgroundPosition: (backgroundPosition: Coords) => void;
  setFocusedComponentId: (id: string) => void;
  getElementProps: (id: string) => Shape | undefined;
  setElementProps: (id: string, props: object) => void;
}

const INITIAL_DRAWING = [
  {
    id: nanoid(6),
    type: "rect",
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    fill: "blue",
  },
  {
    id: nanoid(6),
    type: "rect",
    x: 200,
    y: 400,
    width: 200,
    height: 300,
    fill: "red",
  },
  {
    id: nanoid(6),
    type: "image",
    x: 800,
    y: 500,
    width: 200,
    height: 300,
    fill: "red",
  },
  {
    id: nanoid(6),
    type: "circle",
    x: 900,
    y: 400,
    width: 200,
    height: 300,
    fill: "yellow",
  },
  {
    id: nanoid(6),
    type: "text",
    x: 900,
    y: 400,
    width: 200,
    height: 300,
    fill: "yellow",
  },
];

const useStore = create<BearState>()((set, get) => ({
  isCommentSectionToggeled: false,
  focusedComponentId: "",
  backgroundPosition: { x: 0, y: 0 },
  scale: 1,
  startCoords: { x: 0, y: 0 },
  isDragging: false,
  initialDrawing: INITIAL_DRAWING,
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

  setBackgroundPosition({ x, y }) {
    set((state) => {
      return { ...state, backgroundPosition: { x: x, y: y } };
    });
  },

  setDragging(isDrag) {
    set((state) => ({ ...state, isDragging: isDrag }));
  },

  getElementProps: (id) => {
    return get().initialDrawing.find((shape) => shape.id === id);
  },

  setElementProps(id, props) {
    set((state) => {
      const board = [...state.initialDrawing];
      const index = board.findIndex((shape) => shape.id === id);
      if (index === -1) return state;

      board[index] = { ...board[index], ...props };
      return { ...state, initialDrawing: board };
    });
  },

  setFocusedComponentId(id) {
    set((state) => ({ ...state, focusedComponentId: id }));
  },

  setCommentSectionToToggled(isToggled) {
    set((state) => ({ ...state, isCommentSectionToggeled: isToggled }));
  },
}));

export default useStore;
