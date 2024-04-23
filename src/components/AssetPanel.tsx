import { KeyboardEvent, memo, useRef, useState } from "react";
import { Search } from "Icons";
import axios from "axios";

interface AssetPanelProps extends React.HTMLProps<HTMLDivElement> {}

const ASSETS_BASE_URL = "https://api.iconify.design";

const getIconLink = (s: string) => {
  s.split(":").join("/");
  return s + ".svg";
};

export const AssetPanel = memo((props: AssetPanelProps) => {
  const searchBox = useRef<HTMLInputElement>(null);
  const handleSearch = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (!searchBox.current || e.key !== "Enter") return;
    const response = await axios.get(
      `${ASSETS_BASE_URL}/search?query=${searchBox.current.value}&limit=999`
    );

    setResults(response.data.icons);
  };
  const [results, setResults] = useState([]);

  return (
    <div
      {...props}
      className={`${props.className} 
      flex flex-col border-box py-4 px-2 h-full lato-regular transition-[left] duration-200 ease-in-out absolute top-0 left-0 shadow-md bg-white justify-between gap-2`}
    >
      <div className="flex w-full flex-row items-center justify-between h-9 border-2 border-gray-400 rounded-md">
        <div className="h-full w-9 flex flex-row justify-center items-center">
          <Search />
        </div>
        <input
          ref={searchBox}
          onKeyDown={handleSearch}
          placeholder="search assets.."
          className="flex-grow h-9 focus:outline-none bg-transparent"
        />
      </div>
      <div className="flex-grow text-2xl flex flex-wrap gap-4 overflow-auto">
        {results.map((v) => (
          <img
            className="size-6 p-1 box-content hover:bg-gray-200 rounded-md"
            key={v}
            src={`${ASSETS_BASE_URL}/${getIconLink(v)}`}
            alt="icon"
          ></img>
        ))}
      </div>
    </div>
  );
});
