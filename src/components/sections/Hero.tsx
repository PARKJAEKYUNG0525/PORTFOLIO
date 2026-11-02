import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROFILE } from '../../data/profile';
import { PROJECTS } from '../../data/projects';
import { onAnchorClick, prefersReducedMotion } from '../../hooks/useLenis';
import { Stars } from '../ui/Orbit';
import { detectQuality, hasWebGL, orbitState, type OrbitQuality } from '../ui/orbitState';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

// three.js는 무거우므로 첫 화면 이후 별도 청크로 로드
const OrbitScene = lazy(() => import('../ui/OrbitScene'));


export default function Hero({ onOpen }: { onOpen: (i: number) => void }) {
  const root = useRef<HTMLElement>(null);
  const [use3D, setUse3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [quality, setQuality] = useState<OrbitQuality>('high');
  // 3D 사용 여부 결정: reduced-motion · WebGL 미지원이면 정적 이미지
  useEffect(() => {
    setQuality(detectQuality());
    setUse3D(!prefersReducedMotion() && hasWebGL());
  }, []);

  // 화면 밖이면 렌더 루프 정지 (pin이 끝난 뒤)
  useEffect(() => {
    const el = root.current;
    if (!el || !use3D) return;
    const io = new IntersectionObserver(([en]) => setActive(en.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, [use3D]);

  // 마우스 패럴랙스 (정밀 포인터에서만)
  useEffect(() => {
    if (!use3D || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      orbitState.px = (e.clientX / window.innerWidth) * 2 - 1;
      orbitState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [use3D]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const q = (k: string) => `.${styles[k]}`;
    const ctx = gsap.context(() => {
      // 첫 진입: 아래에서 페이드업
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(q('sceneIn'), { opacity: 0, scale: 0.9, duration: 2.2 }, 0)
        .from(`${q('eyebrow')} > span`, { y: 20, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.15)
        .from(`${q('line')} > span`, { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.25)
        .from([q('role'), q('intro'), q('cta')], { y: 32, opacity: 0, duration: 1.3, stagger: 0.1 }, 0.6)
        .from(q('stripItem'), { y: 20, opacity: 0, duration: 1, stagger: 0.08 }, 0.9);

      // Hero pin: 스크롤하면 텍스트가 빠지고 3D 오브젝트가 중앙으로 회전·확대되며 다음 섹션으로 전환
      const mobile = window.matchMedia('(max-width: 720px)').matches;
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: mobile ? '+=90%' : '+=130%',
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              orbitState.progress = self.progress;
            },
          },
        })
        .to(q('body'), { y: -90, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
        .to(q('stripWrap'), { y: 40, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
        .to(q('stars'), { scale: 1.2, opacity: 0.35, duration: 1 }, 0)
        .to(q('scene'), { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.7);
    }, root);
    return () => {
      ctx.revert();
      orbitState.progress = 0;
    };
  }, []);

  return (
    <section id="top" ref={root} className={styles.hero} aria-label="소개">
      <div className={styles.stars} aria-hidden="true">
        <Stars />
      </div>

      <div className={styles.scene} aria-hidden="true">
        <div className={styles.sceneIn}>
          {use3D && (
            <Suspense fallback={null}>
              <div className={styles.canvas} style={{ opacity: ready ? 1 : 0 }}>
                <OrbitScene quality={quality} active={active} onReady={() => setReady(true)} />
              </div>
            </Suspense>
          )}
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
