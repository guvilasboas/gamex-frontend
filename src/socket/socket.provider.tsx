import { useEffect, useState, type ReactNode } from "react";
import { socket } from "./socket.client";
import { SocketContext, SocketStatus } from "./socket.context";
import { getAccessToken } from "../auth";

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [status, setStatus] = useState<SocketStatus>(SocketStatus.DISCONNECTED);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      socket.disconnect();
      setStatus(SocketStatus.DISCONNECTED);
      return;
    }

    socket.auth = { token };
    socket.connect();
    setStatus(SocketStatus.CONNECTING);

    function onConnect() {
      setStatus(SocketStatus.CONNECTED);
    }

    function onDisconnect() {
      setStatus(SocketStatus.DISCONNECTED);
    }

    function onConnectError() {
      setStatus(SocketStatus.DISCONNECTED);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, status }}>
      {children}
    </SocketContext.Provider>
  );
}
