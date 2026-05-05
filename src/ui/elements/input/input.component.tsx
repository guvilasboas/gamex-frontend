import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./input.module.css";

const css = cva(styles.Input);

export type InputProps = ComponentProps<"input"> & VariantProps<typeof css>;

export function Input({ className, ...props }: InputProps) {
  return <input {...props} className={css({ className })} />;
}
