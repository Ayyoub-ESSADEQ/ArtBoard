/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommentSection,
  Header,
  Overlay,
  ToolBox,
  Board as Whiteboard,
  ZoomIndicator,
} from "Components";
import useStore, { Shape } from "Store";
import { UpdateObserver } from "Utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Data {
  whiteboard: { content: Shape[] };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export async function loader({ params }: any): Promise<Data> {
  try {
    const url = `http://localhost:3000/whiteboards/${params.whiteboardId}`;
    const response = await axios.get(url);
    const observer = UpdateObserver.getInstance();
    observer.setUrl(url);
    observer.setWhiteboardId(params.whiteboardId);
    return { whiteboard: response.data };
  } catch (e) {
    return { whiteboard: { content: [] } };
  }
}

export default function App() {
  const setBoard = useStore((state) => state.setBoard);
  const [title, setTitle] = useState("loading..");
  const { whiteboard } = useLoaderData() as Data;

  useEffect(() => {
    setBoard(whiteboard.content);
    setTitle((whiteboard.content[0] as any).whiteboard.name);
  }, []);

  return (
    <div className="flex flex-row w-full h-full relative select-none">
      <Overlay></Overlay>
      <Whiteboard></Whiteboard>
      <Header title={title}></Header>
      <CommentSection />
      <ToolBox />
      <ZoomIndicator />
    </div>
  );
}
