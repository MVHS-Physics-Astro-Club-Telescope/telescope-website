import * as THREE from "three";

/**
 * One material per surface family, shared across the whole model.
 * The structure is machined and brushed aluminium (natural and dark
 * anodised) with a generated brushed normal/roughness pair; metals pick
 * their reflections up from the studio HDRI.
 */
export interface BrushedMaps {
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
}

export function createMaterials(brushed: BrushedMaps) {
  for (const t of [brushed.normalMap, brushed.roughnessMap]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
  }

  const alu = new THREE.MeshPhysicalMaterial({
    color: "#cdd0d5",
    metalness: 1,
    roughness: 1, // × roughness map (0.30–0.46)
    roughnessMap: brushed.roughnessMap,
    normalMap: brushed.normalMap,
    normalScale: new THREE.Vector2(0.4, 0.4),
    anisotropy: 0.55,
    envMapIntensity: 1.0,
  });
  const aluDark = new THREE.MeshPhysicalMaterial({
    color: "#34363a",
    metalness: 0.9,
    roughness: 1,
    roughnessMap: brushed.roughnessMap,
    normalMap: brushed.normalMap,
    normalScale: new THREE.Vector2(0.35, 0.35),
    anisotropy: 0.45,
    clearcoat: 0.15,
    clearcoatRoughness: 0.5,
  });

  return {
    alu,
    aluDark,
    aluminum: new THREE.MeshPhysicalMaterial({
      color: "#d4d7db",
      metalness: 1,
      roughness: 0.27,
      anisotropy: 0.7,
      anisotropyRotation: Math.PI / 2,
    }),
    chrome: new THREE.MeshPhysicalMaterial({ color: "#e2e4e8", metalness: 1, roughness: 0.12 }),
    steel: new THREE.MeshStandardMaterial({ color: "#a9adb3", metalness: 1, roughness: 0.38 }),
    black: new THREE.MeshPhysicalMaterial({
      color: "#141414",
      roughness: 0.5,
      metalness: 0.25,
      clearcoat: 0.12,
      clearcoatRoughness: 0.6,
    }),
    blackMatte: new THREE.MeshStandardMaterial({ color: "#0c0c0c", roughness: 0.92, metalness: 0.02 }),
    flock: new THREE.MeshStandardMaterial({ color: "#050505", roughness: 1, metalness: 0, side: THREE.DoubleSide }),
    anodized: new THREE.MeshPhysicalMaterial({
      color: "#1a1b1e",
      roughness: 0.34,
      metalness: 0.85,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3,
    }),
    accent: new THREE.MeshPhysicalMaterial({ color: "#8a1f1f", roughness: 0.35, metalness: 0.6, clearcoat: 0.4 }),
    laminate: new THREE.MeshPhysicalMaterial({
      color: "#0b0b0b",
      roughness: 0.14,
      metalness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    }),
    ptfe: new THREE.MeshStandardMaterial({ color: "#e9e9e6", roughness: 0.55 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.95 }),
    mirror: new THREE.MeshPhysicalMaterial({ color: "#ffffff", metalness: 1, roughness: 0.03, envMapIntensity: 1.6 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#d9dfe4", roughness: 0.42, metalness: 0 }),
    led: new THREE.MeshStandardMaterial({ color: "#1a2a1a", emissive: "#5cf08a", emissiveIntensity: 3, roughness: 0.4 }),
    ledRed: new THREE.MeshStandardMaterial({ color: "#2a1a1a", emissive: "#ff3b30", emissiveIntensity: 2.5, roughness: 0.4 }),
    // electronics
    pcb: new THREE.MeshPhysicalMaterial({ color: "#134a2c", roughness: 0.55, metalness: 0.05, clearcoat: 0.5, clearcoatRoughness: 0.35 }),
    chip: new THREE.MeshStandardMaterial({ color: "#101012", roughness: 0.35, metalness: 0.3 }),
    chipCap: new THREE.MeshStandardMaterial({ color: "#b8bcc2", roughness: 0.3, metalness: 1 }),
    tin: new THREE.MeshStandardMaterial({ color: "#a6aab0", roughness: 0.38, metalness: 1 }),
    plastic: new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.6, metalness: 0.05 }),
    heatsink: new THREE.MeshStandardMaterial({ color: "#2a2c30", roughness: 0.5, metalness: 0.8 }),
    wireRed: new THREE.MeshStandardMaterial({ color: "#b3201f", roughness: 0.6 }),
    wireBlack: new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.6 }),
    lid: new THREE.MeshPhysicalMaterial({
      color: "#0a0a0c",
      roughness: 0.08,
      metalness: 0,
      transparent: true,
      opacity: 0.55,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      depthWrite: false,
    }),
    floor: new THREE.MeshStandardMaterial({ color: "#0e0e0e", roughness: 0.94, metalness: 0 }),
  };
}

export type Materials = ReturnType<typeof createMaterials>;

/**
 * Box-project UVs in the geometry's own frame so the brushed maps keep one
 * physical scale across every face and every part. `scale` = repeats/metre.
 */
export function boxUV(geo: THREE.BufferGeometry, scale = 2.5): THREE.BufferGeometry {
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
