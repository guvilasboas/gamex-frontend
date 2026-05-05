import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import styles from "./label.module.css";

const css = cva(styles.Label);

export type LabelProps = ComponentProps<"label"> & VariantProps<typeof css>;

export function Label({ className, ...props }: LabelProps) {
  return <label {...props} className={css({ className })} />;
}
