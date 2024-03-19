import { memo, useEffect, useRef, useState } from "react";
import useStore, { CollaboratorCursorPosition } from "../state/store";

const PADDING = { x: 8, y: 2 };

const CollaboratorCursor = memo(
  ({ x, y, username, userId }: CollaboratorCursorPosition) => {
    const { scale } = useStore();
    const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
    const text = useRef<SVGTextElement>(null);

    useEffect(() => {
      if (text.current === null) return;
      const textSize = text.current.getBBox();
      setSize({ width: textSize.width, height: textSize.height });
    }, []);

    return (
      <g transform={`scale(${scale}) translate(${x}, ${y})`} key={userId}>
        <defs>
          <filter
            id="prefix__a"
            x=".726"
            y=".906"
            width="395.86"
            height="432.694"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="19.876" />
            <feGaussianBlur stdDeviation="19.876" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.28 0" />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_2_20"
              result="shape"
            />
          </filter>
        </defs>

        <svg
          width="20"
          height="21.861"
          viewBox="0 0 5.292 5.784"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            filter="url(#prefix__a)"
            transform="matrix(.01337 0 0 .01337 -.01 -.012)"
          >
            <path
              d="M50.428 30.746l296.466 169.909-143.891 44.263a19.878 19.878 0 00-10.828 8.175L120.16 364.028z"
              stroke="#fff"
              strokeWidth="19.876"
              fill={"#8328de"}
            />
          </g>
        </svg>
        <rect
          x={20}
          y={25}
          width={width + 2 * PADDING.x}
          height={height + 2 * PADDING.y}
          fill={"#8328de"}
        />
        <text
          x={20 + PADDING.x}
          y={39 + PADDING.y}
          ref={text}
          fontSize={14}
          fill="white"
          fontWeight={500}
        >
          {username}
        </text>
      </g>
    );
  }
);

const Collaboration = memo(() => {
  const { collaborators } = useStore();

  return collaborators.map((props) => (
    <CollaboratorCursor {...props} key={props.userId} />
  ));
});

export default Collaboration;
