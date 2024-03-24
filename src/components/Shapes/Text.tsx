/* eslint-disable react-hooks/exhaustive-deps */
import { SVGProps, memo, useEffect, useRef, useState } from "react";
import useStore from "../../state/store";

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
  const range = document.createRange();

  range.setStart(contentEditableElement.childNodes[0], offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
};

export const Text = memo((props: TextProps) => {
  const { setElementProps, scale } = useStore();

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
    textTag.current?.focus();
  };

  useEffect(() => {
    const target = textTag.current;
    if (!target || !props.focus) return;
    target.focus();
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

  return (
    <foreignObject {...props} focus="">
      <div
        suppressContentEditableWarning={true}
        contentEditable={isEditMode ? "plaintext-only" : false}
        data-type={isEditMode ? "nothing" : "shape"}
        ref={textTag}
        id={props.id}
        onDoubleClick={handleDoubleClick}
        onInput={handleTextChange}
        onBlur={handleBlur}
        data-placeholder="type text here .."
        className="border-none text-left z-30 px-2 py-1 whitespace-pre-wrap bg-orange-300 outline-none focus:border-none focus:outline-none bg-transparent placeholder caret-black"
      >
        {props.content}
      </div>
    </foreignObject>
  );
});
