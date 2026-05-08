import { useEffect, useRef } from "react";
import type { ServerToClientEvents } from "./socket.events";
import { useSocket } from "./use-socket";

export function useSocketOn<E extends keyof ServerToClientEvents>(
  event: E,
  handler: ServerToClientEvents[E],
): void {
  const { socket } = useSocket();
  const handlerRef = useRef<ServerToClientEvents[E]>(handler);

  // Keep the ref in sync on every render without re-registering the listener.
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const listener = (...args: Parameters<ServerToClientEvents[E]>) =>
      (
        handlerRef.current as (
          ...a: Parameters<ServerToClientEvents[E]>
        ) => void
      )(...args);

    socket.on(String(event), listener);

    return () => {
      socket.off(String(event), listener);
    };
  }, [socket, event]);
}
