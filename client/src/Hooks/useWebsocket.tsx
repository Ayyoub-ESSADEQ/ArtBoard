import { useEffect } from "react";
import { io } from "socket.io-client";
import {mouseToSvgCoords} from "Utils";
import useStore from "Store";
import { SocketSingleton } from "Utils";

export function useWebsocket(ref: React.RefObject<SVGSVGElement>) {
  const {
    updateCollaboratorCursor,
    setCollaborators,
    addCollaborator,
    removeCollaboratorCursor,
    setElementProps,
    addBoardElement,
  } = useStore();

  useEffect(() => {
    const socket = io("http://localhost:3000");
    SocketSingleton.init(socket);

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

    socket.on("users", (data) => setCollaborators(data));

    socket.on("collaboartor_move_cursor", ({ x, y, userId }) => {
      const { scale } = useStore.getState();
      updateCollaboratorCursor(userId, { x: x / scale, y: y / scale });
    });

    socket.on("collaborator_disconnected", ({ userId }) =>
      removeCollaboratorCursor(userId)
    );

    socket.on("new_collaborator_join", (data) => addCollaborator(data));

    socket.on("collaborator_update_element", ({ id, props }) => {
      setElementProps(id, props, true);
    });

    socket.on("collaborator_add_element", ({ element }) => {
      addBoardElement(element, true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
