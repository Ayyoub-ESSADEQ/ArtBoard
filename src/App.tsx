import Header from "./components/Header";
import Whiteboard from "./components/Whiteboard";
import ToolBox from "./components/ToolBox";
import { SidePanel } from "./components/SidePanel";
import Overlay from "./components/Overlay";
function App() {
  return (
    <div className="flex flex-row w-full h-full relative select-none">
      <Overlay></Overlay>
      <Whiteboard></Whiteboard>
      <Header></Header>
      <SidePanel />
      <ToolBox />
    </div>
  );
}

export default App;
