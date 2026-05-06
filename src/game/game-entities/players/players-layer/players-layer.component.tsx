import { Layer } from "react-konva";
import { Player } from "../player";
import { SPRITE_SRC } from "../../../sprite-config";
import { useImage } from "../../../../hooks/use-image";
import { useInterpolatedPlayers } from "../../../hooks/use-interpolated-players";

export function PlayersLayer() {
  const players = useInterpolatedPlayers();
  const sprite = useImage(SPRITE_SRC);

  const sortedPlayers = [...players].sort((a, b) => a.y - b.y);

  return (
    <Layer>
      {sortedPlayers.map((player) => (
        <Player
          key={player.id}
          x={player.x}
          y={player.y}
          walking={player.walking}
          direction={player.facing}
          image={sprite}
          width={player.width}
          height={player.height}
        />
      ))}
    </Layer>
  );
}
