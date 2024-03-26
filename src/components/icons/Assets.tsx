import { SVGProps, memo } from "react";

export const Assets = memo((props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <g fill="none">
        <g clipPath="url(#gravityUiShapes30)">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M8 2.075L10.193 6H5.807zM6.909.953a1.25 1.25 0 0 1 2.182 0l2.62 4.687A1.25 1.25 0 0 1 10.62 7.5H5.38a1.25 1.25 0 0 1-1.09-1.86zM4 15.25a3.5 3.5 0 1 1 .001-6.999A3.5 3.5 0 0 1 4 15.25m2-3.5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m8 1.75h-3.5V10H14zM9 9.75c0-.69.56-1.25 1.25-1.25h4c.69 0 1.25.56 1.25 1.25v4c0 .69-.56 1.25-1.25 1.25h-4C9.56 15 9 14.44 9 13.75z"
            clipRule="evenodd"
          ></path>
        </g>
        <defs>
          <clipPath id="gravityUiShapes30">
            <path fill="currentColor" d="M0 0h16v16H0z"></path>
          </clipPath>
        </defs>
      </g>
    </svg>
  );
});

export default Assets;
