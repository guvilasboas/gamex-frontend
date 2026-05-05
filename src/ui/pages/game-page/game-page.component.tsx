import { Game } from "../../../game";
import { SocketProvider } from "../../../socket";
import { DebugButton } from "../../features/debug/debug-button";
import { SocketConnectionStatus } from "../../features/socket/socket-connection-status/socket-connection-status.component";

const isDevelopment = import.meta.env.DEV;

export function GamePage() {
  return (
    <SocketProvider>
      <Game />
      <SocketConnectionStatus />
      {isDevelopment && <DebugButton />}
    </SocketProvider>
  );
}
