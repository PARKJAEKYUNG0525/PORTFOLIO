import { memo, useMemo } from 'react';
import styles from './Orbit.module.css';

const RINGS = [
  { size: 98, dur: 120, rev: false, dot: 6, tilt: 20 },
  { size: 78, dur: 80, rev: true, dot: 10, tilt: 140 },
  { size: 60, dur: 55, rev: false, dot: 5, tilt: 260 },
];

/** 히어로 궤도 비주얼 — CSS만으로 회전 */
export const Orbit = memo(function Orbit() {
  return (
    <div className={styles.orbit}>
      {RINGS.map((r) => (
        <div
          key={r.size}
          className={`${styles.ring}${r.rev ? ` ${styles.rev}` : ''}`}
          style={{
            width: `${r.size}%`,
            height: `${r.size}%`,
            marginLeft: `${-r.size / 2}%`,
            marginTop: `${-r.size / 2}%`,
            animationDuration: `${r.dur}s`,
            rotate: `${r.tilt}deg`,
          }}
        >
          <span className={styles.moon} style={{ left: -r.dot / 2, width: r.dot, height: r.dot, marginTop: -r.dot / 2 }} />
        </div>
      ))}
      <div className={styles.planet} />
    </div>
  );
});

/** 고정 시드 별 배경 (렌더마다 위치 동일) */
export const Stars = memo(function Stars({ count = 70 }: { count?: number }) {
  const stars = useMemo(() => {
    let s = 7;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    return Array.from({ length: count }, (_, i) => ({
      i,
      left: rnd() * 100,
      top: rnd() * 100,
      w: rnd() > 0.85 ? 2 : 1,
      h: rnd() > 0.85 ? 2 : 1,
      dur: 3 + rnd() * 5,
      delay: rnd() * 4,
    }));
  }, [count]);

  return (
    <>
      {stars.map((st) => (
        <span
          key={st.i}
          className={styles.star}
          style={{
            left: `${st.left}%`,
            top: `${st.top}%`,
            width: st.w,
            height: st.h,
            animationDuration: `${st.dur}s`,
            animationDelay: `${st.delay}s`,
          }}
        />
      ))}
    </>
  );
});
