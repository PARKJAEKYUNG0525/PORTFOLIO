import { CERTS, JOURNEY } from '../../data/profile';
import styles from './Journey.module.css';

export default function Journey() {
  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="eyebrow" data-reveal>
        <span>EXPERIENCE · EDUCATION</span>
        <span>03</span>
      </div>
      <h2 id="journey-title" className="h-section" style={{ marginBottom: 0 }} data-reveal>My Background.</h2>

      <div className={styles.grid}>
        <div data-reveal-group>
          {JOURNEY.map((j) => (
            <div key={j.title} className={styles.item}>
              <span className={styles.period}>{j.period}</span>
              <div className={styles.info}>
                <span className={styles.type}>{j.type}</span>
                <span className={styles.title}>{j.title}</span>
                <span className={styles.desc}>{j.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.certCol}>
          <span className="eyebrow" data-reveal>CERTIFICATIONS</span>
          <div className={styles.certs} data-reveal-group>
            {CERTS.map((c) => (
              <div key={c.name} className={styles.cert}>
                <span className={styles.certName}>{c.name}</span>
                <span className={styles.certMeta}>
                  {c.date} · {c.org}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
