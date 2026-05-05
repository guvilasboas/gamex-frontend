import { useState } from "react";
import { Link } from "react-router";
import type { LoginRequestDto } from "../../../../api/requests";
import { useLoginAction } from "../../../../auth";
import { Button } from "../../../elements/button";
import { Input } from "../../../elements/input";
import { Label } from "../../../elements/label";
import styles from "../../portal-page.module.css";

const initialState: LoginRequestDto = {
  username: "",
  password: "",
};

export function LoginPage() {
  const [form, setForm] = useState<LoginRequestDto>(initialState);
  const login = useLoginAction();

  const onSubmit = (event) => {
    event.preventDefault();
    login.mutate({ body: form });
  };

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <p className={styles.eyebrow}>GameX Chronicle</p>
        <h1 className={styles.heroTitle}>Return to the frontier.</h1>
        <p className={styles.heroText}>
          Reconnect with your guild, reclaim your inventory, and step back into
          a persistent realm shaped by sieges, trade routes, and nightly raids.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>128</span>
            <span className={styles.statLabel}>Online clans</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>24/7</span>
            <span className={styles.statLabel}>World events</span>
          </div>
        </div>
      </section>

      <form className={styles.formCard} onSubmit={onSubmit}>
        <div className={styles.formHeader}>
          <p className={styles.eyebrow}>Access portal</p>
          <h2 className={styles.formTitle}>Login</h2>
          <p className={styles.formSubtitle}>
            Enter your credentials and deploy direto no lobby central.
          </p>
        </div>

        <div className={styles.formGrid}>
          <Label>
            Username
            <Input
              value={form.username}
              placeholder="shadowrider"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
            />
          </Label>

          <Label>
            Password
            <Input
              type="password"
              placeholder="Enter your passphrase"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          </Label>
        </div>

        {login.error ? (
          <div className={styles.errorBanner}>
            Login failed. Check your data.
          </div>
        ) : null}

        <Button
          className={styles.primaryButton}
          type="submit"
          disabled={login.isPending}
        >
          {login.isPending ? "Signing in..." : "Enter world"}
        </Button>

        <div className={styles.footerLinks}>
          <span>No character registered?</span>
          <Link className={styles.textLink} to="/auth/signup">
            Create an account
          </Link>
        </div>
      </form>
    </main>
  );
}
