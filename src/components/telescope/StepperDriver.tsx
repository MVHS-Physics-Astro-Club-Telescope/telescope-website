"use client";

import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Materials } from "./materials";

type V3 = [number, number, number];

function setupLabel(t: THREE.Texture | THREE.Texture[]) {
  const tex = Array.isArray(t) ? t[0] : t;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
}

/**
 * DM542T digital stepper drive (118 × 75.5 × 33 mm): black extruded body,
 * printed settings label, two green screw-terminal blocks, an 8-way DIP
 * switch and two status LEDs on the connector edge. Mounted upright on a
 * wall with its back at `position` and its face toward −z.
 */
export default function StepperDriver({ m, position, alarm = false }: { m: Materials; position: V3; alarm?: boolean }) {
  const label = useTexture("/textures/dm542_label.jpg", setupLabel);
  const W = 0.0755, H = 0.118, D = 0.033, GAP = 0.002;
  const [x, y, zBack] = position;
  const zc = zBack - GAP - D / 2;
  const zFront = zBack - GAP - D;
  const bodyGeo = useMemo(() => new RoundedBoxGeometry(W, H, D, 3, 0.0015), [W, H, D]);
  const mats = useMemo(() => {
    return {
      label: new THREE.MeshStandardMaterial({ map: label, color: "#cfcfca", roughness: 0.78, metalness: 0 }),
      green: new THREE.MeshStandardMaterial({ color: "#2e8a3e", roughness: 0.55 }),
      dip: new THREE.MeshStandardMaterial({ color: "#9b1f28", roughness: 0.5 }),
      toggle: new THREE.MeshStandardMaterial({ color: "#f2f0e8", roughness: 0.6 }),
      pwr: new THREE.MeshStandardMaterial({ color: "#0c2a12", emissive: "#3cff6a", emissiveIntensity: 2.4 }),
      alm: new THREE.MeshStandardMaterial({ color: "#2a0c0c", emissive: "#ff2a1a", emissiveIntensity: alarm ? 2.4 : 0 }),
    };
  }, [label, alarm]);
  const faceX = x - W / 2; // connector edge, toward the Pi
  const blocks = [y + 0.03, y - 0.03];
  return (
    <group>
      <mesh geometry={bodyGeo} position={[x, y, zc]} material={m.anodized} castShadow receiveShadow />
      {/* label runs along the long axis, so it reads sideways on the wall */}
      <mesh position={[x, y, zFront - 0.0002]} rotation={[0, Math.PI, Math.PI / 2]} material={mats.label}>
        <planeGeometry args={[0.094, 0.058]} />
      </mesh>
      {/* cooling grooves on the outer edge */}
      {[-0.045, -0.03, -0.015, 0, 0.015, 0.03, 0.045].map((dy) => (
        <mesh key={dy} position={[x + W / 2 - 0.0005, y + dy, zc]} material={m.blackMatte}>
          <boxGeometry args={[0.0012, 0.004, D - 0.006]} />
        </mesh>
      ))}
      {/* screw-terminal blocks */}
      {blocks.map((by, i) => (
        <group key={i}>
          <mesh position={[faceX - 0.004, by, zc]} material={mats.green} castShadow>
            <boxGeometry args={[0.008, 0.0305, 0.0105]} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <group key={k}>
              {/* clamp screw on the face, wire entry on the outer edge */}
              <mesh position={[faceX - 0.004, by - 0.0127 + k * 0.00508, zc - 0.0053]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}>
                <cylinderGeometry args={[0.0013, 0.0013, 0.0006, 12]} />
              </mesh>
              <mesh position={[faceX - 0.0081, by - 0.0127 + k * 0.00508, zc + 0.001]} material={m.blackMatte}>
                <boxGeometry args={[0.0004, 0.0028, 0.0028]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* DIP switch */}
      <mesh position={[faceX - 0.002, y, zc]} material={mats.dip}>
        <boxGeometry args={[0.004, 0.02, 0.0065]} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <mesh key={k} position={[faceX - 0.0042, y - 0.0089 + k * 0.00254, zc + (k % 3 === 0 ? 0.0015 : -0.0015)]} material={mats.toggle}>
          <boxGeometry args={[0.0006, 0.0014, 0.0022]} />
        </mesh>
      ))}
      {/* PWR and ALM */}
      <mesh position={[faceX - 0.0006, y + 0.052, zc + 0.004]} material={mats.pwr}>
        <boxGeometry args={[0.0012, 0.002, 0.002]} />
      </mesh>
      <mesh position={[faceX - 0.0006, y + 0.052, zc - 0.004]} material={mats.alm}>
        <boxGeometry args={[0.0012, 0.002, 0.002]} />
      </mesh>
    </group>
  );
}
