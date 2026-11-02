import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROFILE } from '../../data/profile';
import { onAnchorClick, prefersReducedMotion } from '../../hooks/useLenis';
import { Stars } from '../ui/Orbit';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const q = (k: string) => `.${styles[k]}`;
    const ctx = gsap.context(() => {
      // 첫 진입: 영상 페이드인 + 텍스트 순차 등장
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(q('videoBg'), { opacity: 0, scale: 1.06, duration: 2.5 }, 0)
        .from(`${q('eyebrow')} > span`, { y: 20, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.15)
        .from(`${q('line')} > span`, { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.25)
        .from([q('role'), q('intro'), q('cta')], { y: 32, opacity: 0, duration: 1.3, stagger: 0.1 }, 0.6)
        .from(q('scrollHint'), { y: 16, opacity: 0, duration: 1.2 }, 1.2);

      // pin 없이 자연스럽게 스크롤 — 살짝만 내려도 다음 섹션이 바로 보이게 (PC · 모바일 공통)
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
        })
        .to(q('scrollHint'), { opacity: 0, duration: 0.1 }, 0)
        .to(q('body'), { y: -60, opacity: 0.25, duration: 1 }, 0)
        .to(q('stars'), { scale: 1.1, opacity: 0.3, duration: 1 }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className={styles.hero} aria-label="소개">
      {/* Higgsfield 영상 배경 */}
      <div className={styles.videoBg} aria-hidden="true">
        <video
          className={styles.videoEl}
          src="/assets/hero-cpu-poweron.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.videoOverlay} />
      </div>

      <div className={styles.stars} aria-hidden="true">
        <Stars />
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

      <a href="#work" className={styles.scrollHint} onClick={onAnchorClick} aria-label="아래로 스크롤해 프로젝트 보기">
        <span className={styles.scrollLabel}>SCROLL</span>
        <span className={styles.scrollTrack} aria-hidden="true">
          <span className={styles.scrollDot} />
        </span>
      </a>
    </section>
  );
}
