import { useSocket } from "../../../../socket";
import styles from "./socket-connection-status.module.css";

export function SocketConnectionStatus() {
  const { status } = useSocket();

  return (
    <div className={styles.SocketConnectionBadge}>
      <span
        className={styles.SocketConnectionIndicator}
        data-status={status.toLowerCase()}
      />
      <span className={styles.SocketConnectionText}>{status}</span>
    </div>
  );
}
