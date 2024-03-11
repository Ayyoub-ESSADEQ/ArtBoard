import { memo } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

const CollaboratorCursor = memo(() => {
  return <g transform={`translate`}></g>;
});

export default CollaboratorCursor;
