import { memo } from "react";

export const RightPanelCollapse = memo(
  (props: Readonly<React.SVGProps<SVGSVGElement>>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22px"
        height="22px"
        viewBox="0 0 24 24"
        {...props}
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm11-2v16"></path>
          <path d="m9 10l2 2l-2 2"></path>
        </g>
      </svg>
    );
  }
);
