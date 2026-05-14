import { FaHeart } from "react-icons/fa";
import styles from "./game-hud.module.css";
import { useCurrentPlayer } from "../use-current-player";
import { get } from "lodash";

export function GameHud() {
  const player = useCurrentPlayer();
  const CURRENT_HP = get<any, string, number>(player, "health", 0); // Default to 0 if health is undefined
  const MAX_HP = get<any, string, number>(player, "maxHealth", 100); // Default to 100 if maxHealth is undefined

  const hpPercent = (CURRENT_HP / MAX_HP) * 100;

  return (
    <div className={styles.Root}>
      <div className={styles.HealthPanel}>
        <div className={styles.HealthLabel}>
          <FaHeart className={styles.HeartIcon} />
          <span className={styles.HealthText}>HP</span>
        </div>
        <div className={styles.BarTrack}>
          <div className={styles.BarFill} style={{ width: `${hpPercent}%` }} />
        </div>
        <span className={styles.HealthValue}>
          {CURRENT_HP}
          <span className={styles.HealthMax}>/{MAX_HP}</span>
        </span>
      </div>
    </div>
  );
}
