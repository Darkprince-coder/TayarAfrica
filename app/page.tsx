import Image from "next/image";
import styles from "./page.module.css";

/** Temporary Phase 0 placeholder — replaced by the real homepage in Phase 3. */
export default function HomePage() {
  return (
    <main id="main" className={styles.main}>
      <div className={styles.inner}>
        <Image
          src="/brand/logo-full-light.png"
          alt="TAYARI Africa Tours"
          width={833}
          height={1016}
          className={styles.logo}
          priority
        />
        <h1 className={styles.title}>The journey is being prepared.</h1>
        <p className={styles.note}>Board prototype · foundation phase</p>
      </div>
    </main>
  );
}
