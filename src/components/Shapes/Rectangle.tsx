import { memo, useEffect, useRef } from "react";
import useStore from "Store";
import { TextBase } from "./TextBase";

export interface RectangleProps extends React.SVGProps<SVGRectElement> {
  id: string;
  content?: string;
}

export const Rectangle = memo((props: RectangleProps) => {
  const { scale, toolInUseName, setShapeEditor } = useStore();
  const text = useRef<HTMLDivElement>(null);

  const edit = (e: React.MouseEvent<SVGRectElement>) => {
    if (toolInUseName !== "Select") return;
    const target = e.target as SVGRectElement;
    const { top, left } = target.getBoundingClientRect();
    setShapeEditor({
      show: true,
      x: left + parseFloat(props.width as string) / (2 * scale),
      y: top,
    });
  };

  const ensureTextCentered = () => {
    if (!text.current) return;
    if (text.current.innerText.toString().length == 0) {
      text.current.innerHTML = "&nbsp;";
    }
  };

  useEffect(() => {
    ensureTextCentered();
    text.current?.addEventListener("input", () => {
      ensureTextCentered();
    });
  }, []);

  return (
    <>
      <rect {...props} data-type="shape" id={props.id} />
      <TextBase
        id={props.id}
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        ref={text}
        onClick={edit}
        content={props.content}
      />
    </>
  );
});
