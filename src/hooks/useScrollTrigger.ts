import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './useLenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * 스크롤 진입 시 등장 애니메이션.
 * - `data-reveal`: 요소 하나가 아래에서 페이드 업
 * - `data-reveal-group`: 직계 자식들이 순차(stagger)로 등장
 */
export function useReveal(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        gsap.from(group.children, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });
    }, root);
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [root]);
}
