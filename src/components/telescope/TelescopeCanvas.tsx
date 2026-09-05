"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { createMaterials } from "./materials";
import { lidOpen, sampleCamera } from "./choreography";
import IdealTelescope from "./IdealTelescope";

const UP = new THREE.Vector3(0, 1, 0);
const LID_OPACITY = 0.55;

function Stage({ progress }: { progress: RefObject<number> }) {
  const [normalMap, roughnessMap] = useTexture(["/textures/brushed_nor.jpg", "/textures/brushed_rough.jpg"]);
  const m = useMemo(() => createMaterials({ normalMap, roughnessMap }), [normalMap, roughnessMap]);

  // The control-box lid dissolves as the camera closes on the electronics.
  const lid = useRef(m.lid);
  useEffect(() => {
    lid.current = m.lid;
  }, [m]);
  useFrame(() => {
    const open = lidOpen(progress.current ?? 0);
    lid.current.opacity = LID_OPACITY * (1 - open);
    lid.current.visible = open < 0.999;
  });

  return (
    <>
      <IdealTelescope m={m} />
      {/* studio floor: catches the spotlight pool and the shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0005, 0]} material={m.floor} receiveShadow>
        <circleGeometry args={[7, 128]} />
      </mesh>
    </>
  );
}

function Rig({ progress, reducedMotion }: { progress: RefObject<number>; reducedMotion: boolean }) {
  const { camera, size } = useThree();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const curLook = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const first = useRef(true);

  useFrame((_, dt) => {
    const p = progress.current ?? 0;
    const shift = sampleCamera(p, pos, look);
    const aspect = size.width / size.height;
    if (aspect < 1.1) {
      // phones: more distance, and aim lower so the subject rides above the copy
      const k = Math.pow(1.1 / aspect, 0.62);
      pos.sub(look).multiplyScalar(k).add(look);
      // no drop on close-ups (the processor shot) — the copy overlays the board there
      const drop = 0.22 * Math.min(1, Math.max(0, (pos.distanceTo(look) - 0.35) / 1.2));
      look.setY(look.y - drop);
      pos.setY(pos.y - drop);
    } else {
      right.subVectors(look, pos).cross(UP).normalize().multiplyScalar(shift);
      pos.add(right);
      look.add(right);
    }
    if (first.current) {
      camera.position.copy(pos);
      curLook.copy(look);
      first.current = false;
    } else {
      // scroll-linked, so the camera always follows; reduced motion drops the easing so it tracks 1:1
      const l = reducedMotion ? 1 : 1 - Math.exp(-dt * 7);
      camera.position.lerp(pos, l);
      curLook.lerp(look, l);
    }
    camera.lookAt(curLook);
  });
  return null;
}

function Lights() {
  const target = useMemo(() => {
    const t = new THREE.Object3D();
    t.position.set(0, 0.55, 0);
    return t;
  }, []);
  return (
    <>
      <primitive object={target} />
      {/* the photo-shoot key: one warm spot from high front-right */}
      <spotLight
        position={[1.6, 4.6, 2.0]}
        angle={0.36}
        penumbra={0.75}
        decay={1.6}
        distance={12}
        intensity={140}
        color="#fff0d8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
        shadow-radius={6}
        target={target}
      />
      {/* cool rim from behind-left so edges separate from the dark */}
      <spotLight position={[-2.6, 3.2, -2.4]} angle={0.5} penumbra={0.9} decay={1.6} distance={12} intensity={45} color="#dbe4ff" target={target} />
      {/* faint fill so shadow sides read */}
      <spotLight position={[-3, 1.4, 2.2]} angle={0.7} penumbra={1} decay={1.6} distance={12} intensity={12} color="#ffffff" target={target} />
      {/* small lamp behind the rocker so the control box reads when the camera dives in */}
      <pointLight position={[0.1, 0.45, -0.7]} intensity={2.2} distance={1.6} decay={2} color="#ffffff" />
    </>
  );
}

export default function TelescopeCanvas({
  progress,
  reducedMotion,
}: {
  /** 0..1 through the story; read every frame, never re-renders React */
  progress: RefObject<number>;
  /** prefers-reduced-motion: the camera still follows the scroll, without easing */
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 30, near: 0.03, far: 40, position: [2, 1.4, 2.75] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}
      shadows="percentage"
      frameloop="always"
      style={{ position: "absolute", inset: 0 }}
    >
      <fog attach="fog" args={["#000000", 3.5, 9]} />
      <Suspense fallback={null}>
        <Stage progress={progress} />
        <Lights />
        {/* a real photo studio for reflections, kept dim so the key spot stays the light */}
        <Environment files="/hdr/studio.hdr" environmentIntensity={0.42} />
      </Suspense>
      <Rig progress={progress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
