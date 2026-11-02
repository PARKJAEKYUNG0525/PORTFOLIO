import type { Project } from '../../data/projects';
import styles from './ProjectCard.module.css';

interface Props {
  project: Project;
  index: number;
  onClick: () => void;
}

/** Work 섹션의 프로젝트 인덱스 행 (모바일에서는 캐러셀 카드) */
export default function ProjectCard({ project: p, index, onClick }: Props) {
  return (
    <button type="button" className={styles.card} onClick={onClick} aria-label={`${p.name} 프로젝트 상세 보기`}>
      <span className={styles.hoverBg} aria-hidden="true" />
      <span className={styles.no}>{String(index + 1).padStart(2, '0')}</span>
      <span className={styles.title}>
        <span className={styles.name}>{p.name}</span>
        <span className={styles.kind}>
          {p.kind} · {p.role}
        </span>
      </span>
      <span className={styles.metricWrap}>
        <span className={styles.metric}>{p.metric}</span>
        <span className={styles.metricLabel}>{p.metricLabel}</span>
      </span>
      <span className={styles.tags}>
        {p.tags.slice(0, 6).map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </span>
      <span className={styles.end}>
        {p.period}
        <span className={styles.arrow} aria-hidden="true">→</span>
      </span>
    </button>
  );
}
