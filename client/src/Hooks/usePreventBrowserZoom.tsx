import { useEffect } from "react";

export function usePreventBrowserZoom() {
  useEffect(() => {
    const preventZoomShortcuts = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        [
          "=", // "+" key
          "+", // "+" key on numpad
          "-", // "-" key
          "-", // "-" key on numpad
          "=", // "=" key on numpad
          "-", // "-" key on numpad
        ].includes(event.key)
      ) {
        event.preventDefault();
      }
    };

    const preventZoomWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", preventZoomShortcuts);
    document.addEventListener("wheel", preventZoomWheel, {
      passive: false,
    });

    return () => {
      document.removeEventListener("keydown", preventZoomShortcuts);
      document.removeEventListener("wheel", preventZoomWheel);
    };
  }, []);
}
