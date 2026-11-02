import { memo, useMemo } from 'react';
import styles from './Orbit.module.css';

/** 고정 시드 별 배경 (렌더마다 위치 동일). 3D 오브젝트는 OrbitScene.tsx */
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
