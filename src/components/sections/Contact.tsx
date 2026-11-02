import { CONTACTS, PROFILE } from '../../data/profile';
import { onAnchorClick } from '../../hooks/useLenis';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contact" className={`section ${styles.contact}`} aria-labelledby="contact-title">
      <div className={styles.top}>
        <div>
          <div className="eyebrow" data-reveal>
            <span>CONTACT</span>
            <span>04</span>
          </div>
          <h2 id="contact-title" className={`h-display ${styles.heading}`} data-reveal>
            다음에 만들 것을,
            <br />
            함께.
          </h2>
          <p className={`lead ${styles.sub}`} data-reveal>
            AI 서비스 개발 · 기술지원/솔루션 엔지니어 · SI/구축 포지션을 찾고 있습니다.
          </p>
        </div>
        <div className={styles.photoWrap} data-reveal>
          <img src="/assets/profile.jpg" alt={`${PROFILE.name} 프로필 사진`} className={styles.photo} />
        </div>
      </div>

      <div className={styles.grid} data-reveal-group>
        {CONTACTS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className={styles.item}
            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className={styles.itemLabel}>{c.label}</span>
            <span className={styles.value}>{c.value}</span>
          </a>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>© 2026 {PROFILE.nameEn} · 경기도 안양시</span>
        <a href="#top" onClick={onAnchorClick}>Back to top ↑</a>
      </footer>
    </section>
  );
}
