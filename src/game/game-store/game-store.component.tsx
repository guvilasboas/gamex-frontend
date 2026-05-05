import type { PropsWithChildren } from "react";
import { useSocketOn } from "../../socket";
import { useSetAtom } from "jotai/react";
import type {
  SessionInitPayload,
  SessionPatchPayload,
} from "../../socket/socket.events";
import { gameStateAtom } from "../../atoms/game-state.atom";
import unset from "lodash/unset";
import { set } from "lodash";

export type GameStoreProps = PropsWithChildren<{}>;

export function GameStore({ children }: GameStoreProps) {
  const setGameState = useSetAtom(gameStateAtom);

  useSocketOn("session:init", (props: SessionInitPayload) => {
    setGameState(props);
  });

  useSocketOn("session:patch", (patch: SessionPatchPayload) => {
    setGameState((state) => {
      if (patch.type === "delete") {
        unset(state, patch.key);
      }

      if (patch.type == "set") {
        set(state, patch.key, patch.value);
      }

      return state;
    });
  });

  return <>{children}</>;
}
