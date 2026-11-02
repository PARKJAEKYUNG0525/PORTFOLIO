import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Work from './components/sections/Work';
import About from './components/sections/About';
import Journey from './components/sections/Journey';
import Contact from './components/sections/Contact';
import ProjectDetail from './components/ui/ProjectDetail';
import { PROJECTS } from './data/projects';
import { lockScroll, useLenis } from './hooks/useLenis';
import { useReveal } from './hooks/useScrollTrigger';

export default function App() {
  const [active, setActive] = useState(-1);
  const opener = useRef<HTMLElement | null>(null);
  const main = useRef<HTMLElement>(null);

  useLenis();
  useReveal(main);

  const open = useCallback((i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setActive(i);
  }, []);
  const close = useCallback(() => setActive(-1), []);
  const next = useCallback(() => setActive((i) => (i + 1) % PROJECTS.length), []);
  const prev = useCallback(() => setActive((i) => (i - 1 + PROJECTS.length) % PROJECTS.length), []);

  const isOpen = active >= 0;
  useEffect(() => {
    lockScroll(isOpen);
    if (!isOpen) {
      opener.current?.focus({ preventScroll: true });
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close, next, prev]);

  return (
    <>
      <a href="#main" className="skip-link">본문으로 건너뛰기</a>
      <Header />
      <main id="main" ref={main} tabIndex={-1} style={{ outline: 'none' }} inert={isOpen || undefined}>
        <Hero />
        <Work onOpen={open} />
        <About />
        <Journey />
        <Contact />
      </main>
      <AnimatePresence>
        {isOpen && <ProjectDetail key="detail" index={active} onClose={close} onNext={next} onPrev={prev} />}
      </AnimatePresence>
    </>
  );
}
