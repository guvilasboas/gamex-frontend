import { atomWithImmer } from "jotai-immer";

export type Direction = "down" | "left" | "right" | "up";

export type GameEntity = {
  id?: string;
  position?: {
    x?: number;
    y?: number;
  };
  size?: {
    x?: number;
    y?: number;
  };
  type?: string;
  facing?: Direction;
  sessionId?: string;
  tags?: string[];
  [key: string]: unknown;
};

export type GameState = {
  entities: Record<string, GameEntity>;
  components: Record<string, unknown>;
};

export const gameStateAtom = atomWithImmer<GameState>({
  entities: {},
  components: {},
});
