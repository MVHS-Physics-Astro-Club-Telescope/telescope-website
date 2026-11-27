import * as THREE from "three";
import { beatProgress } from "./spec";
import { ANCHORS, TUBE_DIR, type V3 } from "./model";

/**
 * One continuous camera path around the instrument, sampled by scroll
 * progress. Each waypoint orbits a look target: azimuth in degrees about the
 * vertical (0 = from +z, 90 = from +x), elevation above the target's level,
 * distance in metres. Position and target each ride a Catmull-Rom spline
 * through the waypoints. `shift` slides camera and target together along the
 * camera's right axis so the instrument sits beside the copy.
 *
 * Where things are at the observing pose (scene azimuths): the tube points to
 * 150°, the focuser, camera and the power enclosure face 60°, the altitude
 * drive sits at 240° and the azimuth drive at 318°.
 */
type Way = { p: number; look: V3; az: number; el: number; dist: number; shift: number };

export const P = {
  hero: beatProgress(0),
  mech: beatProgress(1),
  elec: beatProgress(2),
  opt: beatProgress(3),
  out: beatProgress(4),
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const W = ANCHORS.whole;
const whole: V3 = [W[0], ANCHORS.height * 0.5, W[2]];
const rocker: V3 = [W[0], 0.42, W[2]];
const box = ANCHORS.cover;
const cage = ANCHORS.secondary;
const camera = ANCHORS.camera;
// a point a little up the optical axis from the secondary: the cage's open end
const aperture = add(cage, TUBE_DIR.map((c) => c * 0.08) as V3);

const WAYPOINTS: Way[] = [
  // hero: three-quarter on the power box side, the tube in profile reaching up and right
  { p: P.hero, look: whole, az: 108, el: 9, dist: 3.6, shift: -0.55 },
  // dolly in and drop toward the rocker, so the first scroll reads as a zoom not a spin
  { p: lerp(P.hero, P.mech, 0.5), look: [whole[0], 0.6, whole[2]], az: 62, el: 7, dist: 3.1, shift: -0.45 },
  // mechanical: the rocker, the altitude bearing arcs, the azimuth drive and the battery bay
  { p: P.mech, look: rocker, az: 8, el: 8, dist: 2.6, shift: -0.45 },
  // swing back round to the power box …
  { p: lerp(P.mech, P.elec, 0.5), look: [box[0] * 0.6, 0.6, box[2] * 0.6], az: 35, el: 8, dist: 1.9, shift: -0.05 },
  // electrical: square on the power enclosure, its kill switch and cable glands
  { p: P.elec, look: box, az: 62, el: 6, dist: 1.55, shift: 0.2 },
  // rise up the focuser side …
  { p: lerp(P.elec, P.opt, 0.45), look: camera, az: 80, el: 18, dist: 1.25, shift: 0.05 },
  // optics: high in front of the open end, down past the camera into the cage
  { p: P.opt, look: aperture, az: 140, el: 50, dist: 1.7, shift: -0.45 },
  // outro: the whole instrument again, from the bearing-arc side
  { p: P.out, look: whole, az: 225, el: 9, dist: 3.7, shift: -0.55 },
];

function orbit(w: Way, out: THREE.Vector3) {
  const az = (w.az * Math.PI) / 180, el = (w.el * Math.PI) / 180;
  return out.set(
    w.look[0] + w.dist * Math.cos(el) * Math.sin(az),
    w.look[1] + w.dist * Math.sin(el),
    w.look[2] + w.dist * Math.cos(el) * Math.cos(az),
  );
}

const posCurve = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => orbit(w, new THREE.Vector3())), false, "centripetal", 0.5);
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
