import * as THREE from "three";

/**
 * One material per surface family, shared across the whole model.
 * The plywood is a photographed veneer (CC0, Poly Haven) with normal and
 * roughness maps under a light varnish; metals are physically based and
 * pick their reflections up from the studio HDRI.
 */
export interface WoodMaps {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
}

export function createMaterials(wood: WoodMaps) {
  for (const t of [wood.map, wood.normalMap, wood.roughnessMap]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
  }
  wood.map.colorSpace = THREE.SRGBColorSpace;

  return {
    plywood: new THREE.MeshPhysicalMaterial({
      map: wood.map,
      normalMap: wood.normalMap,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap: wood.roughnessMap,
      color: "#e3ceab",
      roughness: 0.72,
      metalness: 0,
      clearcoat: 0.28,
      clearcoatRoughness: 0.42,
    }),
    aluminum: new THREE.MeshPhysicalMaterial({
      color: "#d4d7db",
      metalness: 1,
      roughness: 0.27,
      anisotropy: 0.7,
      anisotropyRotation: Math.PI / 2,
      clearcoat: 0.05,
    }),
    chrome: new THREE.MeshPhysicalMaterial({
      color: "#e2e4e8",
      metalness: 1,
      roughness: 0.12,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: "#9ea3aa",
      metalness: 1,
      roughness: 0.4,
    }),
    black: new THREE.MeshPhysicalMaterial({
      color: "#141414",
      roughness: 0.5,
      metalness: 0.25,
      clearcoat: 0.12,
      clearcoatRoughness: 0.6,
    }),
    blackMatte: new THREE.MeshStandardMaterial({
      color: "#0c0c0c",
      roughness: 0.92,
      metalness: 0.02,
    }),
    flock: new THREE.MeshStandardMaterial({
      color: "#050505",
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
    anodized: new THREE.MeshPhysicalMaterial({
      color: "#1a1b1e",
      roughness: 0.34,
      metalness: 0.85,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3,
    }),
    accent: new THREE.MeshPhysicalMaterial({
      color: "#8a1f1f",
      roughness: 0.35,
      metalness: 0.6,
      clearcoat: 0.4,
    }),
    laminate: new THREE.MeshPhysicalMaterial({
      color: "#0b0b0b",
      roughness: 0.14,
      metalness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    }),
    ptfe: new THREE.MeshStandardMaterial({
      color: "#e9e9e6",
      roughness: 0.55,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: "#0a0a0a",
      roughness: 0.95,
    }),
    mirror: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 1,
      roughness: 0.03,
      envMapIntensity: 1.6,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#d9dfe4",
      roughness: 0.42,
      metalness: 0,
    }),
    led: new THREE.MeshStandardMaterial({
      color: "#1a2a1a",
      emissive: "#5cf08a",
      emissiveIntensity: 3,
      roughness: 0.4,
    }),
    floor: new THREE.MeshStandardMaterial({
      color: "#0e0e0e",
      roughness: 0.94,
      metalness: 0,
    }),
  };
}

export type Materials = ReturnType<typeof createMaterials>;

/**
 * Box-project UVs in the geometry's own frame so a photographed texture
 * keeps one physical scale across every face and every part.
 * `scale` = repeats per metre.
 */
export function boxUV(geo: THREE.BufferGeometry, scale = 2.2): THREE.BufferGeometry {
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = Math.abs(nor.getX(i)), ny = Math.abs(nor.getY(i)), nz = Math.abs(nor.getZ(i));
    let u: number, v: number;
    if (nx >= ny && nx >= nz) { u = z; v = y; }
    else if (ny >= nz) { u = x; v = z; }
    else { u = x; v = y; }
    uv[i * 2] = u * scale;
    uv[i * 2 + 1] = v * scale;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}
