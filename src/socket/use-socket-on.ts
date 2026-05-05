import { useEffect } from "react";
import type { ServerToClientEvents } from "./socket.events";
import { useSocket } from "./use-socket";

export function useSocketOn<E extends keyof ServerToClientEvents>(
  event: E,
  handler: ServerToClientEvents[E],
): void {
  const { socket } = useSocket();

  useEffect(() => {
    const listener = (...args: Parameters<ServerToClientEvents[E]>) =>
      handler(...args);

    socket.on(String(event), listener);

    return () => {
      socket.off(String(event), listener);
    };
  }, [socket, event, handler]);
}
