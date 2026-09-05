"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { createMaterials, familyOf } from "./materials";
import { SCENE_FLOOR_Y, heroSpin, sampleCamera } from "./choreography";

const MODEL_URL = "/models/telescope.glb";
const UP = new THREE.Vector3(0, 1, 0);

function Telescope({ progress, spin }: { progress: RefObject<number>; spin: boolean }) {
  const { scene } = useGLTF(MODEL_URL, "/draco/");
  const [birch, birchRough] = useTexture(["/textures/birch.jpg", "/textures/birch-rough.jpg"]);
  const materials = useMemo(() => createMaterials(birch, birchRough), [birch, birchRough]);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const fam = familyOf(o.name);
      if (fam) o.material = materials[fam];
      o.castShadow = true;
      o.receiveShadow = true;
    });
  }, [scene, materials]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = spin ? heroSpin(progress.current ?? 0, clock.elapsedTime) : 0;
  });

  return (
    <group ref={group}>
      {/* Z-up metres → Y-up */}
      <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

function Rig({ progress, animate }: { progress: RefObject<number>; animate: boolean }) {
  const { camera, size } = useThree();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const curLook = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const first = useRef(true);

  useFrame((_, dt) => {
    const p = animate ? (progress.current ?? 0) : 0;
    const shift = sampleCamera(p, pos, look);
    const aspect = size.width / size.height;
    // Portrait viewports need more distance to keep the instrument in frame,
    // and the copy sits below the model there rather than beside it.
    if (aspect < 1.1) {
      const k = Math.pow(1.1 / aspect, 0.62);
      pos.sub(look).multiplyScalar(k).add(look);
      // copy sits below the model on phones: aim lower so the subject rides high
      look.setY(look.y - 0.22);
      pos.setY(pos.y - 0.22);
    } else {
      // slide camera + target along the camera's right axis
      right.subVectors(look, pos).cross(UP).normalize().multiplyScalar(shift);
      pos.add(right);
      look.add(right);
    }
    if (first.current) {
      camera.position.copy(pos);
      curLook.copy(look);
      first.current = false;
    } else {
      const l = 1 - Math.exp(-dt * 7);
      camera.position.lerp(pos, l);
      curLook.lerp(look, l);
    }
    camera.lookAt(curLook);
  });
  return null;
}

export default function TelescopeCanvas({
  progress,
  animate,
}: {
  /** 0..1 through the story; read every frame, never re-renders React */
  progress: RefObject<number>;
  /** false under prefers-reduced-motion: hold the hero framing */
  animate: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 30, near: 0.05, far: 40, position: [1.7, 1, 2.35] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      shadows
      frameloop="always"
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Telescope progress={progress} spin={animate} />
        <Environment resolution={256} frames={1}>
          {/* warm key from the upper right */}
          <Lightformer form="rect" intensity={5} color="#ffedd2" position={[2.4, 3.2, 2.2]} scale={[2.6, 2.6, 1]} target={[0, 0.5, 0]} />
          {/* cool fill from the left */}
          <Lightformer form="rect" intensity={1.0} color="#d6e0ff" position={[-3.2, 1.6, -0.6]} scale={[4, 3, 1]} target={[0, 0.5, 0]} />
          {/* rim from behind */}
          <Lightformer form="rect" intensity={1.8} color="#ffffff" position={[0.6, 2.4, -3.4]} scale={[5, 2.2, 1]} target={[0, 0.6, 0]} />
          {/* floor and back wall so mirrors and chrome have something to reflect */}
          <Lightformer form="rect" intensity={0.5} color="#ffffff" position={[0, -3, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
          <Lightformer form="rect" intensity={0.35} color="#ffffff" position={[0, 1, -6]} scale={[10, 6, 1]} />
        </Environment>
        <spotLight
          position={[2.2, 3.4, 1.8]}
          angle={0.45}
          penumbra={0.9}
          intensity={34}
          color="#fff3e0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
          shadow-normalBias={0.01}
        />
        <ContactShadows position={[0, SCENE_FLOOR_Y - 0.002, 0]} opacity={0.75} scale={3} blur={2.2} far={1.2} resolution={512} frames={1} />
      </Suspense>
      <Rig progress={progress} animate={animate} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL, "/draco/");
