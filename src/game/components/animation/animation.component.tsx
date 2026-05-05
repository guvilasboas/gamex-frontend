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
  }, [props.animation, props.playing]);

  if (!sprite) return null;

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
    />
  );
}
