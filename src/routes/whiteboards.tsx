import { DrawingBoard } from "Icons";
import { Link, useLoaderData } from "react-router-dom";
import axios from "axios";

interface DraftProps {
  updatedAt: string;
  _id: string;
  name: string;
}

interface WhiteboardMetaData {
  whiteboards: DraftProps[];
}

interface Data {
  content: DraftProps[];
}

export async function loader() {
  try {
    const response = await axios.get("http://localhost:3000/whiteboards");
    const data = response.data as Data;

    return { whiteboards: data.content };
  } catch {
    return {
      //WARN : Prevent Error when the whiteboard is Empty
      whiteboards: [
        {
          id: "",
          type: "rectangle",
          props: { width: 0, height: 0, x: 0, y: 0 },
        },
      ],
    };
  }
}

const formatDate = (originalDate: string) =>
  new Date(originalDate)
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d+Z$/, "");

const Draft = (props: DraftProps) => {
  return (
    <Link
      className="h-fit w-fit"
      reloadDocument
      to={`/whiteboards/${props._id}`}
    >
      <div className="flex-grow select-none flex flex-col w-[243px] max-w-[243px] h-[200px] rounded-md border shadow-sm">
        <div className="bg-orange-200 flex-grow rounded-t-md"></div>
        <div className="flex flex-col w-full h-fit p-3">
          <div className="text-[12px] inter-bold">{props.name}</div>
          <div className="text-[10px] inter-regular text-gray-500">
            Last update : {formatDate(props.updatedAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export function Whiteboards() {
  const { whiteboards } = useLoaderData() as WhiteboardMetaData;

  return (
    <div className="w-full h-full flex flex-row">
      {/* <NavBar /> */}
      <div className="w-full h-full flex flex-col">
        <div className="bg-white border-b h-fit p-3 w-full flex flex-row justify-between items-center">
          <div>
            <div className="inter-bold text-[12px]">Hello There 👋</div>
            <div className="text-[12px] text-gray-500">
              It's nice to see you
            </div>
          </div>
          <div className="px-3 py-1 text-[14px] hover:cursor-pointer select-none bg-[#469aff] h-[30px] flex gap-2 items-center flex-row text-white rounded-md shadow-sm">
            <DrawingBoard />
            <div>New Whiteboard</div>
          </div>
        </div>
        <div className="flex-grow flex flex-row flex-wrap p-2 gap-3 overflow-y-auto">
          {whiteboards.map((props) => (
            <Draft {...props} key={props._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
