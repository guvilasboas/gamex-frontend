import { Stage } from "react-konva";
import { useWindowSize } from "react-use";
import styles from "./game.module.css";
import { GameStore } from "./game-store";
import { usePlayerMove } from "./use-player-move";
import { GameEntities } from "./game-entities";
import { PlayersLayer } from "./game-entities/players";

export function Game() {
  const { width, height } = useWindowSize();
  usePlayerMove();

  return (
    <div className={styles.Root}>
      <GameStore>
        <Stage width={width} height={height} className={styles.Stage}>
          <PlayersLayer />
          <GameEntities />
        </Stage>
      </GameStore>
    </div>
  );
}
