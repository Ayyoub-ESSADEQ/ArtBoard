import { ChangeEvent, useRef, useState } from "react";
import { Image } from "../icons/Image";
import useStore, { Tool } from "../../state/store";
import { nanoid } from "nanoid";
import Uploading from "../icons/Uploading";
import axios from "axios";

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(true);

  const { setToolInUseName, setWhiteboardCursor, addBoardElement } = useStore();

  const setToolAndCursor = () => {
    setToolInUseName("Select");
    setWhiteboardCursor(Tool["Select"]);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      setIsUploaded(true);
      setToolAndCursor();
      return;
    }

    setToolAndCursor();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:3000/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      addBoardElement({
        type: "shape",
        id: nanoid(6),
        props: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          href: response.data?.href,
        },
      });

      setIsUploaded(true);
    } catch (error) {
      setIsUploaded(true);
      setToolAndCursor();
      console.error("Error uploading file:", error);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      setIsUploaded(false);
    }
  };

  return (
    <div className="h-full w-full">
      <button
        className="h-full w-full flex items-center justify-center"
        onClick={handleButtonClick}
      >
        {isUploaded ? <Image /> : <Uploading />}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".jpg, .jpeg, .png, .gif, .svg, .webp"
      />
    </div>
  );
};

export default FileUpload;
