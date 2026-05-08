import { Sprite } from "react-konva";
import * as resources from "../../game-animations";
import get from "lodash/get";
import { useEffect, useRef } from "react";
import type Konva from "konva";
import { useImage } from "../../../hooks/use-image";

export type AnimationProps = {
  resource: string;
  frameRate?: number;
  x: number;
  y: number;
  animation: string;
  playing?: boolean;
  height?: number;
  width?: number;
};

export function Animation(props: AnimationProps) {
  const resource = get<any>(resources as any, props.resource, {});
  const { animations, resource: image } = resource;
  const spriteRef = useRef<Konva.Sprite>(null);

  const sprite = useImage(image);

  useEffect(() => {
    const s = spriteRef.current;
    if (!s) return;
    s.animation(props.animation);
    s.frameIndex(0);
    if (props.playing) {
      s.start();
    } else {
      s.stop();
    }
    s.getLayer()?.batchDraw();
  }, [sprite, props.animation, props.playing]);

  if (!sprite) return null;

  // animations format: { name: [x, y, frameW, frameH, x, y, frameW, frameH, ...] }
  const frames = animations[props.animation] as number[] | undefined;
  const frameWidth = frames?.[2] ?? sprite.width;
  const frameHeight = frames?.[3] ?? sprite.height;

  const xScale = props.width ? props.width / frameWidth : 1;
  const yScale = props.height ? props.height / frameHeight : 1;

  return (
    <Sprite
      ref={spriteRef}
      image={sprite}
      x={props.x}
      y={props.y}
      width={props.width ?? 32}
      height={props.height ?? 32}
      animations={animations}
      animation={props.animation}
      frameRate={props.frameRate ?? 8}
      scale={{
        x: xScale,
        y: yScale,
      }}
    />
  );
}
