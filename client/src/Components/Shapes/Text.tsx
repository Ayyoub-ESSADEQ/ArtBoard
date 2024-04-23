/* eslint-disable react-hooks/exhaustive-deps */
import { SVGProps, memo, useEffect, useRef, useState } from "react";
import useStore from "Store";

interface TextProps extends SVGProps<SVGForeignObjectElement> {
  id: string;
  content: string;
  focus?: boolean;
}

const getCaret = (contentEditableElement: HTMLDivElement) => {
  const caretAt = 0;
  const sel = window.getSelection();
  if (!sel) return 0;
  if (sel.rangeCount == 0) {
    return caretAt;
  }

  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(contentEditableElement);
  preRange.setEnd(range.endContainer, range.endOffset);

  return preRange.toString().length;
};

const setCaret = (contentEditableElement: HTMLDivElement, offset: number) => {
  const sel = window.getSelection();
  if (!sel) return;

  const start = contentEditableElement.childNodes[0];

  if (!start) {
    contentEditableElement.focus();
    return;
  }

  const range = document.createRange();

  range.setStart(start, offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
};

export const Text = memo((props: TextProps) => {
  const { setElementProps, setShapeEditor, toolInUseName, scale } = useStore();

  const textTag = useRef<HTMLDivElement>(null);
  const caretPos = useRef<number>();
  const [isEditMode, setIsEditMode] = useState(props.focus ?? false);

  const handleTextChange = () => {
    if (!textTag.current) return;
    const { height } = textTag.current.getBoundingClientRect();
    const content = textTag.current.textContent;
    setElementProps(props.id!, { content: content, height: height * scale });
    caretPos.current = getCaret(textTag.current);
  };

  const handleBlur = () => {
    setIsEditMode(false);
    textTag.current?.blur();
  };

  const handleDoubleClick = () => {
    setIsEditMode(true);
    setTimeout(() => {
      if (!textTag.current) return;
      const content = textTag.current.textContent;
      setCaret(textTag.current, content ? content.length : 0);
      textTag.current.focus();
    }, 0);
  };

 
  const showShapeEditor = (e: React.MouseEvent<HTMLDivElement>) => {
    if (toolInUseName !== "Select") return;
    const target = e.target as SVGRectElement;
    const { top, left } = target.getBoundingClientRect();
    setShapeEditor({
      show: true,
      x: left + parseFloat(props.width as string) / (2 * scale),
      y: top,
    });
  };

  //We use this to focus the text box when we created it using the text tool
  useEffect(() => {
    const target = textTag.current;
    if (!target || !props.focus) return;
    setTimeout(() => target.focus(), 0);
  }, []);

  //We make sure that we preserve the cursor position
  useEffect(() => {
    if (!textTag.current || !caretPos.current) return;
    setCaret(textTag.current, caretPos.current);
    textTag.current.focus();
  }, [props.content]);

  //We set the height of the resizer to fit the actual height of the text
  useEffect(() => {
    if (!textTag.current) return;
    const { height } = textTag.current.getBoundingClientRect();
    setElementProps(props.id!, { height: height * scale });
  }, [props.width]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ["focus"]: _, ...foreignProps } = props;

  return (
    <foreignObject {...foreignProps}>
      <div
        suppressContentEditableWarning={true}
        contentEditable={isEditMode ? "plaintext-only" : false}
        data-type={isEditMode ? "nothing" : "shape"}
        ref={textTag}
        id={props.id}
        onDoubleClick={handleDoubleClick}
        onInput={handleTextChange}
        onBlur={handleBlur}
        onClick={showShapeEditor}
        data-placeholder="type text here .."
        className="border-none text-[14px] text-left z-30 px-2 py-1 whitespace-pre-wrap bg-orange-300 outline-none focus:border-none focus:outline-none bg-transparent placeholder caret-black"
      >
        {props.content}
      </div>
    </foreignObject>
  );
});
