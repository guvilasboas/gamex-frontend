import { io, type Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "./socket.events";

const URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: false,
  },
);
