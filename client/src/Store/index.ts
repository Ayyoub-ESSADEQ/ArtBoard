import { create, StoreApi, UseBoundStore } from "zustand";
import {
  Context,
  Shape as ShapeContext,
  SocketSingleton,
  UpdateObserver,
} from "Utils";

export const Tool = {
  Rectangle: "cursor-draw",
  Sticker: "cursor-select",
  Circle: "cursor-draw",
  Select: "cursor-select",
  Arrow: "cursor-draw",
  Image: "cursor-select",
  Text: "text",
  Pan: "cursor-grab",
};

export interface CollaboratorCursorPosition {
  x: number;
  y: number;
  userId: string;
  username: string;
}

interface ShapeBase {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface OtherShapeProps extends ShapeBase {
  href: string;
}

interface ConnectorProps extends ShapeBase {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ShapeProps extends ShapeBase {
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

interface TextProps extends ShapeBase {
  content: string;
  format?: "bold" | "italic" | "normal";
  fontSize?: number;
  color?: string;
  /**
   * focus is used to autofocus the text when we create a text using
   * the text tool from the toobox
   */
  focus?: boolean;
}

export type Shape =
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
    }
  | {
      id: string;
      type: "connector";
      props: ConnectorProps;
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

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export interface BearState {
  shapeEditor: ShapeEditorState;
  toolInUseName: keyof typeof Tool;
  focusedComponentId: string;
  board: Shape[];
  isCommentSectionToggeled: boolean;
  viewBox: ViewBox;
  whiteboardCursor: string;
  scale: number;
  context: Context;
  collaborators: CollaboratorCursorPosition[];
  setBoard: (board: Shape[]) => void;
  setScale: (factor: number) => void;
  setViewBox: (viewbox: ViewBox) => void;
  setCommentSectionToToggled: (isToggled: boolean) => void;
  setFocusedComponentId: (id: string) => void;
  getElementProps: (id: string) => Shape | undefined;

  /**
   *
   * @param id
   * @param props
   * @param modifiedByOtherMember means that the new set of properties are comming from
   * other memebers, let's say that another member changes the size of a rectangle, in that
   * case we have to update the properties of the element without notifying the other members
   * so that we don't be in an infinite loop.
   * @returns
   */
  setElementProps: (
    id: string,
    props: object,
    modifiedByOtherMember?: boolean
  ) => void;
  setWhiteboardCursor: (cursor: string) => void;
  setToolInUseName: (toolName: keyof typeof Tool) => void;
  setShapeEditor: (shapeEditor: ShapeEditorState) => void;
  addBoardElement: (element: Shape, addedByOther?: boolean) => void;

  //Those are the sate action related to collaboration
  updateCollaboratorCursor: (userId: string, props: Coords) => void;
  addCollaborator: (collaborator: CollaboratorCursorPosition) => void;
  setCollaborators: (collaborators: CollaboratorCursorPosition[]) => void;
  removeCollaboratorCursor: (userId: string) => void;
}

const useStoreBase = create<BearState>()((set, get) => ({
  context: new Context(new ShapeContext()),
  shapeEditor: { show: false },
  whiteboardCursor: "cursor-select",
  toolInUseName: "Select",
  isCommentSectionToggeled: false,
  focusedComponentId: "",
  scale: 1,
  board: [],
  collaborators: [],
  viewBox: { x: 0, y: 0, width: screen.availWidth, height: screen.availHeight },
  setScale(factor) {
    set(() => ({ scale: factor }));
  },
  setViewBox({ x, y, width, height }) {
    set(() => ({
      viewBox: {
        x: x,
        y: y,
        width: width,
        height: height,
      },
    }));
  },

  getElementProps: (shapeId) => {
    return get().board.find(({ id }) => id === shapeId);
  },

  setElementProps(id, props, modifiedByOtherMember) {
    set((state) => {
      const board = [...state.board];
      const index = board.findIndex((shape) => shape.id === id);
      if (index === -1) return state;

      if (!modifiedByOtherMember) {
        const socketSingleton = SocketSingleton.getInstance();
        socketSingleton
          .getSocket()
          ?.emit("update_element", { id: id, props: props });
      }

      board[index] = {
        ...board[index],
        props: { ...board[index].props, ...props },
      } as Shape;
      return { shapeEditor: { show: false }, board: board };
    });
  },

  setFocusedComponentId(id) {
    set(() => ({ focusedComponentId: id }));
  },

  setCommentSectionToToggled(isToggled) {
    set(() => ({ isCommentSectionToggeled: isToggled }));
  },

  setWhiteboardCursor(cursor) {
    set(() => ({ whiteboardCursor: cursor }));
  },

  setToolInUseName(toolName) {
    set(() => ({ toolInUseName: toolName }));
  },

  setShapeEditor(shapeEditor) {
    set(() => ({ shapeEditor: shapeEditor }));
  },

  addBoardElement(element: Shape, addedByOther) {
    if (!addedByOther) {
      const socketSingleton = SocketSingleton.getInstance();
      const fullProps = {
        ...element,
        whiteboard: UpdateObserver.getInstance().getWhiteboardId(),
      };
      socketSingleton.getSocket()?.emit("add_element", { element: fullProps });
    }

    set(() => ({ board: [...get().board, element] }));
  },

  setBoard(board) {
    set(() => ({ board: board }));
  },

  updateCollaboratorCursor(id, props) {
    set((state) => {
      const collaborators = [...state.collaborators];
      const index = collaborators.findIndex(({ userId }) => userId === id);
      collaborators[index] = {
        ...collaborators[index],
        x: props.x,
        y: props.y,
      };
      return { ...state, collaborators: collaborators };
    });
  },

  addCollaborator(collaborator) {
    set((state) => ({
      ...state,
      collaborators: [...get().collaborators, collaborator],
    }));
  },

  setCollaborators(collaborators) {
    set((state) => ({ ...state, collaborators: collaborators }));
  },

  removeCollaboratorCursor(collaboratorId) {
    set((state) => {
      const collaborators = [...state.collaborators];
      const index = collaborators.findIndex(
        ({ userId }) => userId === collaboratorId
      );

      collaborators.splice(index, 1);
      return { ...state, collaborators: collaborators };
    });
  },
}));

const useStore = createSelectors(useStoreBase);
export default useStore;
