import { ChangeEventHandler, useRef } from "react";

export default function Text() {
  const text = useRef<string>("");

  const handleTextChange: ChangeEventHandler<HTMLDivElement> = (e) => {
    text.current = e.target.innerText;
  };

  return (
    <foreignObject x="10" y="10" width="100" height="150">
      <div
        contentEditable="plaintext-only"
        onInput={handleTextChange}
        suppressContentEditableWarning={true}
      >The is a Sketchboard</div>
    </foreignObject>
  );
}
