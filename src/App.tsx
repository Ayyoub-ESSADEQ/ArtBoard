import Header from "./components/Header";
import Whiteboard from "./components/Board";
import ToolBox from "./components/ToolBox";
import { SidePanel } from "./components/SidePanel";
import Overlay from "./components/Overlay";
import ZoomIndicator from "./components/ZoomIndicator";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import useStore, { Shape } from "./state/store";
import axios from "axios";
import UpdateObserver from "./utils/UpdateObserver";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Data {
  whiteboards: { content: Shape[] };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export async function loader({ params }: any): Promise<Data> {
  try {
    const url = `http://localhost:3000/whiteboards/${params.whiteboardId}`;
    const response = await axios.get(url);
    const observer = UpdateObserver.getInstance();
    observer.setUrl(url);
    return { whiteboards: response.data };
  } catch (e) {
    return { whiteboards: { content: [] } };
  }
}

function App() {
  const setBoard = useStore((state) => state.setBoard);
  const { whiteboards } = useLoaderData() as Data;

  useEffect(() => {
    setBoard(whiteboards.content);
  }, []);

  return (
    <div className="flex flex-row w-full h-full relative select-none">
      <Overlay></Overlay>
      <Whiteboard></Whiteboard>
      <Header></Header>
      <SidePanel />
      <ToolBox />
      <ZoomIndicator />
    </div>
  );
}

export default App;
