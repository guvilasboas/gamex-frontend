import type { Direction } from "../../../../atoms";
import { Animation } from "../../../components/animation";

export type PlayerProps = {
  x: number;
  y: number;
  walking: boolean;
  direction: Direction;
  image: HTMLImageElement | undefined;
  width: number;
  height: number;
};

const toNpcDirection = (direction: Direction) =>
  direction === "up" ? "top" : direction;

export function Player({
  x,
  y,
  walking,
  direction,
  image,
  width,
  height,
}: PlayerProps) {
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
      width={width}
      height={height}
    />
  );
}
