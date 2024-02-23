import { create } from "zustand";

interface Coordinate {
  x: number;
  y: number;
}
interface Shift extends Coordinate {}

interface Offset extends Coordinate {}

interface Scale extends Coordinate {}
interface Origin extends Coordinate {}

interface BearState {
  offset: Offset;
  scale: Scale;
  shift: Shift;
  transformOrigin: Origin;
  shiftBy: (dx: number, dy: number) => void;
  setOffset: () => void;
  setScale: (k: number) => void;
  setOrigin: (x: number, y: number) => void;
}

const useStore = create<BearState>()((set) => ({
  transformOrigin: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  shift: {
    x: 0,
    y: 0,
  },
  scale: {
    x: 1,
    y: 1,
  },
  shiftBy: (dx, dy) => {
    set((state) => ({
      ...state,
      shift: { x: dx, y: dy },
    }));
  },
  setScale: (k) => {
    set((state) => ({
      ...state,
      scale: { x: k, y: k },
    }));
  },
  setOrigin: (x, y) => {
    set((state) => ({
      ...state,
      transformOrigin: { x: x, y: y },
    }));
  },
  setOffset: () => {
    set((state) => ({
      ...state,
      offset: {
        x: useStore.getState().shift.x,
        y: useStore.getState().shift.y,
      },
    }));
  },
}));

export default useStore;
