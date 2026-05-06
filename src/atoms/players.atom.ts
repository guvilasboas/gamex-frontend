import { atom } from "jotai/vanilla";
import { gameStateAtom } from "./game-state.atom";

export type Player = {
  id: string;
  x: number;
  y: number;
  height: number;
  width: number;
  walking: boolean;
  idle: boolean;
  facing: Direction;
};

export type Direction = "down" | "left" | "right" | "up";

export const playersAtom = atom<Player[]>((get) => {
  const entities = get(gameStateAtom)?.entities ?? {};

  const players = Object.values(entities)
    .filter((entity) => entity?.tags?.includes("player"))
    .map((entity) => ({
      id: entity.id ?? "",
      x: entity.position?.x ?? 0,
      y: entity.position?.y ?? 0,
      walking: entity.tags?.includes("walking") ?? false,
      idle: entity.tags?.includes("idle") ?? false,
      facing: (entity.facing as Direction) || "down",
      height: entity.size?.y ?? 52,
      width: entity.size?.x ?? 32,
    }));

  return players;
});
