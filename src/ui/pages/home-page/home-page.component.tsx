import { Link } from "react-router";
import { useAuthSession } from "../../../auth";
import styles from "./home-page.module.css";

export function HomePage() {
  const { session, isLoading, isPending } = useAuthSession();

  if (isLoading || isPending) {
    return <main className={styles.loadingState}>Loading session...</main>;
  }

  const primaryHref = session ? "/lobby" : "/auth/login";
  const primaryLabel = session ? "Go to lobby" : "Login";

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Persistent MMORPG World</p>
          <h1 className={styles.title}>GameX</h1>
          <p className={styles.subtitle}>
            March through a shared realm of guild wars, open-field hunts, market
            disputes, and cooperative raids that keep evolving whether you are
            online or not.
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} to={primaryHref}>
              {primaryLabel}
            </Link>
            <a className={styles.secondaryAction} href="#world-overview">
              Discover the world
            </a>
          </div>

          <div className={styles.metrics}>
            <article className={styles.metricCard}>
              <strong>4 factions</strong>
              <span>Shifting alliances and zone control conflicts.</span>
            </article>
            <article className={styles.metricCard}>
              <strong>World bosses</strong>
              <span>
                Rotating encounters that pull entire regions together.
              </span>
            </article>
            <article className={styles.metricCard}>
              <strong>Guild economy</strong>
              <span>Crafting, trading, escorting, and territorial taxes.</span>
            </article>
          </div>
        </div>

        <aside className={styles.heroPanel}>
          <div className={styles.panelBadge}>Season 03</div>
          <h2 className={styles.panelTitle}>The frontier is unstable.</h2>
          <p className={styles.panelText}>
            Ancient gates reopened, rare resources resurfaced, and every guild
            now races to hold the routes between capital cities and wasteland
            strongholds.
          </p>
          <div className={styles.panelList}>
            <div className={styles.panelItem}>
              <span className={styles.panelLabel}>Prime activity</span>
              <strong>Night raids and elite hunts</strong>
            </div>
            <div className={styles.panelItem}>
              <span className={styles.panelLabel}>Recommended play</span>
              <strong>Squads of 4 to 8 players</strong>
            </div>
            <div className={styles.panelItem}>
              <span className={styles.panelLabel}>Core loop</span>
              <strong>Fight, gather, craft, siege, repeat</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.overview} id="world-overview">
        <article className={styles.overviewCard}>
          <p className={styles.cardEyebrow}>Combat</p>
          <h3 className={styles.cardTitle}>Large-scale clashes</h3>
          <p className={styles.cardText}>
            Contest camps, defend caravans, and turn regional skirmishes into
            guild-wide wars with real map consequences.
          </p>
        </article>

        <article className={styles.overviewCard}>
          <p className={styles.cardEyebrow}>Progression</p>
          <h3 className={styles.cardTitle}>Build a lasting character</h3>
          <p className={styles.cardText}>
            Evolve your role through gear, specialization paths, and social
            reputation earned across repeated expeditions.
          </p>
        </article>

        <article className={styles.overviewCard}>
          <p className={styles.cardEyebrow}>Community</p>
          <h3 className={styles.cardTitle}>Guilds shape the server</h3>
          <p className={styles.cardText}>
            Politics, trade pacts, and rivalries matter as much as raw power in
            a world designed around recurring player interaction.
          </p>
        </article>
      </section>
    </main>
  );
}
