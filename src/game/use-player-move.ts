import { useEffect, useRef } from "react";
import { useSocketEmit } from "../socket";

const SNAPSHOT_INTERVAL_MS = 1000 / 20; // match server tick rate

type KeyState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
  space: boolean;
};

export function usePlayerMove(): void {
  const emit = useSocketEmit();
  const keys = useRef<KeyState>({
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
    space: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sequenceRef = useRef(0);

  useEffect(() => {
    const nextSeq = () => ++sequenceRef.current;

    const anyPressed = () => {
      const { up, down, left, right } = keys.current;
      return up || down || left || right;
    };

    const sendSnapshot = () => {
      const payload = {
        type: "input.snapshot",
        sequence: nextSeq(),
        inputs: {
          "move.up": keys.current.up,
          "move.down": keys.current.down,
          "move.left": keys.current.left,
          "move.right": keys.current.right,
          "move.shift": keys.current.shift,
          "move.space": keys.current.space,
        },
      };

      emit("session:action", payload);
    };

    const startLoop = () => {
      if (intervalRef.current !== null) return;
      intervalRef.current = setInterval(sendSnapshot, SNAPSHOT_INTERVAL_MS);
    };

    const stopLoop = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore repeat events (key held)
      if (e.repeat) return;

      let changed = false;
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        keys.current.up = true;
        changed = true;
      }
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        keys.current.down = true;
        changed = true;
      }
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        keys.current.left = true;
        changed = true;
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        keys.current.right = true;
        changed = true;
      }
      if (e.key === "Shift") {
        keys.current.shift = true;
        changed = true;
      }
      if (e.key === " ") {
        keys.current.space = true;
        changed = true;
      }

      if (changed) {
        // Send immediately so the server sees the change before the next
        // interval tick (avoids up-to-50ms direction lag)
        sendSnapshot();
        startLoop();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let changed = false;
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        keys.current.up = false;
        changed = true;
      }
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        keys.current.down = false;
        changed = true;
      }
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        keys.current.left = false;
        changed = true;
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        keys.current.right = false;
        changed = true;
      }
      if (e.key === "Shift") {
        keys.current.shift = false;
        changed = true;
      }

      if (changed) {
        sendSnapshot();
        if (!anyPressed()) {
          stopLoop();
        }
      }
    };

    // When the window loses focus, release all keys so the player
    // doesn't keep moving while the tab is in the background.
    const handleBlur = () => {
      keys.current = {
        up: false,
        down: false,
        left: false,
        right: false,
        shift: false,
        space: false,
      };
      sendSnapshot();
      stopLoop();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      stopLoop();
    };
  }, [emit]);
}
