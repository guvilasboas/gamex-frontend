import type { Socket } from "socket.io-client";
import { SocketContext, type SocketStatus } from "./socket.context";
import { useContext } from "react";

interface UseSocketReturn {
  socket: Socket;
  status: SocketStatus;
}

export function useSocket(): UseSocketReturn {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return ctx;
}
