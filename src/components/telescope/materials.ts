import * as THREE from "three";

/**
 * Material families, keyed by the prefix the build script stamps on every
 * node name ("plywood::Rocker Floor 450sq"). One instance per family,
 * shared across every mesh that uses it.
 */
export type Family =
  | "plywood"
  | "aluminum-brushed"
  | "steel-bright"
  | "steel-dark"
  | "black-print"
  | "black-anodized"
  | "black-plastic"
  | "rubber"
  | "laminate"
  | "ptfe"
  | "mirror";

export function createMaterials(birch: THREE.Texture, birchRough: THREE.Texture) {
  birch.wrapS = birch.wrapT = THREE.RepeatWrapping;
  birch.colorSpace = THREE.SRGBColorSpace;
  birch.anisotropy = 8;
  birchRough.wrapS = birchRough.wrapT = THREE.RepeatWrapping;

  const m: Record<Family, THREE.Material> = {
    plywood: new THREE.MeshStandardMaterial({
      map: birch,
      roughnessMap: birchRough,
      color: "#ffffff",
      roughness: 0.85,
      metalness: 0,
    }),
    "aluminum-brushed": new THREE.MeshStandardMaterial({
      color: "#c9cdd2",
      metalness: 0.95,
      roughness: 0.34,
    }),
    "steel-bright": new THREE.MeshStandardMaterial({
      color: "#aeb2b8",
      metalness: 1,
      roughness: 0.42,
    }),
    "steel-dark": new THREE.MeshStandardMaterial({
      color: "#2b2b2e",
      metalness: 0.9,
      roughness: 0.48,
    }),
    "black-print": new THREE.MeshStandardMaterial({
      color: "#151515",
      roughness: 0.78,
      metalness: 0.04,
    }),
    "black-anodized": new THREE.MeshStandardMaterial({
      color: "#17181b",
      roughness: 0.4,
      metalness: 0.7,
    }),
    "black-plastic": new THREE.MeshStandardMaterial({
      color: "#101010",
      roughness: 0.62,
      metalness: 0.05,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: "#0c0c0c",
      roughness: 0.96,
      metalness: 0,
    }),
    laminate: new THREE.MeshStandardMaterial({
      color: "#0a0a0a",
      roughness: 0.18,
      metalness: 0.25,
    }),
    ptfe: new THREE.MeshStandardMaterial({
      color: "#e9e9e6",
      roughness: 0.55,
      metalness: 0,
    }),
    mirror: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 1,
      roughness: 0.05,
      envMapIntensity: 1.8,
    }),
  };
  for (const mat of Object.values(m)) mat.side = THREE.DoubleSide;
  return m;
}

export function familyOf(name: string): Family | null {
  const i = name.indexOf("::");
  if (i < 0) return null;
  const f = name.slice(0, i) as Family;
  return f;
}
