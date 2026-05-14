import { useAtomValue } from "jotai/react";
import { useAuthSession } from "../auth";
import { gameStateAtom } from "../atoms";
import { get } from "lodash";

export function useCurrentPlayer() {
  const { session } = useAuthSession();
  const { entities } = useAtomValue(gameStateAtom);

  if (!session) {
    return undefined;
  }

  return get(entities, session.id);
}
