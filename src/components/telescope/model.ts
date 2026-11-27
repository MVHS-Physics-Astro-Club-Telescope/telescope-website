import * as THREE from "three";
import FINISHES from "./appearance.json";
import CAD from "./anchors.json";

/**
 * The home-page telescope is the final CAD assembly (2,088 parts) with the
 * 70 bought parts rebuilt from their makers' drawings and their real labels
 * laid on as decals. It is built outside this repo by the realism pipeline
 * (~/Projects/telescope/realism: site_export.py, then gltf-transform weld,
 * simplify --error 0.0002 and Draco), see README.
 *
 * Node graph: telescope (Z-up mm → Y-up m) → G (ground board, fixed) and
 * az_pivot → r_offset → R (rocker) + alt → O (tube). The page sets the pose
 * on `alt` and `az_pivot`; nothing is baked in.
 */
export const MODEL_URL = "/models/telescope.glb";
export const DRACO_PATH = "/draco/";

/** Observing pose: tube 45° above the horizon, 30° of azimuth from the CAD zero. Anchors were taken at this pose. */
export const POSE = { h: CAD.pose.h, A: CAD.pose.A };

/** The CAD's lowest point (the feet) sits on the studio floor. */
export const LIFT = -CAD.whole.min[2];

export type V3 = [number, number, number];
const DEG = Math.PI / 180;

/** CAD world metres (Z up) → scene (Y up, floor at 0). */
const toScene = ([x, y, z]: number[]): V3 => [x, z + LIFT, -y];

/** Points the camera choreography is keyed to, in scene metres at POSE. */
export const ANCHORS = {
  whole: toScene(CAD.whole.centre),
  height: CAD.whole.max[2] + LIFT,
  enclosure: toScene(CAD.enclosure.centre),
  cover: toScene(CAD.cover.centre),
  altMotor: toScene(CAD.alt_motor.centre),
  azMotor: toScene(CAD.az_motor.centre),
  camera: toScene(CAD.camera.centre),
  focuser: toScene(CAD.focuser.centre),
  secondary: toScene(CAD.secondary.centre),
  primary: toScene(CAD.primary.centre),
};

/** Unit vector along the optical axis, toward the sky, at POSE (scene frame). */
export const TUBE_DIR: V3 = (() => {
  const h = POSE.h * DEG, a = POSE.A * DEG;
  // CAD: Rz(-A)·Rx(h-90)·(0,0,1) = (cos h sin A, cos h cos A, sin h); scene = (x, z, -y)
  return [Math.cos(h) * Math.sin(a), Math.sin(h), -Math.cos(h) * Math.cos(a)];
})();

type Finish = {
  color?: string;
  metalness?: number;
  roughness?: number;
  clearcoat?: number;
  transmission?: number;
  sheen?: number;
  brushed?: number;
  sheenColor?: string;
  sheenRoughness?: number;
};

/** Made parts and finish classes. Metal colours are F0 reflectance from physicallybased.info. */
const BASE: Record<string, Finish> = {
  al_5052: { color: "#e9ebec", metalness: 1, roughness: 0.4, brushed: 0.1 }, // mill-finish 5052-H32 sheet, as cut
  al_6061: { color: "#e4e6e7", metalness: 1, roughness: 0.34, brushed: 0.08 }, // 6061-T6 plate, as cut
  flock: { color: "#1e1e1e", metalness: 0, roughness: 1, sheen: 1, sheenColor: "#303030", sheenRoughness: 0.9 },
  asa_black: { color: "#2a2a2a", metalness: 0, roughness: 0.72 },
  asa_grey: { color: "#8d9093", metalness: 0, roughness: 0.6 },
  asa_white: { color: "#e6e4df", metalness: 0, roughness: 0.55 },
  asa_orange: { color: "#d8641f", metalness: 0, roughness: 0.6 },
  asa_blue: { color: "#2d5ea8", metalness: 0, roughness: 0.6 },
  mat_steel_316: { color: "#d6d1cb", metalness: 1, roughness: 0.3 },
  mat_steel_304: { color: "#d6d1cb", metalness: 1, roughness: 0.3 },
  mat_nylon: { color: "#e9e4d6", metalness: 0, roughness: 0.55 },
  mat_ptfe_virgin: { color: "#f1f0ec", metalness: 0, roughness: 0.62 },
  mat_polycarbonate: { color: "#b9bcbf", metalness: 0, roughness: 0.3 },
  mat_borosilicate: { color: "#f4f6f7", metalness: 1, roughness: 0.03 },
};
const FALLBACK: Finish = { color: "#3a3a3a", metalness: 0, roughness: 0.6 };
const FINISH = FINISHES as Record<string, Finish>;

/** The material's appearance key, as the exporter wrote it. */
export function appearanceOf(m: THREE.Material): string {
  const raw = (m.userData?.appearance as string | undefined) || m.name || "";
  return raw.startsWith("lid:") ? raw.slice(4) : raw; // the enclosure cover; it stays closed on the site
}

/** Decal images the model references, in load order. */
export function decalFiles(scene: THREE.Object3D): string[] {
  const files = new Set<string>();
  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const app = appearanceOf(o.material as THREE.Material);
    if (app.startsWith("decal:")) files.add(app.slice(6));
  });
  return [...files].sort();
}

export interface Maps {
  brushedNormal: THREE.Texture;
  brushedRough: THREE.Texture;
  decals: Map<string, THREE.Texture>;
}

function makeMaterial(app: string, vertexColors: boolean, maps: Maps, missing: Set<string>): THREE.Material {
  if (app.startsWith("decal:")) {
    // a printed label or logo, laid 0.05 mm proud of its part
    return new THREE.MeshPhysicalMaterial({
      map: maps.decals.get(app.slice(6)) ?? null,
      transparent: true,
      alphaTest: 0.04,
      roughness: 0.42,
      metalness: 0,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
  }
  const f = BASE[app] ?? FINISH[app];
  if (!f) missing.add(app);
  const a = f ?? FALLBACK;
  // Lenses and windows: plain see-through glass. Real transmission makes three render the whole
  // scene a second time every frame, for four small pieces of glass.
  const glass = a.transmission ? { transparent: true, opacity: 1 - 0.75 * a.transmission, depthWrite: false } : {};
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(a.color),
    metalness: a.metalness ?? 0,
    roughness: a.roughness ?? 0.6,
    clearcoat: a.transmission ? 1 : (a.clearcoat ?? 0),
    clearcoatRoughness: 0.2,
    ...glass,
    sheen: a.sheen ?? 0,
    sheenColor: new THREE.Color(a.sheenColor || (a.sheen ? "#363636" : "#000000")),
    sheenRoughness: a.sheenRoughness ?? 0.6,
    vertexColors,
  });
  if (a.brushed) {
    m.roughnessMap = maps.brushedRough;
    m.normalMap = maps.brushedNormal;
    m.normalScale = new THREE.Vector2(a.brushed, a.brushed);
  }
  return m;
}

/**
 * A dressed copy of the loaded scene: finishes from appearance.json on every
 * mesh, shadows on, and the pose set. The loader's own scene is left alone.
 */
export function dressModel(source: THREE.Object3D, maps: Maps): THREE.Object3D {
  const root = source.clone(true);
  const cache = new Map<string, THREE.Material>();
  const missing = new Set<string>();
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const app = appearanceOf(o.material as THREE.Material);
    const vc = !!o.geometry.attributes.color;
    const key = app + (vc ? "|vc" : "");
    if (!cache.has(key)) cache.set(key, makeMaterial(app, vc, maps, missing));
    o.material = cache.get(key)!;
    const decal = app.startsWith("decal:");
    o.castShadow = !decal;
    o.receiveShadow = true;
    if (decal) o.renderOrder = 1;
  });
  if (missing.size) console.warn("telescope: no finish for", [...missing]);
  const alt = root.getObjectByName("alt");
  const az = root.getObjectByName("az_pivot");
  if (alt) alt.rotation.x = (POSE.h - 90) * DEG;
  if (az) az.rotation.z = -POSE.A * DEG;
  return root;
}
