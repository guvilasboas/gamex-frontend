import { useAtomValue } from "jotai/react";
import { gameStateAtom } from "../../atoms/game-state.atom";
import { GameEntity } from "./game-entitiy";
import { Layer } from "react-konva";

export function GameEntities() {
  const { components } = useAtomValue(gameStateAtom);

  return (
    <Layer>
      {Object.values(components).map((component, index) => (
        <GameEntity key={index} component={component} />
      ))}
    </Layer>
  );
}
