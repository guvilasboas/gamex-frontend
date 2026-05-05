import type { Direction } from "../atoms";

export const SPRITE_SRC = "/assets/player-2.png";

/**
 * Source frame size inside the sprite sheet.
 * This asset is a 4x4 sheet stored in a 225x225 image, which leaves each cell
 * effectively at 56x56 plus an extra trailing transparent pixel on the sheet.
 */
export const FRAME_W = 56;
export const FRAME_H = 56;

/** Render size in the canvas. */
export const RENDER_W = 64;
export const RENDER_H = 64;

/** Walk animation speed in frames per second. */
export const WALK_FRAME_RATE = 8;

/**
 * Classic 4-column character sheet layout:
 * 0 = left step, 1 = idle, 2 = right step, 3 = idle repeat.
 */
const WALK_FRAME_SEQUENCE = [0, 1, 2, 1] as const;
const IDLE_FRAME = 1;

/** Sprite sheet row index for each direction (top = 0). */
const DIRECTION_ROW: Record<Direction, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

const DIRECTIONS: Direction[] = ["down", "left", "right", "up"];

/**
 * Flat animations map for the react-konva Sprite component.
 * Keys: "walk-down" | "walk-left" | "walk-right" | "walk-up"
 *       "idle-down" | "idle-left" | "idle-right" | "idle-up"
 * Values: [x, y, w, h, x, y, w, h, ...]
 */
export const SPRITE_ANIMATIONS: Record<string, number[]> = {};

for (const dir of DIRECTIONS) {
  const row = DIRECTION_ROW[dir];
  const walkFrames: number[] = [];
  for (const col of WALK_FRAME_SEQUENCE) {
    walkFrames.push(col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H);
  }
  SPRITE_ANIMATIONS[`walk-${dir}`] = walkFrames;
  SPRITE_ANIMATIONS[`idle-${dir}`] = [
    IDLE_FRAME * FRAME_W,
    row * FRAME_H,
    FRAME_W,
    FRAME_H,
  ];
}
