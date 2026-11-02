import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { orbitLayout, orbitState, type OrbitQuality } from './orbitState';

const FOV = 35;
const DIST = 10;
/** 링을 포함한 모델 반지름 (월드 단위) — 레이아웃 size/2와 대응 */
const OUTER = 2.3;

const RINGS = [
  { r: 1.6, tilt: [1.25, 0.15, 0.2], speed: 0.35, moon: 0.05 },
  { r: 1.95, tilt: [1.4, -0.35, 0.9], speed: -0.22, moon: 0.075 },
  { r: 2.25, tilt: [1.1, 0.45, -0.6], speed: 0.14, moon: 0.04 },
] as const;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function Planet({ quality, snapshot }: { quality: OrbitQuality; snapshot: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const rings = useRef<(THREE.Group | null)[]>([]);
  const sm = useRef({ p: 0, rx: 0, ry: 0 });
  const { size } = useThree();
  const low = quality === 'low';

  useFrame((_, dt) => {
    const W = size.width;
    const H = size.height;
    const L = snapshot ? { cx: W / 2, cy: H / 2, size: Math.min(W, H) } : orbitLayout(W, H);
    const worldH = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const upp = worldH / H; // 화면 1px당 월드 단위
    const s = sm.current;
    const d = Math.min(dt, 0.05);

    s.p = THREE.MathUtils.damp(s.p, snapshot ? 0 : orbitState.progress, 7, d);
    s.rx = THREE.MathUtils.damp(s.rx, snapshot ? 0 : orbitState.py * 0.22, 3.5, d);
    s.ry = THREE.MathUtils.damp(s.ry, snapshot ? 0 : orbitState.px * 0.32, 3.5, d);
    const e = smoothstep(Math.min(1, s.p * 1.15));

    // 스크롤: 오른쪽 → 화면 중앙으로 이동하며 확대
    const bx = (L.cx - W / 2) * upp;
    const by = -(L.cy - H / 2) * upp;
    const base = ((L.size / 2) * upp) / OUTER;
    const target = (Math.min(W, H) * 0.5 * upp) / OUTER;
    group.current.position.set(THREE.MathUtils.lerp(bx, 0, e), THREE.MathUtils.lerp(by, 0, e), e * 1.5);
    group.current.scale.setScalar(THREE.MathUtils.lerp(base, target * 1.9, e));
    // 마우스 기울기 + 스크롤 회전
    group.current.rotation.set(0.28 + s.rx + e * 0.7, s.ry + e * Math.PI * 0.85, -0.12 - e * 0.25);

    if (!snapshot) {
      spin.current.rotation.y += d * 0.12;
      rings.current.forEach((g, i) => g && (g.rotation.z += d * RINGS[i].speed));
    }
  });

  return (
    <group ref={group}>
      <group ref={spin}>
        {/* 유리 구체 */}
        <mesh>
          <sphereGeometry args={[1, low ? 48 : 96, low ? 48 : 96]} />
          <MeshTransmissionMaterial
            samples={low ? 3 : 8}
            resolution={low ? 256 : 768}
            backside={!low}
            backsideThickness={0.5}
            thickness={1.2}
            transmission={1}
            roughness={0.06}
            ior={1.32}
            chromaticAberration={low ? 0.03 : 0.07}
            anisotropy={0.15}
            distortion={0.18}
            distortionScale={0.35}
            temporalDistortion={snapshot ? 0 : 0.06}
            clearcoat={1}
            clearcoatRoughness={0.05}
            attenuationDistance={3}
            attenuationColor="#b9dcff"
            color="#eef6ff"
          />
        </mesh>
        {/* 내부 코어 — 유리를 통해 굴절되어 보임 */}
        <mesh>
          <sphereGeometry args={[0.62, low ? 32 : 64, low ? 32 : 64]} />
          <meshStandardMaterial color="#3b74b8" emissive="#2c6fd1" emissiveIntensity={0.55} roughness={0.35} metalness={0.1} />
        </mesh>
      </group>

      {RINGS.map((ring, i) => (
        <group key={ring.r} rotation={[...ring.tilt] as [number, number, number]}>
          <group ref={(el) => { rings.current[i] = el; }}>
            <mesh>
              <torusGeometry args={[ring.r, 0.006, 8, low ? 128 : 256]} />
              <meshBasicMaterial color="#cfe3ff" transparent opacity={0.32} />
            </mesh>
            <mesh position={[ring.r, 0, 0]}>
              <sphereGeometry args={[ring.moon, 24, 24]} />
              <meshStandardMaterial color="#ffffff" emissive="#9fd0ff" emissiveIntensity={1.6} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

interface Props {
  quality: OrbitQuality;
  active?: boolean;
  snapshot?: boolean;
  onReady?: () => void;
}

/** Hero 3D 오브젝트 — 유리 행성 + 궤도 링 */
export default function OrbitScene({ quality, active = true, snapshot = false, onReady }: Props) {
  const low = quality === 'low';
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={snapshot ? 2 : low ? [1, 1.5] : [1, 2]}
      camera={{ fov: FOV, position: [0, 0, DIST], near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: !low, powerPreference: 'high-performance', preserveDrawingBuffer: snapshot }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.setClearColor(0x000000, 0);
        // 첫 프레임이 그려진 뒤 정적 이미지와 교체
        requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
      }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[-4, 3, 4]} intensity={40} color="#6fb6ff" distance={20} />
      <pointLight position={[4, -2, 3]} intensity={18} color="#8ff0ff" distance={18} />
      <pointLight position={[0, 4, -4]} intensity={14} color="#b8a6ff" distance={18} />

      {/* 로컬 라이트포머로 만든 환경맵 — 외부 HDR 다운로드 없음 */}
      <Environment resolution={low ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, -3]} scale={[10, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.4} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#9cc8ff" />
        <Lightformer form="rect" intensity={1} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#7fe3ff" />
        <Lightformer form="ring" intensity={1.6} position={[2, 2, 4]} scale={1.6} color="#ffffff" />
      </Environment>

      <Planet quality={quality} snapshot={snapshot} />
    </Canvas>
  );
}
