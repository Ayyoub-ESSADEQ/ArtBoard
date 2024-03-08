import { useEffect } from "react";
import { io } from "socket.io-client";
import { mouseToSvgCoords } from "../utils/MouseEventContext";

export default function useWebsocket(ref: React.RefObject<SVGSVGElement>) {
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      ref.current?.addEventListener("mousemove", (e: MouseEvent) => {
        const { x, y } = mouseToSvgCoords(e);
        console.log(x, y);
      });
    });

    socket.on("message", (data) => console.log(data));

    return () => {
      socket.disconnect();
    };
  }, []);
}
