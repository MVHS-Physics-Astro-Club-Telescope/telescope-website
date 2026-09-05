"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { boxUV, type Materials } from "./materials";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

/**
 * Raspberry Pi 4 Model B, photo-textured. The PCB and every package top
 * are mapped straight onto a rectified photograph of a real board
 * (Wikimedia Commons, Laserlicht, CC BY-SA 4.0), so the silkscreen, traces,
 * pads and chip markings are the real ones; package heights come from the
 * Raspberry Pi 4 mechanical drawing. Local frame: PCB in the x–y plane
 * (x along the 85 mm edge, y up along the 56 mm edge, origin at the board
 * centre, component face at z = 0, components toward +z), metres.
 */

const BW = 85, BH = 56; // mm
const PCB_T = 0.0016;
const MM = 0.001;

/** [x0, y0, x1, y1] in photo millimetres (x right, y down from the top-left corner). */
type Rect = [number, number, number, number];
type Side = "metal" | "plastic" | "cream" | "lid";
type Part = { rect: Rect; h: number; side: Side; frame?: Rect };

const SOC: Rect = [22.1, 16.5, 36.9, 30.9];
const PARTS: Part[] = [
  { rect: [7.2, 1.2, 58.0, 6.3], h: 2.5, side: "plastic" }, // 40-pin header body
  { rect: [59.5, 7.3, 64.0, 12.4], h: 2.5, side: "plastic" }, // PoE header
  { rect: [6.8, 7.1, 17.6, 20.1], h: 1.6, side: "metal" }, // wireless can
  { rect: SOC, h: 1.0, side: "lid", frame: SOC }, // BCM2711 lid
  { rect: [23.6, 18.0, 35.4, 29.6], h: 1.5, side: "lid", frame: SOC }, // lid plateau
  { rect: [39.9, 16.3, 50.1, 31.6], h: 1.0, side: "plastic" }, // LPDDR4
  { rect: [55.6, 15.2, 61.9, 21.4], h: 1.0, side: "plastic" }, // VL805 USB controller
  { rect: [55.6, 28.2, 64.0, 36.1], h: 1.0, side: "plastic" }, // BCM54213 Ethernet PHY
  { rect: [67.2, 2.25, 87.5, 18.75], h: 13.5, side: "metal" }, // Ethernet jack
  { rect: [65.9, 19.5, 69.6, 26.3], h: 2.0, side: "plastic" },
  { rect: [71.1, 22.1, 86.6, 36.1], h: 15.6, side: "metal" }, // USB 3 stack
  { rect: [71.1, 41.9, 86.6, 55.9], h: 15.6, side: "metal" }, // USB 2 stack
  { rect: [6.6, 50.0, 15.2, 57.3], h: 3.2, side: "metal" }, // USB-C
  { rect: [22.7, 50.0, 29.6, 56.7], h: 3.0, side: "metal" }, // micro-HDMI 0
  { rect: [36.2, 50.0, 43.1, 56.7], h: 3.0, side: "metal" }, // micro-HDMI 1
  { rect: [50.7, 43.6, 57.6, 56.0], h: 6.0, side: "plastic" }, // audio jack body
  { rect: [45.4, 34.1, 48.1, 53.9], h: 5.5, side: "cream" }, // camera connector
  { rect: [2.7, 16.8, 5.2, 39.4], h: 5.5, side: "cream" }, // display connector
  { rect: [7.3, 41.6, 12.9, 47.0], h: 1.0, side: "plastic" }, // PMIC
  { rect: [12.9, 38.6, 17.1, 42.3], h: 1.5, side: "plastic" }, // inductor
  { rect: [18.4, 44.4, 21.7, 50.0], h: 1.0, side: "plastic" },
  { rect: [5.1, 40.4, 8.1, 42.5], h: 0.9, side: "plastic" },
  { rect: [60.4, 38.2, 63.1, 40.4], h: 0.8, side: "metal" }, // crystal
  { rect: [51.2, 35.7, 54.2, 37.6], h: 0.8, side: "plastic" },
  { rect: [50.7, 38.7, 52.9, 41.0], h: 0.8, side: "plastic" },
  { rect: [66.2, 45.5, 68.5, 47.8], h: 0.9, side: "plastic" },
  { rect: [67.4, 49.2, 69.6, 51.5], h: 0.9, side: "plastic" },
  { rect: [59.5, 41.9, 61.0, 44.4], h: 0.9, side: "plastic" },
];
const HEADER_PINS = { x0: 8.25, pitch: 2.54, n: 20, rows: [2.5, 5.05], len: 6.0, base: 2.5 };
const POE_PINS = { xs: [60.6, 63.1], ys: [8.8, 11.3] };
const HOLES: [number, number][] = [[3.5, 3.5], [61.5, 3.5], [3.5, 52.5], [61.5, 52.5]];
const HOLE_R = 1.35;
const LEDS = { pwr: [0.75, 47.4, 1.7, 48.5] as Rect, act: [0.75, 43.6, 1.7, 44.75] as Rect };
const AUDIO_BARREL = { x: 54.15, r: 3.0, from: 56.0, to: 58.6, z: 3.0 };

const toLocal = (x: number, y: number): [number, number] => [(x - BW / 2) * MM, (BH / 2 - y) * MM];

const TEXTURES = ["/textures/pi/pi_albedo.jpg", "/textures/pi/pi_orm.jpg", "/textures/pi/pi_normal.jpg", "/textures/pi/pi_soc.jpg"];
// start these downloads alongside the studio maps rather than after them
useTexture.preload(TEXTURES);
/** Runs before the textures are uploaded: colour maps are sRGB, data maps are linear. */
function setupTextures(textures: THREE.Texture | THREE.Texture[]) {
  const list = Array.isArray(textures) ? textures : [textures];
  list.forEach((t, i) => {
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.anisotropy = 8;
    if (i === 0 || i === 3) t.colorSpace = THREE.SRGBColorSpace;
  });
}

/**
 * Map every +z-facing vertex onto the photo by position. `cx, cy` is the
 * geometry's origin in local metres; `frame` is the photo rectangle (mm)
 * the texture covers.
 */
function photoUV(geo: THREE.BufferGeometry, cx: number, cy: number, frame: Rect = [0, 0, BW, BH]) {
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  let uv = geo.attributes.uv as THREE.BufferAttribute | undefined;
  if (!uv) {
    uv = new THREE.BufferAttribute(new Float32Array(pos.count * 2), 2);
    geo.setAttribute("uv", uv);
  }
  const [fx0, fy0, fx1, fy1] = frame;
  for (let i = 0; i < pos.count; i++) {
    if (nor.getZ(i) < 0.5) continue;
    const ix = BW / 2 + (cx + pos.getX(i)) / MM;
    const iy = BH / 2 - (cy + pos.getY(i)) / MM;
    const u = Math.min(1, Math.max(0, (ix - fx0) / (fx1 - fx0)));
    const v = 1 - Math.min(1, Math.max(0, (iy - fy0) / (fy1 - fy0)));
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
  return geo;
}

function usePcbGeometry() {
  return useMemo(() => {
    const w = BW * MM, h = BH * MM, r = 3 * MM;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
    s.lineTo(w / 2, h / 2 - r);
    s.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2, false);
    s.lineTo(-w / 2 + r, h / 2);
    s.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(-w / 2, -h / 2 + r);
    s.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, 1.5 * Math.PI, false);
    for (const [hx, hy] of HOLES) {
      const [lx, ly] = toLocal(hx, hy);
      const hole = new THREE.Path();
      hole.absarc(lx, ly, HOLE_R * MM, 0, Math.PI * 2, true);
      s.holes.push(hole);
    }
    const geo = new THREE.ExtrudeGeometry(s, { depth: PCB_T, bevelEnabled: false, curveSegments: 24 });
    geo.translate(0, 0, -PCB_T);
    return photoUV(geo, 0, 0);
  }, []);
}

function PhotoBox({ rect, h, top, side, frame }: { rect: Rect; h: number; top: THREE.Material; side: THREE.Material; frame?: Rect }) {
  const [x0, y0, x1, y1] = rect;
  const w = (x1 - x0) * MM, d = (y1 - y0) * MM, t = h * MM;
  const [cx, cy] = toLocal((x0 + x1) / 2, (y0 + y1) / 2);
  // sides carry the brushed grain at a fine repeat; the top is the photograph
  const geo = useMemo(() => photoUV(boxUV(new THREE.BoxGeometry(w, d, t), 60), cx, cy, frame), [w, d, t, cx, cy, frame]);
  const mats = useMemo(() => [side, side, side, side, top, side], [side, top]);
  return <mesh geometry={geo} material={mats} position={[cx, cy, t / 2]} castShadow receiveShadow />;
}

export default function PiBoard({ m }: { m: Materials }) {
  const [albedo, orm, normal, soc] = useTexture(TEXTURES, setupTextures);
  const mats = useMemo(() => {
    return {
      photo: new THREE.MeshPhysicalMaterial({
        map: albedo,
        roughnessMap: orm,
        metalnessMap: orm,
        metalness: 1,
        roughness: 1,
        normalMap: normal,
        normalScale: new THREE.Vector2(0.35, 0.35),
        envMapIntensity: 0.9,
      }),
      lidTop: new THREE.MeshPhysicalMaterial({ map: soc, metalness: 1, roughness: 0.42, envMapIntensity: 0.9 }),
      lid: new THREE.MeshPhysicalMaterial({ color: "#b0b3b7", metalness: 1, roughness: 0.42, normalMap: m.alu.normalMap, normalScale: new THREE.Vector2(0.2, 0.2) }),
      metal: new THREE.MeshPhysicalMaterial({ color: "#9ea2a7", metalness: 1, roughness: 0.44, normalMap: m.alu.normalMap, normalScale: new THREE.Vector2(0.35, 0.35) }),
      plastic: new THREE.MeshStandardMaterial({ color: "#131313", roughness: 0.55, metalness: 0.05 }),
      cream: new THREE.MeshStandardMaterial({ color: "#d9d2c0", roughness: 0.6 }),
      edge: new THREE.MeshStandardMaterial({ color: "#9aa06a", roughness: 0.8 }),
      pin: new THREE.MeshPhysicalMaterial({ color: "#c8a951", metalness: 1, roughness: 0.32 }),
      slot: new THREE.MeshStandardMaterial({ color: "#050505", roughness: 0.9 }),
      pwr: new THREE.MeshStandardMaterial({ color: "#3a0c0c", emissive: "#ff2a1a", emissiveIntensity: 3, roughness: 0.4 }),
    };
  }, [albedo, orm, normal, soc, m]);
  const pcb = usePcbGeometry();
  const sideOf = (s: Side) => (s === "metal" ? mats.metal : s === "plastic" ? mats.plastic : s === "cream" ? mats.cream : mats.lid);

  // the activity LED flickers like a board that is actually doing something (steady under reduced motion)
  const reduced = usePrefersReducedMotion();
  const act = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!act.current) return;
    const t = clock.elapsedTime;
    const on = reduced || Math.sin(t * 7.3) + Math.sin(t * 3.1) + Math.sin(t * 13.7) > 0.9;
    act.current.emissiveIntensity = on ? 2.6 : 0.15;
  });

  const pinGeo = useMemo(() => new THREE.BoxGeometry(0.64 * MM, 0.64 * MM, HEADER_PINS.len * MM), []);
  const pins = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < HEADER_PINS.n; i++) for (const y of HEADER_PINS.rows) out.push(toLocal(HEADER_PINS.x0 + i * HEADER_PINS.pitch, y));
    for (const x of POE_PINS.xs) for (const y of POE_PINS.ys) out.push(toLocal(x, y));
    return out;
  }, []);
  const pinZ = (HEADER_PINS.base + HEADER_PINS.len / 2) * MM;
  const ledAt = (r: Rect): [number, number, number] => {
    const [cx, cy] = toLocal((r[0] + r[2]) / 2, (r[1] + r[3]) / 2);
    return [cx, cy, 0.3 * MM];
  };
  const ledSize = (r: Rect): [number, number, number] => [(r[2] - r[0]) * MM, (r[3] - r[1]) * MM, 0.6 * MM];
  const [barrelX, barrelY] = toLocal(AUDIO_BARREL.x, (AUDIO_BARREL.from + AUDIO_BARREL.to) / 2);

  return (
    <group>
      <mesh geometry={pcb} material={[mats.photo, mats.edge]} castShadow receiveShadow />
      {PARTS.map((p, i) => (
        <PhotoBox key={i} rect={p.rect} h={p.h} top={p.frame ? mats.lidTop : mats.photo} side={sideOf(p.side)} frame={p.frame} />
      ))}
      {pins.map(([x, y], i) => (
        <mesh key={i} geometry={pinGeo} position={[x, y, pinZ]} material={mats.pin} castShadow />
      ))}
      <mesh position={ledAt(LEDS.pwr)} material={mats.pwr}>
        <boxGeometry args={ledSize(LEDS.pwr)} />
      </mesh>
      <mesh position={ledAt(LEDS.act)}>
        <boxGeometry args={ledSize(LEDS.act)} />
        <meshStandardMaterial ref={act} color="#0c2a12" emissive="#3cff6a" emissiveIntensity={0.15} roughness={0.4} />
      </mesh>
      {/* audio jack barrel past the board edge */}
      <mesh position={[barrelX, barrelY, AUDIO_BARREL.z * MM]} rotation={[Math.PI / 2, 0, 0]} material={mats.plastic} castShadow>
        <cylinderGeometry args={[AUDIO_BARREL.r * MM, AUDIO_BARREL.r * MM, (AUDIO_BARREL.to - AUDIO_BARREL.from) * MM, 24]} />
      </mesh>
      {/* port openings on the USB and Ethernet faces */}
      {[[22.1, 36.1], [41.9, 55.9]].map(([y0, y1], i) =>
        [4.6, 11.6].map((z) => {
          const [cx, cy] = toLocal(86.6, (y0 + y1) / 2);
          return (
            <mesh key={`${i}-${z}`} position={[cx + 0.1 * MM, cy, z * MM]} material={mats.slot}>
              <boxGeometry args={[0.2 * MM, 12.2 * MM, 5.2 * MM]} />
            </mesh>
          );
        }),
      )}
      {(() => {
        const [cx, cy] = toLocal(87.5, (2.25 + 18.75) / 2);
        return (
          <mesh position={[cx + 0.1 * MM, cy, 6.5 * MM]} material={mats.slot}>
            <boxGeometry args={[0.2 * MM, 11.8 * MM, 8.0 * MM]} />
          </mesh>
        );
      })()}
    </group>
  );
}

/** Mounting-hole centres in the board's local frame (metres). */
export const PI_HOLES: [number, number][] = HOLES.map(([x, y]) => toLocal(x, y));
/** Processor lid centre and top height in the local frame (metres). */
export const PI_SOC = { x: toLocal((SOC[0] + SOC[2]) / 2, 0)[0], y: toLocal(0, (SOC[1] + SOC[3]) / 2)[1], z: 1.5 * MM };
