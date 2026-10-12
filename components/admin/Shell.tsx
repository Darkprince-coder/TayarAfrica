import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/auth-actions";
import type { StaffUser } from "@/lib/admin/session";
import { AdminNav } from "./AdminNav";
import { SideDrawer } from "./SideDrawer";
import styles from "./Shell.module.css";

/** The admin frame: sidebar (a top bar with a slide-in menu on phones) and the page. */
export function Shell({ me, newCount, children }: { me: StaffUser; newCount: number; children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <SideDrawer newCount={newCount}>
        <Link href="/admin" className={`${styles.brand} ${styles.sideBrand}`}>
          <Image src="/brand/logo-emblem-light.png" alt="" width={30} height={32} />
          <span>
            <strong>Tayari</strong> admin
          </span>
        </Link>
        <AdminNav newCount={newCount} />
        <div className={styles.foot}>
          <span>Signed in as {me.fullName || me.email}</span>
          <Link href="/" target="_blank">
            View the website
          </Link>
          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </SideDrawer>
      <main id="main" className={styles.main}>
        <div className={styles.inner}>{children}</div>
      </main>
    </div>
  );
}

export function PageHead({ title, lead }: { title: string; lead?: ReactNode }) {
  return (
    <header className={styles.pageHead}>
      <h1 className={styles.pageTitle}>{title}</h1>
      {lead && <p className={styles.pageLead}>{lead}</p>}
    </header>
  );
}
