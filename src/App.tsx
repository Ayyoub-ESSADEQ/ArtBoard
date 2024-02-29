import Header from "./components/Header";
import Whiteboard from "./components/Whiteboard";
import ToolBox from "./components/ToolBox";
import SidePanel from "./components/SidePanel";
function App() {
  return (
    <div className="flex flex-row w-full h-full relative select-none">
      <Whiteboard></Whiteboard>
      <Header></Header>
      <SidePanel />
      <ToolBox />
    </div>
  );
}

export default App;
