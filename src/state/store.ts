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
  initialDrawing: Shape[];
  backgroundPosition: Coords;
  isDragging: boolean;
  startCoords: Coords;
  viewBox: ViewBox;
  setViewBox: (viewbox: ViewBox) => void;
  setStartCoords: (startCoords: Coords) => void;
  setDragging: (draggingState: boolean) => void;
  setBackgroundPosition: (backgroundPosition: Coords) => void;
  getElementProps: (id: string) => Shape | undefined;
}

const initialDrawing = [
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
];

const useStore = create<BearState>()((set, get) => ({
  backgroundPosition: { x: 0, y: 0 },
  startCoords: { x: 0, y: 0 },
  isDragging: false,
  initialDrawing: initialDrawing,
  viewBox: { x: 0, y: 0, width: screen.availWidth, height: screen.availHeight },
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
}));

export default useStore;
