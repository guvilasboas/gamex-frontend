import { useCallback } from "react";
import type { ClientToServerEvents } from "./socket.events";
import { useSocket } from "./use-socket";

export function useSocketEmit() {
  const { socket } = useSocket();

  const emit = useCallback(
    <E extends keyof ClientToServerEvents & string>(
      event: E,
      ...args: Parameters<ClientToServerEvents[E]>
    ): void => {
      socket.emit(event, ...args);
    },
    [socket],
  );

  return emit;
}
