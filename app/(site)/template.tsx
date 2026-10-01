import type { ReactNode } from "react";
import { PageCurtain } from "@/components/layout/PageCurtain";
import styles from "./template.module.css";

/** A template remounts on every navigation, which gives each page a soft fade-in. */
export default function Template({ children }: { children: ReactNode }) {
  return <>
      <PageCurtain />
      <div className={styles.page}>{children}</div>
    </>;
}
