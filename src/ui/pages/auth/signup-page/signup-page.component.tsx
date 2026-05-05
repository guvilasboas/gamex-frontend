import { useState } from "react";
import { Link } from "react-router";
import type { SignupRequestDto } from "../../../../api/requests";
import { useSignupAction } from "../../../../auth";
import { Button } from "../../../elements/button";
import { Input } from "../../../elements/input";
import { Label } from "../../../elements/label";
import styles from "../../portal-page.module.css";

const initialState: SignupRequestDto = {
  name: "",
  username: "",
  password: "",
  passwordConfirmation: "",
};

export function SignupPage() {
  const [form, setForm] = useState<SignupRequestDto>(initialState);
  const signup = useSignupAction();

  const onSubmit = (event) => {
    event.preventDefault();
    signup.mutate({ body: form });
  };

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <p className={styles.eyebrow}>New Adventurer</p>
        <h1 className={styles.heroTitle}>Forge your first identity.</h1>
        <p className={styles.heroText}>
          Reserve a name, align your credentials, and join a living MMORPG world
          built around parties, rival factions, and territorial control.
        </p>
        <div className={styles.featureList}>
          <div className={styles.featureItem}>Persistent progression</div>
          <div className={styles.featureItem}>Open-world encounters</div>
          <div className={styles.featureItem}>Guild-driven economy</div>
        </div>
      </section>

      <form className={styles.formCard} onSubmit={onSubmit}>
        <div className={styles.formHeader}>
          <p className={styles.eyebrow}>Character registry</p>
          <h2 className={styles.formTitle}>Sign up</h2>
          <p className={styles.formSubtitle}>
            Create your access profile before selecting your build and entering
            the starter province.
          </p>
        </div>

        <div className={styles.formGrid}>
          <Label>
            Name
            <Input
              value={form.name}
              placeholder="Ayla Stormborn"
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </Label>

          <Label>
            Username
            <Input
              value={form.username}
              placeholder="ayla.storm"
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
              placeholder="Create a passphrase"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          </Label>

          <Label>
            Confirm password
            <Input
              type="password"
              placeholder="Repeat your passphrase"
              value={form.passwordConfirmation}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  passwordConfirmation: event.target.value,
                }))
              }
            />
          </Label>
        </div>

        {signup.error ? (
          <div className={styles.errorBanner}>
            Signup failed. Review the submitted fields.
          </div>
        ) : null}

        <Button
          className={styles.primaryButton}
          type="submit"
          disabled={signup.isPending}
        >
          {signup.isPending ? "Creating account..." : "Create adventurer"}
        </Button>

        <div className={styles.footerLinks}>
          <span>Already enlisted?</span>
          <Link className={styles.textLink} to="/auth/login">
            Back to login
          </Link>
        </div>
      </form>
    </main>
  );
}
