import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PROFILE } from '../../data/profile';
import { PROJECTS } from '../../data/projects';
import { onAnchorClick, prefersReducedMotion } from '../../hooks/useLenis';
import { Orbit, Stars } from '../ui/Orbit';
import styles from './Hero.module.css';

export default function Hero({ onOpen }: { onOpen: (i: number) => void }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const q = (k: keyof typeof styles) => `.${styles[k]}`;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(q('orbitIn'), { opacity: 0, scale: 0.86, duration: 1.8, ease: 'power2.out' }, 0)
        .from(`${q('eyebrow')} > span`, { y: 14, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.15)
        .from(`${q('line')} > span`, { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.25)
        .from([q('role'), q('intro'), q('cta')], { y: 22, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.65)
        .from(q('stripItem'), { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.95);

      // 스크롤 시 궤도가 뒤로 물러나고 본문이 흐려지는 패럴랙스
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(q('orbit'), { yPercent: 18, scale: 0.82, opacity: 0.35, ease: 'none', scrollTrigger: st });
      gsap.to(q('body'), { y: -60, opacity: 0.2, ease: 'none', scrollTrigger: { ...st } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className={styles.hero} aria-label="소개">
      <div className={styles.stars} aria-hidden="true">
        <Stars />
      </div>
      <div className={styles.orbit} aria-hidden="true">
        <div className={styles.orbitIn}>
          <Orbit />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.eyebrow}>
          <span>THE PORTFOLIO</span>
          <span className="accent">{PROFILE.role.toUpperCase()}</span>
        </div>
        <h1 className="h-display">
          <span className={styles.line}><span>Engineering</span></span>
          <span className={styles.line}><span>in Progress.</span></span>
        </h1>
        <p className={styles.role}>
          <strong>{PROFILE.name}</strong> — {PROFILE.tagline}
        </p>
        <p className={styles.intro}>{PROFILE.intro}</p>
        <div className={styles.cta}>
          <a href="#work" className="pill pill--solid" onClick={onAnchorClick}>프로젝트 보기</a>
          <a href="#contact" className="pill" onClick={onAnchorClick}>연락하기</a>
        </div>
      </div>

      <div className={styles.stripWrap}>
        <div className={styles.strip}>
          {PROJECTS.map((p, i) => (
            <button key={p.key} type="button" className={styles.stripItem} onClick={() => onOpen(i)}>
              <span className={styles.stripNo}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.stripName}>{p.name}</span>
              <span className={styles.stripKind}>{p.kind}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
