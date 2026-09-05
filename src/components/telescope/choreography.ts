import * as THREE from "three";
import anchors from "./anchors.json";

/**
 * Camera choreography for the home-page story. Positions are in the
 * scene's world frame: the GLB is Z-up in metres and the model group is
 * rotated −90° about X, so model (x, y, z) → world (x, z, −y).
 *
 * `shift` slides camera and target together along the camera's right
 * axis (metres), so the instrument sits beside the copy instead of under it.
 */
type V3 = [number, number, number];
export type Key = { p: number; pos: V3; look: V3; shift: number };

const c = (k: keyof typeof anchors): V3 => {
  const a = anchors[k];
  const mx = (a.min[0] + a.max[0]) / 2;
  const my = (a.min[1] + a.max[1]) / 2;
  const mz = (a.min[2] + a.max[2]) / 2;
  return [mx, mz, -my];
};

const whole = c("scene");
const rocker = c("rocker");
const altMotor = c("altMotor");
const gear = c("sectorGear");
const primary = c("primaryMirror");
const secondary = c("secondary");
const focuser = c("focuser");

const mix = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Screens: hero 0, mechanical 1, electrical 2, optics 3, outro 4 → p = i/4. */
export const CAMERA_KEYS: Key[] = [
  // hero — the whole instrument, three-quarter view, slightly above
  { p: 0.0, pos: [1.95, whole[1] + 0.7, 2.7], look: [0, whole[1] + 0.02, 0], shift: -0.5 },
  { p: 0.1, pos: [1.8, whole[1] + 0.62, 2.6], look: [0, whole[1] + 0.02, 0], shift: -0.5 },
  // mechanical — rocker box, bearings, truss shoes
  { p: 0.25, pos: [1.25, rocker[1] + 0.5, 1.45], look: [0, rocker[1] + 0.1, 0], shift: -0.42 },
  { p: 0.35, pos: [1.05, rocker[1] + 0.42, 1.35], look: [0.02, rocker[1] + 0.12, 0], shift: -0.42 },
  // electrical — altitude drive on the −x side
  { p: 0.5, pos: [altMotor[0] - 0.95, altMotor[1] + 0.32, 0.7], look: mix(altMotor, gear, 0.4), shift: 0.34 },
  { p: 0.6, pos: [altMotor[0] - 0.8, altMotor[1] + 0.22, 0.78], look: mix(altMotor, gear, 0.35), shift: 0.34 },
  // optics — down the tube at the secondary and the primary beneath it
  { p: 0.75, pos: [secondary[0] + 0.7, secondary[1] + 0.62, secondary[2] + 0.95], look: mix(secondary, primary, 0.22), shift: -0.22 },
  { p: 0.85, pos: [focuser[0] + 0.05, secondary[1] + 0.42, secondary[2] + 0.8], look: mix(secondary, primary, 0.14), shift: -0.22 },
  // outro — pull back to the whole instrument
  { p: 1.0, pos: [-1.7, whole[1] + 0.7, 2.7], look: [0, whole[1] + 0.05, 0], shift: -0.5 },
];

export const smooth = (t: number) => t * t * (3 - 2 * t);

const tA = new THREE.Vector3();
const tB = new THREE.Vector3();

/** Returns the sampled lateral shift; fills pos and look. */
export function sampleCamera(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3): number {
  const keys = CAMERA_KEYS;
  if (p <= keys[0].p) {
    outPos.set(...keys[0].pos);
    outLook.set(...keys[0].look);
    return keys[0].shift;
  }
  const last = keys[keys.length - 1];
  if (p >= last.p) {
    outPos.set(...last.pos);
    outLook.set(...last.look);
    return last.shift;
  }
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = smooth((p - a.p) / (b.p - a.p));
      tA.set(...a.pos);
      tB.set(...b.pos);
      outPos.lerpVectors(tA, tB, t);
      tA.set(...a.look);
      tB.set(...b.look);
      outLook.lerpVectors(tA, tB, t);
      return a.shift + (b.shift - a.shift) * t;
    }
  }
  return 0;
}

/** Model spin (radians) during the hero, easing out before the first beat. */
export function heroSpin(p: number, time: number): number {
  const w = 1 - smooth(THREE.MathUtils.clamp(p / 0.2, 0, 1));
  return w * (time * 0.1);
}

export const SCENE_FLOOR_Y = anchors.scene.min[2];
