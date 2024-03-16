import { useEffect } from "react";
import { io } from "socket.io-client";
import mouseToSvgCoords from "../utils/mouseToSvgCoords";

export default function useWebsocket(ref: React.RefObject<SVGSVGElement>) {
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref.current?.addEventListener("mousemove", (e: any) => {
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
