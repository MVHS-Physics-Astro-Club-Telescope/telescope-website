"use client";

import { Suspense, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerformanceMonitor, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { sampleCamera } from "./choreography";
import { DRACO_PATH, LIFT, MODEL_URL, decalFiles, dressModel } from "./model";

const UP = new THREE.Vector3(0, 1, 0);

function Telescope() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const files = useMemo(() => decalFiles(scene), [scene]);
  const [brushedNormal, brushedRough] = useTexture(["/textures/brushed_nor.jpg", "/textures/brushed_rough.jpg"], (ts) => {
    for (const t of [ts].flat()) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(3, 3); // one tile per 33 mm of part
      t.anisotropy = 8;
    }
  });
  const decalTextures = useTexture(
    files.map((f) => `/textures/decals/${f}`),
    (ts) => {
      for (const t of [ts].flat()) {
        // printed labels are sRGB images; glTF UVs count v from the top
        t.colorSpace = THREE.SRGBColorSpace;
        t.flipY = false;
        t.anisotropy = 8;
        t.needsUpdate = true;
      }
    },
  );
  const model = useMemo(() => {
    const decals = new Map(files.map((f, i) => [f, decalTextures[i]] as const));
    return dressModel(scene, { brushedNormal, brushedRough, decals });
  }, [scene, files, decalTextures, brushedNormal, brushedRough]);

  return (
    <>
      <primitive object={model} position={[0, LIFT, 0]} />
      {/* studio floor: catches the spotlight pool and the shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0005, 0]} receiveShadow>
        <circleGeometry args={[7, 128]} />
        <meshStandardMaterial color="#0e0e0e" roughness={0.94} metalness={0} />
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
    t.position.set(0.05, 0.65, 0);
    return t;
  }, []);
  return (
    <>
      <primitive object={target} />
      {/* the photo-shoot key: one warm spot from high front-right */}
      <spotLight
        position={[1.9, 4.6, 2.0]}
        angle={0.4}
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
  // The model is ~790k triangles; a device that can't hold the frame rate drops to 1x pixels.
  const [maxDpr, setMaxDpr] = useState(1.75);
  return (
    <Canvas
      dpr={[1, maxDpr]}
      camera={{ fov: 30, near: 0.03, far: 40, position: [3, 1.2, 1.2] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}
      shadows="percentage"
      frameloop="always"
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
      <fog attach="fog" args={["#000000", 4, 10]} />
      <Suspense fallback={null}>
        <Telescope />
        <Lights />
        {/* a real photo studio for reflections, kept dim so the key spot stays the light */}
        <Environment files="/hdr/studio.hdr" environmentIntensity={0.42} />
      </Suspense>
      <Rig progress={progress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL, DRACO_PATH);
