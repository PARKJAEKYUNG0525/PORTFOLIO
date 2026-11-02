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
      // 애플 제품 페이지처럼: 크게 올라오며 길고 부드럽게 감속 (expo.out)
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const heading = /^H[1-3]$/.test(el.tagName);
        gsap.from(el, {
          y: heading ? 80 : 50,
          opacity: 0,
          duration: heading ? 1.6 : 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        gsap.from(group.children, {
          y: 60,
          opacity: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        });
      });
    }, root);
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [root]);
}
