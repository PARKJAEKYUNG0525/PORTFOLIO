import { Stars } from './Orbit';
import styles from './SectionBg.module.css';

type Glow = 'tl' | 'tr' | 'bl' | 'br';

/** 섹션 배경 포인트 — 은은한 액센트 글로우 + 점 그리드 + 희미한 별 + 상단 라인 하이라이트 */
export default function SectionBg({ glow = 'tr', stars = 28 }: { glow?: Glow; stars?: number }) {
  return (
    <div className={styles.bg} data-glow={glow} aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.dots} />
      <div className={styles.stars}>
        <Stars count={stars} />
      </div>
      <span className={styles.line} />
    </div>
  );
}
