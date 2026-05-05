import { FaBug } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import styles from "./debug-button.module.css";
import { Dialog } from "radix-ui";
import { DebugContent } from "../debug-content";

export function DebugButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className={styles.DebugButton}
          type="button"
          aria-label="Open debug panel"
        >
          <FaBug />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        <Dialog.Content className={styles.DialogContent}>
          <div className={styles.DialogHeader}>
            <Dialog.Title className={styles.DialogTitle}>
              Debug Panel
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className={styles.CloseButton}
                type="button"
                aria-label="Close debug panel"
              >
                <IoClose />
              </button>
            </Dialog.Close>
          </div>
          <div className={styles.DialogBody}>
            <DebugContent />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
