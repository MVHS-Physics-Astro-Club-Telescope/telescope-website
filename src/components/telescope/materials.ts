import * as THREE from "three";

/**
 * One material per surface family, shared across the whole model.
 * Varnished baltic birch, brushed aluminium, powder-coated black,
 * front-surface mirror, ground glass, and a few rubber and steel bits.
 */
export function createMaterials(birch: THREE.Texture, birchRough: THREE.Texture) {
  birch.wrapS = birch.wrapT = THREE.RepeatWrapping;
  birch.colorSpace = THREE.SRGBColorSpace;
  birch.anisotropy = 8;
  birch.repeat.set(1.6, 1.6);
  birchRough.wrapS = birchRough.wrapT = THREE.RepeatWrapping;
  birchRough.repeat.set(1.6, 1.6);

  return {
    plywood: new THREE.MeshPhysicalMaterial({
      map: birch,
      roughnessMap: birchRough,
      color: "#dccfb6",
      roughness: 0.58,
      metalness: 0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
    }),
    plywoodEdge: new THREE.MeshStandardMaterial({
      color: "#c8ad82",
      roughness: 0.8,
      metalness: 0,
    }),
    aluminum: new THREE.MeshPhysicalMaterial({
      color: "#d9dce0",
      metalness: 1,
      roughness: 0.3,
      clearcoat: 0.1,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: "#b4b8be",
      metalness: 1,
      roughness: 0.45,
    }),
    black: new THREE.MeshStandardMaterial({
      color: "#161616",
      roughness: 0.55,
      metalness: 0.25,
    }),
    blackMatte: new THREE.MeshStandardMaterial({
      color: "#101010",
      roughness: 0.85,
      metalness: 0.05,
    }),
    anodized: new THREE.MeshPhysicalMaterial({
      color: "#1c1d20",
      roughness: 0.32,
      metalness: 0.85,
      clearcoat: 0.3,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: "#7a1f1f",
      roughness: 0.4,
      metalness: 0.6,
    }),
    laminate: new THREE.MeshPhysicalMaterial({
      color: "#0a0a0a",
      roughness: 0.12,
      metalness: 0.1,
      clearcoat: 0.8,
    }),
    ptfe: new THREE.MeshStandardMaterial({
      color: "#ececea",
      roughness: 0.5,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: "#0b0b0b",
      roughness: 0.95,
    }),
    mirror: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 1,
      roughness: 0.03,
      envMapIntensity: 1.4,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#dfe4e8",
      roughness: 0.35,
      metalness: 0,
      transmission: 0,
    }),
    led: new THREE.MeshStandardMaterial({
      color: "#1a2a1a",
      emissive: "#5cf08a",
      emissiveIntensity: 2.5,
      roughness: 0.4,
    }),
    floor: new THREE.MeshStandardMaterial({
      color: "#0d0d0d",
      roughness: 0.92,
      metalness: 0,
    }),
  };
}

export type Materials = ReturnType<typeof createMaterials>;
