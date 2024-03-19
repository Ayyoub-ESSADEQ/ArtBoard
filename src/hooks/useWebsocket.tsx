import { useEffect } from "react";
import { io } from "socket.io-client";
import mouseToSvgCoords from "../utils/mouseToSvgCoords";
import useStore from "../state/store";

export default function useWebsocket(ref: React.RefObject<SVGSVGElement>) {
  const {
    updateCollaboratorCursor,
    setCollaborators,
    addCollaborator,
    removeCollaboratorCursor,
  } = useStore();

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      if (!ref.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref.current.addEventListener("mousemove", (e: any) => {
        const { x, y } = mouseToSvgCoords(e);

        socket.emit("mouse_move", {
          x: x,
          y: y,
        });
      });
    });

    socket.on("collaboartor_move_cursor", ({ x, y, userId }) => {
      const {scale} = useStore.getState();
      updateCollaboratorCursor(userId, { x: x/scale, y: y/scale });
    });

    socket.on("collaborator_disconnected", ({ userId }) =>
      removeCollaboratorCursor(userId)
    );

    socket.on("new_collaborator_join", (data) => addCollaborator(data));

    socket.on("users", (data) => setCollaborators(data));

    return () => {
      socket.disconnect();
    };
  }, []);
}
