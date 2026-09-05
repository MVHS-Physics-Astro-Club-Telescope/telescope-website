import * as THREE from "three";
import { ANCHORS, beatProgress, type V3 } from "./spec";

/**
 * One continuous camera path around the instrument, sampled by scroll
 * progress. Position and look-target each ride a Catmull-Rom spline
 * through the waypoints below, so the camera orbits and dives rather than
 * cutting between poses. `shift` slides camera and target together along
 * the camera's right axis so the instrument sits beside the copy.
 */
type Way = { p: number; pos: V3; look: V3; shift: number };

const whole = ANCHORS.whole;
const rocker = ANCHORS.rocker;
const drive = ANCHORS.drive;
const secondary = ANCHORS.secondary;

const pHero = beatProgress(0);
const pMech = beatProgress(1);
const pElec = beatProgress(2);
const pOpt = beatProgress(3);
const pOut = beatProgress(4);
const mid = (a: number, b: number) => (a + b) / 2;

const WAYPOINTS: Way[] = [
  // hero: three-quarter view from the front right, slightly above
  { p: pHero, pos: [2.05, whole[1] + 0.75, 2.7], look: [0, whole[1], 0], shift: -0.5 },
  // drop and swing right as the first beat approaches
  { p: mid(pHero, pMech), pos: [2.55, whole[1] + 0.3, 1.3], look: [0, whole[1] - 0.15, 0], shift: -0.46 },
  // mechanical: low and close on the rocker, bearings and truss shoes
  { p: pMech, pos: [1.75, rocker[1] + 0.5, 0.7], look: [0.02, rocker[1] + 0.12, 0], shift: -0.3 },
  // continue around the right side to the back
  { p: mid(pMech, pElec), pos: [0.55, rocker[1] + 0.35, -1.25], look: [0, rocker[1] + 0.12, 0], shift: 0 },
  // electrical: the drive and control box on the rear-left corner
  { p: pElec, pos: [drive[0] - 1.1, drive[1] + 0.55, drive[2] - 1.25], look: [drive[0] + 0.08, drive[1] + 0.08, drive[2] - 0.02], shift: 0.16 },
  // rise up the left side
  { p: mid(pElec, pOpt), pos: [-1.75, whole[1] + 0.7, 0.15], look: [-0.05, whole[1] + 0.15, 0], shift: 0 },
  // optics: high on the left-front, looking down into the cage
  { p: pOpt, pos: [-0.85, secondary[1] + 0.78, 1.05], look: [0.02, secondary[1] - 0.04, 0.03], shift: -0.16 },
  // cross the front past the focuser and camera
  { p: mid(pOpt, pOut), pos: [0.65, secondary[1] + 0.62, 1.25], look: [0.08, secondary[1] + 0.02, 0.08], shift: -0.2 },
  // outro: the whole instrument again from the front left
  { p: pOut, pos: [-1.85, whole[1] + 0.75, 2.7], look: [0, whole[1] + 0.03, 0], shift: -0.5 },
];

const posCurve = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => new THREE.Vector3(...w.pos)), false, "centripetal", 0.5);
const lookCurve = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => new THREE.Vector3(...w.look)), false, "centripetal", 0.5);

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Map scroll progress to the spline parameter, easing within each leg. */
function toU(p: number): { u: number; shift: number } {
  const n = WAYPOINTS.length;
  if (p <= WAYPOINTS[0].p) return { u: 0, shift: WAYPOINTS[0].shift };
  if (p >= WAYPOINTS[n - 1].p) return { u: 1, shift: WAYPOINTS[n - 1].shift };
  for (let i = 0; i < n - 1; i++) {
    const a = WAYPOINTS[i], b = WAYPOINTS[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = smooth((p - a.p) / (b.p - a.p));
      return { u: (i + t) / (n - 1), shift: a.shift + (b.shift - a.shift) * t };
    }
  }
  return { u: 1, shift: WAYPOINTS[n - 1].shift };
}

/** Returns the lateral shift; fills pos and look. */
export function sampleCamera(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3): number {
  const { u, shift } = toU(p);
  posCurve.getPoint(u, outPos);
  lookCurve.getPoint(u, outLook);
  return shift;
}

/** Slow idle turn while the hero is on screen, fading out before the first beat. */
export function heroSpin(p: number, time: number): number {
  const w = 1 - smooth(THREE.MathUtils.clamp(p / (pMech * 0.6), 0, 1));
  return w * time * 0.06;
}
