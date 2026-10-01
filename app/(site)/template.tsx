import type { ReactNode } from "react";
import styles from "./template.module.css";

/** A template remounts on every navigation, which gives each page a soft fade-in. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
