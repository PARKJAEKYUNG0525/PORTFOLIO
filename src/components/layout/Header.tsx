import { useEffect, useState } from 'react';
import { onAnchorClick } from '../../hooks/useLenis';
import styles from './Header.module.css';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#journey', label: 'Journey' },
];

export default function Header() {
  // 스크롤되면 반투명 배경을 깔아 본문과 겹쳐 보이지 않게 함
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ''}`}>
      <nav className={styles.nav} aria-label="주요 메뉴">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className={styles.link} onClick={onAnchorClick}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className="pill pill--sm" onClick={onAnchorClick}>
          Let’s talk
        </a>
      </nav>
    </header>
  );
}
