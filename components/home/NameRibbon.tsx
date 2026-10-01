import styles from "./NameRibbon.module.css";

/**
 * A slow-moving band of destination names: a quiet change of pace between content sections.
 * Decorative (the same names appear as real links elsewhere), so it is hidden from assistive tech,
 * and it holds still for visitors who prefer reduced motion.
 */
export function NameRibbon({ names }: { names: string[] }) {
  return (
    <div className={styles.ribbon} aria-hidden="true">
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={styles.list} role="presentation">
            {names.map((name, i) => (
              <li key={`${copy}-${name}`} className={i % 2 === 0 ? styles.outline : styles.solid}>
                {name}
                <span className={styles.gem} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
