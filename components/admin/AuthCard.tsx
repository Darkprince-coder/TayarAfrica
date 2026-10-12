import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./Admin.module.css";

/** The frame for sign-in, reset and set-password screens. */
export function AuthCard({ title, lead, children, foot }: { title: string; lead?: ReactNode; children: ReactNode; foot?: ReactNode }) {
  return (
    <main id="main" className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authBrand}>
          <Image src="/brand/logo-emblem.png" alt="" width={44} height={48} />
          <span>
            <strong>Tayari</strong> admin
          </span>
        </div>
        <h1 className={styles.authTitle}>{title}</h1>
        {lead && <p className={styles.authLead}>{lead}</p>}
        {children}
        {foot && <div className={styles.authFoot}>{foot}</div>}
      </div>
    </main>
  );
}
