/**
 * Hero 3D 오브젝트와 DOM(GSAP · 포인터) 사이에서 공유하는 가변 상태.
 * React state를 거치지 않아 매 프레임 리렌더 없이 useFrame에서 읽는다.
 */
export const orbitState = {
  /** Hero pin 스크롤 진행도 0 → 1 */
  progress: 0,
  /** 포인터 위치 -1 → 1 */
  px: 0,
  py: 0,
};

export type OrbitQuality = 'high' | 'low';

export interface OrbitLayout {
  /** 오브젝트(링 포함) 중심 — Hero 기준 px */
  cx: number;
  cy: number;
  /** 링을 포함한 지름 px */
  size: number;
}

/**
 * 3D 오브젝트와 정적 대체 이미지가 같은 위치·크기에 오도록 하는 단일 레이아웃 규칙.
 * 데스크톱: 오른쪽에 걸쳐 크게 / 모바일: 오른쪽 위로 비켜서 작게.
 */
export function orbitLayout(w: number, h: number): OrbitLayout {
  if (w <= 720) {
    const size = Math.min(w * 1.05, 520);
    return { cx: w * 0.9, cy: Math.max(140, h * 0.2), size };
  }
  const size = Math.min(w * 0.78, 820, h * 1.05);
  const overhang = Math.min(260, Math.max(40, w * 0.1));
  return { cx: w + overhang - size / 2, cy: h * 0.5 - size * 0.02, size };
}

export function detectQuality(): OrbitQuality {
  if (typeof window === 'undefined') return 'high';
  const small = window.matchMedia('(max-width: 720px), (pointer: coarse)').matches;
  const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
  return small || weak ? 'low' : 'high';
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
