import { GameState } from "../atoms/game-state.atom";

export type SessionInitPayload = GameState;

export type SessionAction = {
  type: string;
  [key: string]: unknown;
};

export type SessionPatchPayload = {
  type: "set" | "delete";
  key: string;
  value?: unknown;
};
export interface ServerToClientEvents {
  ["session:init"]: (payload: SessionInitPayload) => void;
  ["session:patch"]: (patch: SessionPatchPayload[]) => void;
  [event: string]: (...args: any[]) => any;
}
export interface ClientToServerEvents {
  ["session:action"]: (action: SessionAction) => void;
  [event: string]: (...args: any[]) => any;
}
