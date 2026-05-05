import { Layer, Group } from "react-konva";
import { playersAtom } from "../../../../atoms";
import { useAtomValue } from "jotai/react";
import { Player } from "../player";
import { useCamera } from "../../../use-camera";
import { SPRITE_SRC } from "../../../sprite-config";
import { useImage } from "../../../../hooks/use-image";

export function PlayersLayer() {
  const players = useAtomValue(playersAtom);
  const camera = useCamera();
  const sprite = useImage(SPRITE_SRC);

  return (
    <Layer>
      <Group x={camera.x} y={camera.y}>
        {players.map((player) => (
          <Player
            key={player.id}
            x={player.x}
            y={player.y}
            walking={player.walking}
            direction={player.facing}
            image={sprite}
          />
        ))}
      </Group>
    </Layer>
  );
}
