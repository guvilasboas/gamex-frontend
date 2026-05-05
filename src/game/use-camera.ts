import { useAtomValue } from "jotai/react";
import { useWindowSize } from "react-use";
import { playersAtom, type Player } from "../atoms";
import { useAuthSession } from "../auth";

/**
 * Returns the camera offset required to centre the local player on screen.
 *
 * Accepts an optional `players` list so callers that already hold an
 * interpolated list can drive the camera with smooth positions instead of
 * the raw server values.
 */
export function useCamera(players?: Player[]): { x: number; y: number } {
  const { session } = useAuthSession();
  const atomPlayers = useAtomValue(playersAtom);
  const list = players ?? atomPlayers;
  const { width, height } = useWindowSize();

  const currentPlayer = list.find((p) => p.id === session?.id);
  if (!currentPlayer) return { x: 0, y: 0 };

  return {
    x: width / 2 - currentPlayer.x,
    y: height / 2 - currentPlayer.y,
  };
}
