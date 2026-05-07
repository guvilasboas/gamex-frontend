import { Group, Rect, Text } from "react-konva";
import { isEngineRectComponent } from "../../../engine/engine-components";
import { isEngineAnimation } from "../../../engine/engine-components/engine-animation-component.";
import { Animation } from "../../components/animation";

export type GameEntityProps = {
  component: unknown;
};

export function GameEntity({ component }: GameEntityProps) {
  if (isEngineAnimation(component)) {
    const { resource, animation, playing, frameRate, position, size } =
      component;
    return (
      <Animation
        resource={resource}
        animation={animation}
        playing={playing}
        frameRate={frameRate}
        x={position?.x}
        y={position?.y}
        height={size.y}
        width={size.x}
      />
    );
  }

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
