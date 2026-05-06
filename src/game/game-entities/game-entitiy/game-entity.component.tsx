import { Rect } from "react-konva";
import { isEngineRectComponent } from "../../../engine/engine-components";

export type GameEntityProps = {
  component: unknown;
};

export function GameEntity({ component }: GameEntityProps) {
  if (isEngineRectComponent(component)) {
    const { position, size, fillColor, strokeColor, strokeWidth } = component;
    return (
      <Rect
        x={position.x}
        y={position.y}
        width={size.x}
        height={size.y}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  }

  return <></>;
}
