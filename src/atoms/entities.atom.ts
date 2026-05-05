import { atomWithImmer } from "jotai-immer";
import type { Direction } from "./players.atom";

export type EntityState = {
  id?: string;
  position?: {
    x?: number;
    y?: number;
  };
  facing?: Direction;
  sessionId?: string;
  tags?: string[];
  [key: string]: unknown;
};

export const entitiesAtom = atomWithImmer<Record<string, EntityState>>({});
