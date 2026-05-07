import { Group, Rect, Text } from "react-konva";
import { isEngineRectComponent } from "../../../engine/engine-components";

export type GameEntityProps = {
  component: unknown;
};

export function GameEntity({ component }: GameEntityProps) {
  if (isEngineRectComponent(component)) {
    const { position, size, fillColor, strokeColor, strokeWidth } = component;
    return (
      <Group x={position.x} y={position.y}>
        <Rect
          width={size.x}
          height={size.y}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <Text
          text={`${position.x}:${position.y}`}
          fontSize={14}
          fill="#00b115"
          align="center"
          y={-16}
        />
      </Group>
    );
  }

  return <></>;
}
