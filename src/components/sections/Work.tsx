import { useRef, useState } from 'react';
import { PROJECTS } from '../../data/projects';
import ProjectCard from '../ui/ProjectCard';
import styles from './Work.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export default function Work({ onOpen }: { onOpen: (i: number) => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // 모바일 캐러셀: 스크롤 위치로 현재 카드 계산
  const onScroll = () => {
    const el = listRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const step = card.offsetWidth + 12;
    setActive(Math.min(PROJECTS.length - 1, Math.round(el.scrollLeft / step)));
  };

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="eyebrow" data-reveal>
        <span>SELECTED WORK / 01</span>
        <span>01 — {pad(PROJECTS.length)}</span>
      </div>
      <h2 id="work-title" className="h-section" data-reveal>AI 프로젝트.</h2>
      <p className="lead" data-reveal>
        문제 정의부터 파이프라인 설계, 화면, 배포까지.
        <br />
        세 개의 팀 프로젝트에서 맡은 부분을 끝까지 책임졌습니다.
      </p>

      <div className={styles.list} ref={listRef} onScroll={onScroll} data-reveal-group>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.key} project={p} index={i} onClick={() => onOpen(i)} />
        ))}
      </div>

      <div className={styles.hint} aria-hidden="true">
        <span>SWIPE →</span>
        <span className={styles.dots}>
          {PROJECTS.map((p, i) => (
            <span key={p.key} className={`${styles.dot}${i === active ? ` ${styles.on}` : ''}`} />
          ))}
        </span>
      </div>
    </section>
  );
}
