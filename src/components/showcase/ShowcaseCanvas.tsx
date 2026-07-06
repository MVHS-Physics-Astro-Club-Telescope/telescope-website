"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Realistic truss-Dobsonian rendered from PBR primitives — brushed
 * aluminum poles, baltic-birch plywood boxes, a front-surface mirror,
 * anodized camera — lit by a studio lightformer environment.
 *
 * The camera flies a damped keyframe path driven directly by
 * window.scrollY inside useFrame: no per-frame React work, no
 * allocations, no layout reads (section bounds are cached on resize).
 */

/* ── Materials (shared, created once) ─────────────────────────────── */
const M = {
  wood: new THREE.MeshStandardMaterial({ color: "#bda379", roughness: 0.55, metalness: 0.02 }),
  woodDark: new THREE.MeshStandardMaterial({ color: "#7c5f3e", roughness: 0.6, metalness: 0.02 }),
  alu: new THREE.MeshStandardMaterial({ color: "#c9ced6", roughness: 0.28, metalness: 0.92 }),
  steel: new THREE.MeshStandardMaterial({ color: "#40474f", roughness: 0.45, metalness: 0.8 }),
  mirror: new THREE.MeshStandardMaterial({ color: "#e8eefc", roughness: 0.12, metalness: 0.95 }),
  flock: new THREE.MeshStandardMaterial({ color: "#0b0c10", roughness: 0.95, metalness: 0, side: THREE.DoubleSide }),
  cam: new THREE.MeshStandardMaterial({ color: "#7e2f2f", roughness: 0.35, metalness: 0.75 }),
  brass: new THREE.MeshStandardMaterial({ color: "#d9a85c", roughness: 0.35, metalness: 0.85 }),
};

/* ── Camera + choreography keyframes ──────────────────────────────── */
type Key = { p: number; pos: [number, number, number]; look: [number, number, number] };

// Beat i (of 6, each 100svh over a 500svh span) centers at p ≈ (i+0.5)/5
const CAM_KEYS: Key[] = [
  { p: 0.0, pos: [1.9, 1.15, 2.6], look: [0, 0.62, 0] }, // meet it
  { p: 0.12, pos: [1.55, 1.0, 2.45], look: [0, 0.62, 0] }, // hold wide
  { p: 0.24, pos: [-0.48, 0.66, 1.55], look: [0, 0.28, 0.3] }, // the glass, presented
  { p: 0.36, pos: [-0.56, 0.58, 1.45], look: [0, 0.24, 0.3] },
  { p: 0.5, pos: [-1.85, 1.05, 1.25], look: [0, 0.7, 0] }, // revolve
  { p: 0.64, pos: [0.74, 1.4, 0.85], look: [0.24, 1.26, 0] }, // the camera
  { p: 0.76, pos: [0.6, 1.3, 0.98], look: [0.2, 1.24, 0] },
  { p: 0.85, pos: [0.05, 0.68, 3.35], look: [0, 0.58, 0] }, // exploded
  { p: 0.95, pos: [0.4, 0.78, 3.2], look: [0, 0.58, 0] },
  { p: 1.0, pos: [1.5, 1.1, 2.75], look: [0, 0.66, 0] }, // finale
];

// scalar keyframe tracks: [p, value]
const EXPLODE_KEYS: [number, number][] = [[0.78, 0], [0.87, 1], [0.94, 1], [1, 0]];
// The primary presents itself during the glass beat
const PEEK_KEYS: [number, number][] = [[0.16, 0], [0.26, 1], [0.36, 1], [0.44, 0]];
const AZIMUTH_KEYS: [number, number][] = [[0.42, 0], [0.5, 0.6], [0.58, 0.1], [0.64, 0]];
const ELEV_KEYS: [number, number][] = [[0.42, 0], [0.48, -0.24], [0.55, -0.1], [0.6, 0]];

const smooth = (t: number) => t * t * (3 - 2 * t);

function sampleScalar(keys: [number, number][], p: number): number {
  if (p <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (p >= last[0]) return last[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [pa, va] = keys[i];
    const [pb, vb] = keys[i + 1];
    if (p >= pa && p <= pb) {
      const t = smooth((p - pa) / (pb - pa));
      return va + (vb - va) * t;
    }
  }
  return last[1];
}

// Preallocated temps — never allocate in the frame loop
const tPosA = new THREE.Vector3();
const tPosB = new THREE.Vector3();
const tPos = new THREE.Vector3();
const tLookA = new THREE.Vector3();
const tLookB = new THREE.Vector3();
const tLook = new THREE.Vector3();

function sampleCamera(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  let a = CAM_KEYS[0];
  let b = CAM_KEYS[CAM_KEYS.length - 1];
  if (p <= a.p) {
    outPos.set(...a.pos);
    outLook.set(...a.look);
    return;
  }
  if (p >= b.p) {
    outPos.set(...b.pos);
    outLook.set(...b.look);
    return;
  }
  for (let i = 0; i < CAM_KEYS.length - 1; i++) {
    if (p >= CAM_KEYS[i].p && p <= CAM_KEYS[i + 1].p) {
      a = CAM_KEYS[i];
      b = CAM_KEYS[i + 1];
      break;
    }
  }
  const t = smooth((p - a.p) / (b.p - a.p));
  tPosA.set(...a.pos);
  tPosB.set(...b.pos);
  outPos.lerpVectors(tPosA, tPosB, t);
  tLookA.set(...a.look);
  tLookB.set(...b.look);
  outLook.lerpVectors(tLookA, tLookB, t);
}

/* ── Model pieces ─────────────────────────────────────────────────── */

function Pole({
  from,
  to,
  radius = 0.011,
  material = M.alu,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  material?: THREE.Material;
}) {
  const { pos, quat, len } = useMemo(() => {
    const f = new THREE.Vector3(...from);
    const t = new THREE.Vector3(...to);
    const dir = t.clone().sub(f);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize()
    );
    return { pos: f.add(t).multiplyScalar(0.5), quat, len };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <mesh position={pos} quaternion={quat} material={material}>
      <cylinderGeometry args={[radius, radius, len, 10]} />
    </mesh>
  );
}

/** Upper tube assembly: rings, struts, spider, secondary, focuser, camera. */
function Cage() {
  return (
    <group>
      {[0.5, 0.82].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.wood}>
          <torusGeometry args={[0.17, 0.014, 12, 40]} />
        </mesh>
      ))}
      {/* Inner light shroud */}
      <mesh position={[0, 0.66, 0]} material={M.flock}>
        <cylinderGeometry args={[0.162, 0.162, 0.3, 28, 1, true]} />
      </mesh>
      {/* Ring struts */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.5;
        return (
          <Pole
            key={i}
            from={[Math.cos(a) * 0.17, 0.5, Math.sin(a) * 0.17]}
            to={[Math.cos(a) * 0.17, 0.82, Math.sin(a) * 0.17]}
            radius={0.007}
          />
        );
      })}
      {/* Spider vanes */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.08, 0.74, Math.sin(a) * 0.08]}
            rotation={[0, -a, 0]}
            material={M.steel}
          >
            <boxGeometry args={[0.16, 0.045, 0.0022]} />
          </mesh>
        );
      })}
      {/* Secondary mirror at 45° */}
      <group position={[0, 0.74, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh material={M.mirror}>
          <cylinderGeometry args={[0.036, 0.036, 0.014, 24]} />
        </mesh>
        <mesh position={[0, -0.012, 0]} material={M.steel}>
          <cylinderGeometry args={[0.03, 0.024, 0.02, 16]} />
        </mesh>
      </group>
      {/* Focuser, radial on +x */}
      <group position={[0.19, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh material={M.alu}>
          <cylinderGeometry args={[0.03, 0.033, 0.09, 20]} />
        </mesh>
        <mesh position={[0, 0.05, 0]} material={M.brass}>
          <cylinderGeometry args={[0.031, 0.031, 0.012, 20]} />
        </mesh>
      </group>
      {/* ATR585C camera body */}
      <group position={[0.285, 0.72, 0]}>
        <mesh material={M.cam}>
          <cylinderGeometry args={[0.042, 0.042, 0.085, 24]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.048, 0, 0]} material={M.steel}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 14]} />
        </mesh>
      </group>
    </group>
  );
}

function Truss() {
  const corners: [number, number][] = [
    [0.145, 0.145],
    [0.145, -0.145],
    [-0.145, -0.145],
    [-0.145, 0.145],
  ];
  const ringPts: [number, number][] = [
    [0.12, 0.12],
    [0.12, -0.12],
    [-0.12, -0.12],
    [-0.12, 0.12],
  ];
  return (
    <group>
      {corners.map(([x, z], i) => (
        <group key={i}>
          <Pole from={[x, 0.02, z]} to={[ringPts[i][0], 0.5, ringPts[i][1]]} />
          <Pole from={[x, 0.02, z]} to={[ringPts[(i + 1) % 4][0], 0.5, ringPts[(i + 1) % 4][1]]} />
        </group>
      ))}
    </group>
  );
}

function MirrorBox() {
  return (
    <group>
      <mesh position={[0, -0.14, 0]} material={M.wood}>
        <boxGeometry args={[0.38, 0.34, 0.38]} />
      </mesh>
      {/* Open top reads dark */}
      <mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.flock}>
        <planeGeometry args={[0.345, 0.345]} />
      </mesh>
      {/* Altitude bearings */}
      {[-0.2, 0.2].map((x) => (
        <group key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={M.woodDark}>
            <cylinderGeometry args={[0.21, 0.21, 0.022, 36]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={M.brass}>
            <torusGeometry args={[0.21, 0.005, 8, 48]} />
          </mesh>
        </group>
      ))}
      {/* Side electronics: Pi + power box */}
      <mesh position={[0, -0.1, 0.196]} material={M.steel}>
        <boxGeometry args={[0.12, 0.08, 0.02]} />
      </mesh>
      <mesh position={[0.11, -0.22, 0.196]} material={M.cam}>
        <boxGeometry args={[0.07, 0.05, 0.018]} />
      </mesh>
    </group>
  );
}

/** Primary mirror + cell — slides out during the exploded view. */
function Primary() {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh material={M.mirror}>
        <cylinderGeometry args={[0.127, 0.127, 0.03, 48]} />
      </mesh>
      <mesh position={[0, -0.028, 0]} material={M.alu}>
        <cylinderGeometry args={[0.135, 0.135, 0.016, 48]} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.09, -0.048, Math.sin(a) * 0.09]}
            material={M.brass}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.024, 12]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Rocker() {
  return (
    <group>
      {[-0.215, 0.215].map((x) => (
        <mesh key={x} position={[x, 0.33, 0]} material={M.wood}>
          <boxGeometry args={[0.032, 0.38, 0.42]} />
        </mesh>
      ))}
      <mesh position={[0, 0.17, 0.2]} material={M.wood}>
        <boxGeometry args={[0.4, 0.1, 0.03]} />
      </mesh>
      <mesh position={[0, 0.135, 0]} material={M.woodDark}>
        <boxGeometry args={[0.43, 0.028, 0.44]} />
      </mesh>
      <mesh position={[0, 0.095, 0]} material={M.woodDark}>
        <cylinderGeometry args={[0.26, 0.26, 0.032, 40]} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.4;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.21, 0.062, Math.sin(a) * 0.21]}
            material={M.steel}
          >
            <cylinderGeometry args={[0.02, 0.024, 0.035, 12]} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Scene with scroll-driven choreography ────────────────────────── */

function Scene({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const camera = useThree((s) => s.camera);
  const telescope = useRef<THREE.Group>(null);
  const ota = useRef<THREE.Group>(null);
  const cage = useRef<THREE.Group>(null);
  const truss = useRef<THREE.Group>(null);
  const primary = useRef<THREE.Group>(null);
  const rocker = useRef<THREE.Group>(null);

  const bounds = useRef({ top: 0, span: 1 });
  const pDamped = useRef(0);

  useEffect(() => {
    const measure = () => {
      const el = sectionRef.current;
      if (!el) return;
      bounds.current = {
        top: el.getBoundingClientRect().top + window.scrollY,
        span: Math.max(1, el.offsetHeight - window.innerHeight),
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [sectionRef]);

  useFrame((state, delta) => {
    const raw = Math.min(
      1,
      Math.max(0, (window.scrollY - bounds.current.top) / bounds.current.span)
    );
    // One damped progress value smooths every downstream track
    pDamped.current = THREE.MathUtils.damp(pDamped.current, raw, 6, delta);
    const p = pDamped.current;

    sampleCamera(p, tPos, tLook);
    camera.position.copy(tPos);
    camera.lookAt(tLook);

    const e = sampleScalar(EXPLODE_KEYS, p);
    const peek = sampleScalar(PEEK_KEYS, p);
    if (cage.current) cage.current.position.y = e * 0.42;
    if (truss.current) truss.current.position.y = e * 0.15;
    if (primary.current) {
      // Exploded: drops below the mirror box. Peek: slides forward and
      // tilts its face to the camera to show the glass.
      primary.current.position.y = -e * 0.45 - peek * 0.12;
      primary.current.position.z = peek * 0.46;
      primary.current.rotation.x = peek * 0.55;
    }
    if (rocker.current) rocker.current.position.y = -e * 0.85;

    if (ota.current) ota.current.rotation.x = sampleScalar(ELEV_KEYS, p);
    if (telescope.current) {
      telescope.current.rotation.y =
        sampleScalar(AZIMUTH_KEYS, p) + Math.sin(state.clock.elapsedTime * 0.18) * 0.02;
    }
  });

  return (
    <>
      <group ref={telescope}>
        <group ref={ota} position={[0, 0.55, 0]}>
          <group ref={cage}>
            <Cage />
          </group>
          <group ref={truss}>
            <Truss />
          </group>
          <MirrorBox />
          <group ref={primary}>
            <Primary />
          </group>
        </group>
        <group ref={rocker}>
          <Rocker />
        </group>
      </group>

      <ambientLight intensity={0.1} />
      <directionalLight position={[3, 4, 2]} intensity={0.4} />
      <directionalLight position={[-2.5, 1.2, -1]} intensity={0.2} color="#aebfe0" />
      <Environment resolution={128} frames={1}>
        {/* Big soft boxes so mirror surfaces have something to reflect */}
        <Lightformer intensity={1.1} position={[0, 2, 7]} scale={[14, 9, 1]} color="#7d8cb0" />
        <Lightformer intensity={0.8} position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} color="#2c3552" />
        <Lightformer intensity={5} position={[0, 3, 2]} scale={[7, 3, 1]} color="#e6edff" />
        <Lightformer intensity={3.5} position={[-4, 1.5, -2]} scale={[4, 2.5, 1]} color="#aebfe0" />
        <Lightformer intensity={3} position={[4, 0.6, -3]} scale={[3, 3, 1]} color="#f0c880" />
        <Lightformer intensity={1.4} position={[0, -2, 3]} scale={[6, 2, 1]} color="#39456b" />
      </Environment>
    </>
  );
}

export default function ShowcaseCanvas({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 38, position: [1.9, 1.15, 2.5], near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      fallback={null}
      className="!absolute !inset-0"
    >
      <Scene sectionRef={sectionRef} />
    </Canvas>
  );
}
