/**
 * Dimensions of the telescope on the home page. Proportions follow the
 * real build (254 mm f/4.48 truss Dobsonian, 6-pole truss, 360 mm mirror
 * box, 508 mm ground board); the structure is drawn as a machined
 * aluminium instrument the way a finished, well-made telescope looks under
 * a studio light.
 *
 * Y-up metres, floor at y = 0, optical axis on x = z = 0.
 */
export const SPEC = {
  foot: { r: 0.03, h: 0.022, ring: 0.2 },
  groundBoard: { r: 0.254, h: 0.014, y: 0.022 },
  azBearing: { r: 0.238, h: 0.004 },
  rocker: {
    floorY: 0.06,
    plate: 0.012, // sheet thickness
    wallX: 0.2005, // centre of each side wall
    wallDepth: 0.46,
    cradleR: 0.266, // concave top edge, centred on the altitude axis
    front: { h: 0.13, handleR: 0.038 },
    cutout: { r: 0.05, y: 0.15 },
  },
  altAxisY: 0.5,
  bearing: { r: 0.26, x: 0.2005, plate: 0.012, top: 0.53, rim: 0.006 },
  pad: { angle: (35 * Math.PI) / 180 },
  mirrorBox: { half: 0.18, plate: 0.01, bottom: 0.16, top: 0.46 },
  primary: { r: 0.127, h: 0.032, y: 0.2 },
  pole: { r: 0.0127 },
  cage: { rIn: 0.163, rOut: 0.18, h: 0.018, lowerY: 1.07, upperY: 1.215 },
  spider: { y: 1.165, hubR: 0.03 },
  secondary: { y: 1.1, a: 0.0495, b: 0.035 },
  focuserAzimuth: Math.PI / 4,
  /** Control box on the rear of the rocker; lid faces −z. */
  enclosure: { w: 0.28, h: 0.145, d: 0.05, x: -0.03, y: 0.15, zFace: -0.23 },
  /** Raspberry Pi 4 inside it, component side facing −z, ports toward −x. */
  pi: { w: 0.085, h: 0.056, x: -0.115, y: 0.15 },
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

/**
 * Pi board plane and its processor, in world space. The board is built in
 * its own frame (see PiBoard.tsx) and turned to face the lid, so its local
 * +x runs toward world −x; the BCM2711 lid sits 13.0 mm left of and 4.3 mm
 * above the board centre in the photo, 1.5 mm proud of the PCB.
 */
export const PI_Z = SPEC.enclosure.zFace - 0.012; // PCB component face
export const CHIP: V3 = [SPEC.pi.x + 0.013, SPEC.pi.y + 0.0043, PI_Z - 0.0015];

/** Anchor points the camera choreography is keyed to. */
export const ANCHORS = {
  whole: [0, 0.63, 0] as V3,
  rocker: [0, 0.22, 0] as V3,
  enclosure: [SPEC.enclosure.x, SPEC.enclosure.y, SPEC.enclosure.zFace - SPEC.enclosure.d / 2] as V3,
  chip: CHIP,
  primary: [0, SPEC.primary.y + 0.02, 0] as V3,
  secondary: [0, SPEC.secondary.y, 0] as V3,
  focuser: [
    (SPEC.cage.rOut + 0.08) * c(SPEC.focuserAzimuth),
    (SPEC.cage.lowerY + SPEC.cage.upperY) / 2,
    (SPEC.cage.rOut + 0.08) * s(SPEC.focuserAzimuth),
  ] as V3,
  height: SPEC.cage.upperY + SPEC.cage.h,
};

/**
 * Story layout, in viewport heights: hero, mechanical, electrical, optics,
 * outro. The beats are taller than a screen so the camera has room to
 * travel between them. Both the DOM layout and the camera keys read this.
 */
export const SCREENS = [1, 1.5, 1.7, 1.5, 1] as const;
export const STORY_HEIGHT = SCREENS.reduce((a, b) => a + b, 0);

/** Scroll progress (0..1) at which block i is centred in the viewport. */
export function beatProgress(i: number): number {
  let start = 0;
  for (let k = 0; k < i; k++) start += SCREENS[k];
  const centre = start + SCREENS[i] / 2 - 0.5;
  const span = STORY_HEIGHT - 1;
  return Math.min(Math.max(centre / span, 0), 1);
}
