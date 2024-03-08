import { ChangeEventHandler, SVGProps, memo, useRef } from "react";
import useStore from "../../state/store";

interface TextProps extends SVGProps<SVGForeignObjectElement> {}

export const Text = memo((props: TextProps) => {
  const text = useRef<string>("");
  const { setElementProps } = useStore();

  const handleTextChange: ChangeEventHandler<HTMLDivElement> = (e) => {
    const target = e.target;
    text.current = target.innerText;
    const { height } = target.getBoundingClientRect();
    setElementProps(props.id!, { height: height });
  };

  return (
    <foreignObject {...props}>
      <div
        contentEditable="plaintext-only"
        onInput={handleTextChange}
        suppressContentEditableWarning={true}
        className="border-none text-left z-30 text-wrap outline-none focus:border-none focus:outline-none"
      >
        Over 17,000 documents from HazteOir and CitizenGO, Spanish right-wing
        campaigning organizations. Their links to Spain's far-right political
        party Vox and the Mexican sect El Yunque are well documented. These
        documents include HazteOir founding CitizenGo in 2013 to expand their
        reach, as well as their organzing of the 2012 World Congress of
        Families, an influential American far-right platform
      </div>
    </foreignObject>
  );
});
