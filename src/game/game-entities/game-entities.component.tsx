import { useAtomValue } from "jotai/react";
import { gameStateAtom } from "../../atoms/game-state.atom";
import { GameEntity } from "./game-entitiy";
import { Group, Layer } from "react-konva";
import { useEngineInterpolation } from "../../engine";
import { useCamera } from "../use-camera";

export function GameEntities() {
  const { components } = useAtomValue(gameStateAtom);

  const interpolatedComponents = useEngineInterpolation(
    Object.values(components),
  );

  const camera = useCamera(interpolatedComponents);

  return (
    <Layer>
      <Group x={camera.x} y={camera.y}>
        {interpolatedComponents.map((component, index) => (
          <GameEntity key={index} component={component} />
        ))}
      </Group>
    </Layer>
  );
}
