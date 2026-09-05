/**
 * Dimensions of the idealised telescope on the home page. Proportions
 * follow the real build (254 mm f/4.48 truss Dobsonian, 6-pole truss,
 * 360 mm mirror box, 508 mm ground board) but the geometry is drawn
 * clean, the way the finished instrument should look under a studio light.
 *
 * Y-up metres, floor at y = 0, optical axis on x = z = 0.
 */
export const SPEC = {
  foot: { r: 0.028, h: 0.02, ring: 0.2 },
  groundBoard: { r: 0.254, h: 0.019, y: 0.02 },
  azBearing: { r: 0.236, h: 0.003 },
  rocker: {
    floorY: 0.064,
    floorSize: 0.45,
    ply: 0.019,
    wallX: 0.1995, // centre of each side wall
    wallTop: 0.287,
    wallDepth: 0.45,
  },
  altAxisY: 0.5,
  bearing: { r: 0.26, x: 0.1995, ply: 0.019, top: 0.52 },
  pad: { angle: (35 * Math.PI) / 180 },
  mirrorBox: { half: 0.18, ply: 0.019, bottom: 0.16, top: 0.46 },
  primary: { r: 0.127, h: 0.032, y: 0.205 },
  pole: { r: 0.0127 },
  cage: { rIn: 0.163, rOut: 0.178, h: 0.016, lowerY: 1.07, upperY: 1.21 },
  spider: { y: 1.16, hubR: 0.03 },
  secondary: { y: 1.1, a: 0.0495, b: 0.035 },
  focuserAzimuth: Math.PI / 4,
} as const;

const c = Math.cos;
const s = Math.sin;

/** Point on the square mirror-box rim at a given azimuth (x–z plane). */
export function rimPoint(azimuth: number, half: number): [number, number] {
  const x = c(azimuth), z = s(azimuth);
  const k = half / Math.max(Math.abs(x), Math.abs(z));
  return [x * k, z * k];
}

/** Truss shoes on the box rim and the ring points their poles meet. */
export const SHOE_AZIMUTHS = [Math.PI / 6, (5 * Math.PI) / 6, (3 * Math.PI) / 2];
export const RING_AZIMUTHS = [-Math.PI / 6, Math.PI / 2, (7 * Math.PI) / 6];

export type V3 = [number, number, number];

/** Anchor points the camera choreography is keyed to. */
export const ANCHORS = {
  whole: [0, 0.62, 0] as V3,
  rocker: [0, 0.2, 0] as V3,
  drive: [-0.26, 0.22, 0.02] as V3,
  primary: [0, SPEC.primary.y + 0.02, 0] as V3,
  secondary: [0, SPEC.secondary.y, 0] as V3,
  focuser: [
    (SPEC.cage.rOut + 0.08) * c(SPEC.focuserAzimuth),
    (SPEC.cage.lowerY + SPEC.cage.upperY) / 2,
    (SPEC.cage.rOut + 0.08) * s(SPEC.focuserAzimuth),
  ] as V3,
  floorY: 0,
  height: SPEC.cage.upperY + SPEC.cage.h,
};
