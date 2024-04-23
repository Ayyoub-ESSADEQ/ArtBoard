/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormEvent,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import useStore from "Store";

interface TextProps extends React.SVGProps<SVGForeignObjectElement> {
  id: string;
  content?: string;
  focus?: boolean;
  textPosition?: "CENTER" | "TOP" | "BOTTOM";
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

export const TextBase = memo(
  forwardRef<HTMLDivElement, TextProps>((props, textTag) => {
    const { setElementProps, scale } = useStore();

    const caretPos = useRef<number>();
    const [isEditMode, setIsEditMode] = useState(props.focus ?? false);

    const handleTextChange = (e: FormEvent<HTMLDivElement>) => {
      if (!e.target) return;
      const target = e.target as HTMLDivElement;
      if (target.innerText.toString().length == 0) {
        target.innerHTML = "&nbsp;";
      }
      const { height } = target.getBoundingClientRect();
      const content = target.textContent;
      setElementProps(props.id!, { content, height: height * scale });
      caretPos.current = getCaret(target);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      setIsEditMode(false);
      const target = e.target as HTMLDivElement;
      target?.blur();
    };

    const handleDoubleClick = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      setIsEditMode(true);
      setTimeout(() => {
        if (!e.target) return;
        const target = e.target as HTMLDivElement;
        const content = target.textContent;
        setCaret(target, content ? content.length : 0);
        target.focus();
      }, 0);
    };

    //We make sure that we preserve the cursor position
    useEffect(() => {
      const target = textTag as React.MutableRefObject<HTMLDivElement | null>;
      if (!target.current || !caretPos.current) return;
      setCaret(target.current, caretPos.current);
      target.current.focus();
    }, [props.content]);

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
          className={`${props.className} border-none box-border p-2 text-center w-full h-full flex flex-row justify-center items-center text-[14px] z-30 px-2 py-1 whitespace-pre-wrap bg-orange-300 outline-none focus:border-none focus:outline-none bg-transparent placeholder caret-black"
        `}
        >
          {props.content ?? ""}
        </div>
      </foreignObject>
    );
  })
);
