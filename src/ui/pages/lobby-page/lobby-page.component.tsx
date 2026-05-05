import { Link } from "react-router";
import { useAuthSession, useLogoutAction } from "../../../auth";
import { Button } from "../../elements/button";
import styles from "../portal-page.module.css";

export function LobbyPage() {
  const { session } = useAuthSession();
  const logout = useLogoutAction();

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <p className={styles.eyebrow}>Central lobby</p>
        <h1 className={styles.heroTitle}>Welcome, {session?.username}.</h1>
        <p className={styles.heroText}>
          The realm is active. Parties are forming, trade contracts are open,
          and field bosses are expected to spawn before dawn.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>03</span>
            <span className={styles.statLabel}>Regions contested</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>12</span>
            <span className={styles.statLabel}>Squads recruiting</span>
          </div>
        </div>
      </section>

      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <p className={styles.eyebrow}>Deployment board</p>
          <h2 className={styles.formTitle}>Choose your next move</h2>
          <p className={styles.formSubtitle}>
            Head into the battlefield, return to the public portal, or close the
            current session.
          </p>
        </div>

        <div className={styles.actionStack}>
          <Link className={styles.primaryLink} to="/game">
            Enter game
          </Link>
          <Link className={styles.secondaryLink} to="/">
            Back home
          </Link>
          <Button className={styles.ghostButton} type="button" onClick={logout}>
            Logout
          </Button>
        </div>
      </section>
    </main>
  );
}
