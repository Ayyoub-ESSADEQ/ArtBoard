import { useEffect } from "react";

export function useFullScreen(ref: React.RefObject<SVGSVGElement>) {
  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = `${screen.availWidth}px`;
      ref.current.style.height = `${screen.availHeight}px`;
    }
  });
}
