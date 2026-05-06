import { useWindowSize } from "react-use";
import { useAuthSession } from "../auth";
import { EngineComponent } from "../engine";

/**
 * Returns the camera offset required to centre the local player on screen.
 *
 * Accepts an optional `players` list so callers that already hold an
 * interpolated list can drive the camera with smooth positions instead of
 * the raw server values.
 */
export function useCamera(entities: EngineComponent[]): {
  x: number;
  y: number;
} {
  const { session } = useAuthSession();
  const { width, height } = useWindowSize();

  const currentPlayer = entities.find((p) => p.entityId === session?.id);
  if (!currentPlayer) {
    return { x: 0, y: 0 };
  }

  return {
    x: width / 2 - currentPlayer.position.x,
    y: height / 2 - currentPlayer.position.y,
  };
}
