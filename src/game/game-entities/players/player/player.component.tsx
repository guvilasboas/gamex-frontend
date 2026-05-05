import type { Direction } from "../../../../atoms";
import { Animation } from "../../../components/animation";

export type PlayerProps = {
  x: number;
  y: number;
  walking: boolean;
  direction: Direction;
  image: HTMLImageElement | undefined;
};

const toNpcDirection = (direction: Direction) =>
  direction === "up" ? "top" : direction;

export function Player({ x, y, walking, direction, image }: PlayerProps) {
  const npcDir = toNpcDirection(direction);
  const animation = walking ? `walking_${npcDir}` : `idle_${npcDir}`;

  if (!image) return null;

  return (
    <Animation
      resource="npc"
      x={x}
      y={y}
      animation={animation}
      playing={true}
      frameRate={8}
      width={32}
      height={52}
    />
  );
}
