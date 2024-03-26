import { memo } from "react";
import useStore from "../state/store";

const BackgroundGrid = memo(() => {
  const gridSize = 12;
  const gridDotSize = 2;
  const gridColor = "#e6e6e6";
  const { viewBox } = useStore();

  return (
    <g transform={`translate(${viewBox.x} ,${viewBox.y})`}>
      <defs>
        <pattern
          id="dot-pattern"
          patternUnits="userSpaceOnUse"
          x={`${-viewBox.x}`}
          y={`${-viewBox.y}`}
          width={gridSize}
          height={gridSize}
        >
          <rect
            width={gridDotSize}
            height={gridDotSize}
            fill={gridColor}
            x={gridSize / 2 - gridDotSize / 2}
            y={gridSize / 2 - gridDotSize / 2}
            rx={gridDotSize / 2}
          />
        </pattern>
      </defs>
      <rect
        fill="url(#dot-pattern)"
        width="100%"
        height="100%"
        data-type="whiteboard"
      />
    </g>
  );
});

export default BackgroundGrid;
