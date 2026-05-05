import { useEffect, useRef } from "react";
import { useSocketEmit } from "../socket";

const MOVE_INTERVAL_MS = 1000 / 20; // ~20 fps

type KeyState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export function usePlayerMove(): void {
  const emit = useSocketEmit();
  const keys = useRef<KeyState>({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const anyPressed = () => {
      const { up, down, left, right } = keys.current;
      return up || down || left || right;
    };

    const startLoop = () => {
      if (intervalRef.current !== null) return;
      intervalRef.current = setInterval(() => {
        if (anyPressed()) {
          emit("session:action", { type: "move", ...keys.current });
        }
      }, MOVE_INTERVAL_MS);
    };

    const stopLoop = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      let changed = false;
      if (e.key === "ArrowUp" || e.key.toLocaleLowerCase() === "w") {
        keys.current.up = true;
        changed = true;
      }
      if (e.key === "ArrowDown" || e.key.toLocaleLowerCase() === "s") {
        keys.current.down = true;
        changed = true;
      }
      if (e.key === "ArrowLeft" || e.key.toLocaleLowerCase() === "a") {
        keys.current.left = true;
        changed = true;
      }
      if (e.key === "ArrowRight" || e.key.toLocaleLowerCase() === "d") {
        keys.current.right = true;
        changed = true;
      }
      if (changed) startLoop();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key.toLocaleLowerCase() === "w")
        keys.current.up = false;
      if (e.key === "ArrowDown" || e.key.toLocaleLowerCase() === "s")
        keys.current.down = false;
      if (e.key === "ArrowLeft" || e.key.toLocaleLowerCase() === "a")
        keys.current.left = false;
      if (e.key === "ArrowRight" || e.key.toLocaleLowerCase() === "d")
        keys.current.right = false;

      if (!anyPressed()) {
        emit("session:action", {
          type: "move",
          up: false,
          down: false,
          left: false,
          right: false,
        });
        stopLoop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      stopLoop();
    };
  }, [emit]);
}
