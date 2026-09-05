import * as THREE from "three";
import { ANCHORS, beatProgress, type V3 } from "./spec";

/**
 * One continuous camera path around and into the instrument, sampled by
 * scroll progress. Position and look-target each ride a Catmull-Rom spline
 * through the waypoints below. `shift` slides camera and target together
 * along the camera's right axis so the instrument sits beside the copy.
 */
type Way = { p: number; pos: V3; look: V3; shift: number };

const whole = ANCHORS.whole;
const rocker = ANCHORS.rocker;
const box = ANCHORS.enclosure;
const chip = ANCHORS.chip;
const secondary = ANCHORS.secondary;

export const P = {
  hero: beatProgress(0),
  mech: beatProgress(1),
  elec: beatProgress(2),
  opt: beatProgress(3),
  out: beatProgress(4),
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const WAYPOINTS: Way[] = [
  // hero: three-quarter view from the front right, slightly above
  { p: P.hero, pos: [2.05, whole[1] + 0.75, 2.7], look: [0, whole[1], 0], shift: -0.5 },
  // dolly in and drop, same side, so the first scroll reads as a zoom not a spin
  { p: lerp(P.hero, P.mech, 0.5), pos: [1.85, whole[1] + 0.3, 2.3], look: [0, whole[1] - 0.18, 0], shift: -0.42 },
  // mechanical: low and close on the rocker, bearings and box, front right
  { p: P.mech, pos: [1.5, rocker[1] + 0.45, 1.55], look: [0.02, rocker[1] + 0.1, 0], shift: -0.3 },
  // now travel: around the right side …
  { p: lerp(P.mech, P.elec, 0.3), pos: [1.95, rocker[1] + 0.4, 0.1], look: [0, rocker[1] + 0.1, 0], shift: -0.1 },
  // … to the back, facing the control box
  { p: lerp(P.mech, P.elec, 0.62), pos: [0.9, rocker[1] + 0.5, -1.5], look: [box[0], box[1] + 0.05, box[2]], shift: 0.05 },
  // close on the box lid
  { p: lerp(P.mech, P.elec, 0.85), pos: [box[0] + 0.12, box[1] + 0.16, box[2] - 0.48], look: [box[0], box[1], box[2]], shift: 0.03 },
  // electrical: through the lid, onto the processor
  { p: P.elec, pos: [chip[0] - 0.06, chip[1] + 0.06, chip[2] - 0.125], look: [chip[0] + 0.012, chip[1] - 0.002, chip[2]], shift: 0.03 },
  // back out and up the left side
  { p: lerp(P.elec, P.opt, 0.35), pos: [-0.9, 0.55, -1.3], look: [-0.05, 0.4, -0.1], shift: 0 },
  { p: lerp(P.elec, P.opt, 0.68), pos: [-1.75, whole[1] + 0.75, 0.2], look: [-0.05, whole[1] + 0.2, 0], shift: 0 },
  // optics: high on the left-front, looking down into the cage
  { p: P.opt, pos: [-0.85, secondary[1] + 0.78, 1.05], look: [0.02, secondary[1] - 0.04, 0.03], shift: -0.16 },
  // cross the front past the focuser and camera
  { p: lerp(P.opt, P.out, 0.5), pos: [0.65, secondary[1] + 0.62, 1.25], look: [0.08, secondary[1] + 0.02, 0.08], shift: -0.2 },
  // outro: the whole instrument again from the front left
  { p: P.out, pos: [-1.85, whole[1] + 0.75, 2.7], look: [0, whole[1] + 0.03, 0], shift: -0.5 },
];

const posCurve = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => new THREE.Vector3(...w.pos)), false, "centripetal", 0.5);
const lookCurve = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => new THREE.Vector3(...w.look)), false, "centripetal", 0.5);

export const smooth = (t: number) => t * t * (3 - 2 * t);

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

/** 0 → lid solid, 1 → lid gone: dissolves as the camera closes on the box. */
export function lidOpen(p: number): number {
  const a = lerp(P.mech, P.elec, 0.72);
  const b = lerp(P.mech, P.elec, 0.95);
  const c = lerp(P.elec, P.opt, 0.12);
  const d = lerp(P.elec, P.opt, 0.3);
  if (p < a || p > d) return 0;
  if (p < b) return smooth((p - a) / (b - a));
  if (p < c) return 1;
  return 1 - smooth((p - c) / (d - c));
}
