import { useAtomValue } from "jotai/react";
import { useWindowSize } from "react-use";
import { playersAtom } from "../atoms";
import { useAuthSession } from "../auth";

export function useCamera(): { x: number; y: number } {
  const { session } = useAuthSession();
  const players = useAtomValue(playersAtom);
  const { width, height } = useWindowSize();

  const currentPlayer = players.find((p) => p.id === session?.id);
  if (!currentPlayer) return { x: 0, y: 0 };

  return {
    x: width / 2 - currentPlayer.x,
    y: height / 2 - currentPlayer.y,
  };
}
