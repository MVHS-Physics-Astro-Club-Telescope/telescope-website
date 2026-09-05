import * as THREE from "three";
import { ANCHORS, type V3 } from "./spec";

/**
 * Camera choreography for the home-page story, in the scene's world frame
 * (Y-up metres, floor at y = 0). `shift` slides camera and target together
 * along the camera's right axis so the instrument sits beside the copy.
 */
export type Key = { p: number; pos: V3; look: V3; shift: number };

const whole = ANCHORS.whole;
const rocker = ANCHORS.rocker;
const drive = ANCHORS.drive;
const primary = ANCHORS.primary;
const secondary = ANCHORS.secondary;
const focuser = ANCHORS.focuser;

const mix = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Screens: hero 0, mechanical 1, electrical 2, optics 3, outro 4 → p = i/4. */
export const CAMERA_KEYS: Key[] = [
  // hero — the whole instrument, three-quarter view, slightly above
  { p: 0.0, pos: [2.0, whole[1] + 0.75, 2.75], look: [0, whole[1] + 0.02, 0], shift: -0.5 },
  { p: 0.1, pos: [1.85, whole[1] + 0.66, 2.65], look: [0, whole[1] + 0.02, 0], shift: -0.5 },
  // mechanical — rocker, bearings, mirror box, truss shoes
  { p: 0.25, pos: [1.3, rocker[1] + 0.55, 1.5], look: [0, rocker[1] + 0.15, 0], shift: -0.42 },
  { p: 0.35, pos: [1.1, rocker[1] + 0.48, 1.4], look: [0.02, rocker[1] + 0.17, 0], shift: -0.42 },
  // electrical — altitude motor and the control box on the rear
  { p: 0.5, pos: [drive[0] - 1.45, drive[1] + 0.55, drive[2] - 0.9], look: mix(drive, rocker, 0.3), shift: 0.22 },
  { p: 0.6, pos: [drive[0] - 1.3, drive[1] + 0.46, drive[2] - 1.05], look: mix(drive, rocker, 0.25), shift: 0.22 },
  // optics — down at the secondary and the primary beneath it
  { p: 0.75, pos: [secondary[0] + 0.7, secondary[1] + 0.62, secondary[2] + 0.95], look: mix(secondary, primary, 0.22), shift: -0.22 },
  { p: 0.85, pos: [focuser[0] + 0.15, secondary[1] + 0.42, focuser[2] + 0.75], look: mix(secondary, primary, 0.14), shift: -0.22 },
  // outro — pull back to the whole instrument
  { p: 1.0, pos: [-1.75, whole[1] + 0.75, 2.75], look: [0, whole[1] + 0.05, 0], shift: -0.5 },
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
