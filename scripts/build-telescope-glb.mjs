/**
 * Builds public/models/telescope.glb from Onshape glTF exports.
 *
 * Inputs (glTF 2.0 JSON with embedded buffers, as returned by Onshape's
 * translation API), in the directory given as the first argument:
 *   asm00.gltf            ASM 00 — FULL TELESCOPE
 *   mirror-box-v3.gltf    Mirror Box v3 assembly (ASM 00's mirror-box
 *                         instance is broken in the workspace)
 *   mirror-cell-v2.gltf   Mirror Cell v2 part studio
 *   alt-bearing-hub.gltf  Altitude Bearing Base part studio
 *   alt-sector-gear.gltf  ALT Sector Gear R285 part studio
 *   fan-80.gltf           Fan 80mm CFM-8025B part studio
 *
 * What it does:
 *   1. Re-centres the Upper Tube Assembly on the optical axis (the ASM 00
 *      placement is 115 mm off in X and Y).
 *   2. Composes the parts whose ASM 00 instances are broken, at the
 *      occurrence transforms ASM 00 still records for them.
 *   3. Cuts the full spur-gear placeholder down to the R285 sector.
 *   4. Adds the 70 mm secondary flat (not modelled in the UTA).
 *   5. Classifies every part into a material family by name, projects
 *      box UVs on the plywood, welds, simplifies (threads and vendor
 *      STEPs most aggressively), Draco-compresses, and writes the GLB.
 *   6. Writes src/components/telescope/anchors.json with world-space
 *      bounding boxes (Z-up, metres) that the scroll choreography uses.
 *
 * Usage: node scripts/build-telescope-glb.mjs <dir-with-gltf-exports>
 */
import { NodeIO, Accessor } from "@gltf-transform/core";
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from "@gltf-transform/extensions";
import {
  weld,
  dedup,
  prune,
  draco,
  mergeDocuments,
  simplifyPrimitive,
  joinPrimitives,
  getBounds,
  unpartition,
} from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";
import draco3d from "draco3dgltf";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("usage: node scripts/build-telescope-glb.mjs <dir>");
  process.exit(1);
}
const OUT_GLB = "public/models/telescope.glb";
const OUT_ANCHORS = "src/components/telescope/anchors.json";

/** ASM 00's UTA sits 115 mm off the optical axis in X and Y. */
const UTA_SHIFT = [0.115, 0.115, 0];

/** Onshape occurrence transforms are row-major 4×4. */
const rowMajor = (m) => m;

// Mirror Box v3 lives in its own frame: outer box x −0.047..0.309,
// y −0.410..−0.054, z −0.640..−0.373. Centre it on the optical axis with
// its floor at z = 0.011 (the mirror cell sits on it at z = 0.049).
const MIRROR_BOX_XFORM = rowMajor([
  1, 0, 0, -0.131,
  0, 1, 0, 0.232,
  0, 0, 1, 0.651,
  0, 0, 0, 1,
]);
const MIRROR_CELL_XFORM = rowMajor([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0.0491, 0, 0, 0, 1]);
const HUB_POS_XFORM = rowMajor([0, 0, 1, 0.1838, 0, 1, 0, 0, -1, 0, 0, 0.27, 0, 0, 0, 1]);
const HUB_NEG_XFORM = rowMajor([0, 0, -1, -0.1838, 0, 1, 0, 0, 1, 0, 0, 0.27, 0, 0, 0, 1]);
const FAN_XFORM = rowMajor([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0.0491, 0, 0, 0, 1]);

const FAMILIES = {
  plywood: [0.78, 0.66, 0.48],
  "aluminum-brushed": [0.82, 0.83, 0.85],
  "steel-bright": [0.75, 0.76, 0.78],
  "steel-dark": [0.12, 0.12, 0.12],
  "black-print": [0.08, 0.08, 0.08],
  "black-anodized": [0.1, 0.1, 0.11],
  "black-plastic": [0.09, 0.09, 0.09],
  rubber: [0.06, 0.06, 0.06],
  laminate: [0.05, 0.05, 0.05],
  ptfe: [0.9, 0.9, 0.88],
  mirror: [0.95, 0.96, 0.98],
};

function classify(name, ctx) {
  const n = name.toLowerCase();
  if (ctx === "mirror-box") return /hcs|screw|bolt/.test(n) ? "steel-dark" : "plywood";
  if (ctx === "gear") return "aluminum-brushed";
  if (ctx === "fan") return "black-plastic";
  if (ctx === "mirror-cell") return "black-print";
  if (ctx === "hub") return "black-print";
  if (/primary mirror|secondary mirror/.test(n)) return "mirror";
  if (/ebony/.test(n)) return "laminate";
  if (/ptfe/.test(n)) return "ptfe";
  if (/timing belt/.test(n)) return "rubber";
  if (/foot \(/.test(n)) return "rubber";
  if (/nema|fan/.test(n)) return "black-anodized";
  if (/truss pole 686|bearing tower|pinion|belt disc/.test(n)) return "aluminum-brushed";
  if (/vane blade/.test(n)) return "steel-bright";
  if (/rocker|ground board|rear brace/.test(n)) return "plywood";
  if (/ring segment|standoff|pole clamp|vane end block|secondary holder|focuser mount|hub plate|truss shoe|bracket|mirror cell/.test(n))
    return "black-print";
  if (/shcs|hex nut|wood screw|dowel|pivot bolt|knob bolt|spring|mirror clip|part 1/.test(n))
    return "steel-bright";
  return "black-print";
}

function triCount(prim) {
  const idx = prim.getIndices();
  return idx ? idx.getCount() / 3 : prim.getAttribute("POSITION").getCount() / 3;
}

function primBounds(prim) {
  const pos = prim.getAttribute("POSITION").getArray();
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      if (pos[i + k] < min[k]) min[k] = pos[i + k];
      if (pos[i + k] > max[k]) max[k] = pos[i + k];
    }
  }
  return { min, max, size: max.map((v, k) => v - min[k]) };
}

/** Box-project UVs so the plywood texture reads on every face. */
function projectBoxUVs(doc, prim, scale = 3) {
  const pos = prim.getAttribute("POSITION").getArray();
  const nrmAttr = prim.getAttribute("NORMAL");
  const nrm = nrmAttr ? nrmAttr.getArray() : null;
  const count = pos.length / 3;
  const uv = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
    let ax = 2;
    if (nrm) {
      const nx = Math.abs(nrm[i * 3]), ny = Math.abs(nrm[i * 3 + 1]), nz = Math.abs(nrm[i * 3 + 2]);
      ax = nx >= ny && nx >= nz ? 0 : ny >= nz ? 1 : 2;
    }
    const [u, v] = ax === 0 ? [y, z] : ax === 1 ? [x, z] : [x, y];
    uv[i * 2] = u * scale;
    uv[i * 2 + 1] = v * scale;
  }
  const old = prim.getAttribute("TEXCOORD_0");
  const acc = doc
    .createAccessor()
    .setType(Accessor.Type.VEC2)
    .setArray(uv)
    .setBuffer(doc.getRoot().listBuffers()[0]);
  prim.setAttribute("TEXCOORD_0", acc);
  if (old) old.dispose();
}

/**
 * EZ GOTO altitude sector gear: a 94° wedge, R285 pitch radius, 6 mm
 * thick, teeth on the arc. Built in the y–z plane at x = X (outside the
 * −x rocker wall), apex on the altitude axis (y 0, z 0.27), pointing down.
 */
function addSectorGear(doc, scene, material, X = -0.243, cz = 0.27) {
  const R = 0.285, tooth = 0.0045, th = 0.006, r0 = 0.04;
  const half = (47 * Math.PI) / 180;
  const teeth = 104;
  const stepsPerTooth = 6;
  const steps = teeth * stepsPerTooth;
  const outer = [];
  const inner = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = -Math.PI / 2 - half + t * 2 * half; // angle from +y toward −z
    const ph = (i % stepsPerTooth) / stepsPerTooth;
    const bump = ph < 0.5 ? 1 : 0; // square-ish teeth
    const rr = R - tooth + tooth * bump;
    outer.push([Math.cos(a) * rr, Math.sin(a) * rr]);
    inner.push([Math.cos(a) * r0, Math.sin(a) * r0]);
  }
  const positions = [], normals = [], indices = [];
  const push = (y, z, x, n) => {
    positions.push(x, y, z);
    normals.push(...n);
    return positions.length / 3 - 1;
  };
  const front = [], back = [];
  for (let i = 0; i <= steps; i++) {
    front.push([push(inner[i][0], cz + inner[i][1], X + th, [1, 0, 0]), push(outer[i][0], cz + outer[i][1], X + th, [1, 0, 0])]);
    back.push([push(inner[i][0], cz + inner[i][1], X, [-1, 0, 0]), push(outer[i][0], cz + outer[i][1], X, [-1, 0, 0])]);
  }
  for (let i = 0; i < steps; i++) {
    const [a0, b0] = front[i], [a1, b1] = front[i + 1];
    indices.push(a0, b0, b1, a0, b1, a1);
    const [c0, d0] = back[i], [c1, d1] = back[i + 1];
    indices.push(c0, d1, d0, c0, c1, d1);
  }
  // rim walls (outer toothed arc + inner arc), flat-shaded
  const wall = (pa, pb, flip) => {
    const nx = 0, ny = pb[1] - pa[1], nz = -(pb[0] - pa[0]);
    const l = Math.hypot(ny, nz) || 1;
    const n = flip ? [nx, -ny / l, -nz / l] : [nx, ny / l, nz / l];
    const i0 = push(pa[0], cz + pa[1], X + th, n), i1 = push(pb[0], cz + pb[1], X + th, n);
    const i2 = push(pb[0], cz + pb[1], X, n), i3 = push(pa[0], cz + pa[1], X, n);
    if (flip) indices.push(i0, i2, i1, i0, i3, i2);
    else indices.push(i0, i1, i2, i0, i2, i3);
  };
  for (let i = 0; i < steps; i++) wall(outer[i], outer[i + 1], false);
  for (let i = 0; i < steps; i++) wall(inner[i], inner[i + 1], true);
  wall(inner[0], outer[0], true);
  wall(inner[steps], outer[steps], false);

  const buffer = doc.getRoot().listBuffers()[0];
  const prim = doc
    .createPrimitive()
    .setAttribute("POSITION", doc.createAccessor().setType(Accessor.Type.VEC3).setArray(new Float32Array(positions)).setBuffer(buffer))
    .setAttribute("NORMAL", doc.createAccessor().setType(Accessor.Type.VEC3).setArray(new Float32Array(normals)).setBuffer(buffer))
    .setIndices(doc.createAccessor().setType(Accessor.Type.SCALAR).setArray(new Uint32Array(indices)).setBuffer(buffer))
    .setMaterial(material);
  const mesh = doc.createMesh("ALT Sector Gear R285").addPrimitive(prim);
  scene.addChild(doc.createNode("aluminum-brushed::ALT Sector Gear R285").setMesh(mesh));
}

/** 70 mm minor-axis elliptical flat, bonded to the secondary holder. */
function addSecondaryFlat(doc, scene, material, holderCenter, focuserDir) {
  const z = [0, 0, 1];
  const f = focuserDir;
  const norm = (v) => {
    const l = Math.hypot(...v);
    return v.map((c) => c / l);
  };
  const n = norm([f[0] + z[0], f[1] + z[1], f[2] + z[2]]);
  const u = norm([f[0] - z[0], f[1] - z[1], f[2] - z[2]]);
  const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
  const a = 0.0495, b = 0.035, th = 0.008;
  const c = holderCenter.map((p, i) => p + n[i] * 0.024);
  const seg = 56;
  const positions = [];
  const normals = [];
  const indices = [];
  // front face (offset +0) and back face (offset -th)
  for (const side of [0, 1]) {
    const off = side === 0 ? 0 : -th;
    const sn = side === 0 ? n : n.map((x) => -x);
    const base = positions.length / 3;
    positions.push(c[0] + n[0] * off, c[1] + n[1] * off, c[2] + n[2] * off);
    normals.push(...sn);
    for (let i = 0; i < seg; i++) {
      const t = (i / seg) * Math.PI * 2;
      const ca = Math.cos(t) * a, sb = Math.sin(t) * b;
      positions.push(
        c[0] + u[0] * ca + v[0] * sb + n[0] * off,
        c[1] + u[1] * ca + v[1] * sb + n[1] * off,
        c[2] + u[2] * ca + v[2] * sb + n[2] * off,
      );
      normals.push(...sn);
    }
    for (let i = 0; i < seg; i++) {
      const i0 = base + 1 + i, i1 = base + 1 + ((i + 1) % seg);
      if (side === 0) indices.push(base, i0, i1);
      else indices.push(base, i1, i0);
    }
  }
  // rim
  const rimBase = positions.length / 3;
  for (let i = 0; i < seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    const ca = Math.cos(t) * a, sb = Math.sin(t) * b;
    const rn = norm([u[0] * ca / a + v[0] * sb / b, u[1] * ca / a + v[1] * sb / b, u[2] * ca / a + v[2] * sb / b]);
    for (const off of [0, -th]) {
      positions.push(
        c[0] + u[0] * ca + v[0] * sb + n[0] * off,
        c[1] + u[1] * ca + v[1] * sb + n[1] * off,
        c[2] + u[2] * ca + v[2] * sb + n[2] * off,
      );
      normals.push(...rn);
    }
  }
  for (let i = 0; i < seg; i++) {
    const a0 = rimBase + i * 2, a1 = a0 + 1;
    const b0 = rimBase + ((i + 1) % seg) * 2, b1 = b0 + 1;
    indices.push(a0, b0, a1, a1, b0, b1);
  }
  const buffer = doc.getRoot().listBuffers()[0];
  const prim = doc
    .createPrimitive()
    .setAttribute("POSITION", doc.createAccessor().setType(Accessor.Type.VEC3).setArray(new Float32Array(positions)).setBuffer(buffer))
    .setAttribute("NORMAL", doc.createAccessor().setType(Accessor.Type.VEC3).setArray(new Float32Array(normals)).setBuffer(buffer))
    .setIndices(doc.createAccessor().setType(Accessor.Type.SCALAR).setArray(new Uint32Array(indices)).setBuffer(buffer))
    .setMaterial(material);
  const mesh = doc.createMesh("Secondary Mirror 70mm").addPrimitive(prim);
  const node = doc.createNode("Secondary Mirror 70mm").setMesh(mesh);
  scene.addChild(node);
}

function colMajor(rm) {
  // row-major 4x4 -> column-major flat array
  const out = new Array(16);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out[c * 4 + r] = rm[r * 4 + c];
  return out;
}

async function main() {
  await MeshoptSimplifier.ready;
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ "draco3d.encoder": await draco3d.createEncoderModule() });

  const doc = await io.read(path.join(SRC, "asm00.gltf"));
  const root = doc.getRoot();
  const scene = root.listScenes()[0];

  // Every node we emit gets tagged with a context so classify() can tell
  // an unnamed "Part 1" in the mirror box from one in the UTA.
  const ctxOf = new Map();
  const tagTree = (node, ctx) => {
    const own = /^ASM 01/.test(node.getName()) ? "uta" : ctx;
    ctxOf.set(node, own);
    node.listChildren().forEach((c) => tagTree(c, own));
  };
  scene.listChildren().forEach((n) => tagTree(n, "asm00"));

  // 1. re-centre the UTA
  for (const n of root.listNodes()) {
    if (/^ASM 01/.test(n.getName())) {
      const t = n.getTranslation();
      n.setTranslation([t[0] + UTA_SHIFT[0], t[1] + UTA_SHIFT[1], t[2] + UTA_SHIFT[2]]);
      console.log("UTA shifted", n.getName(), t, "->", n.getTranslation());
    }
  }

  // 2. compose the parts ASM 00 lost
  const extras = [
    { file: "mirror-box-v3.gltf", ctx: "mirror-box", xform: MIRROR_BOX_XFORM },
    { file: "mirror-cell-v2.gltf", ctx: "mirror-cell", xform: MIRROR_CELL_XFORM },
    { file: "alt-bearing-hub.gltf", ctx: "hub", xform: HUB_POS_XFORM },
    { file: "alt-bearing-hub.gltf", ctx: "hub", xform: HUB_NEG_XFORM },
    { file: "fan-80.gltf", ctx: "fan", xform: FAN_XFORM },
  ];
  for (const ex of extras) {
    const src = await io.read(path.join(SRC, ex.file));
    mergeDocuments(doc, src);
    const scenes = root.listScenes();
    const merged = scenes[scenes.length - 1];
    const parent = doc.createNode(`${ex.ctx}`).setMatrix(colMajor(ex.xform));
    for (const child of merged.listChildren()) parent.addChild(child);
    merged.dispose();
    scene.addChild(parent);
    tagTree(parent, ex.ctx);
    console.log("composed", ex.file, "as", ex.ctx);
  }

  // Drop the two integral bearing hubs of Mirror Box v3 (ASM 00 carries
  // its own hubs on the bearing plates); they are the 2116-triangle parts.
  for (const n of root.listNodes()) {
    if (ctxOf.get(n) === "mirror-box" && n.getMesh()) {
      const t = n.getMesh().listPrimitives().reduce((s, p) => s + triCount(p), 0);
      if (t === 2116) {
        console.log("dropping mirror-box hub", n.getName());
        n.dispose();
      }
    }
  }

  // 3. drop UTA parts that float outside the cage (WIP placements in ASM 01)
  {
    const utaNode = root.listNodes().find((n) => /^ASM 01/.test(n.getName()));
    const dropped = [];
    for (const n of root.listNodes()) {
      if (ctxOf.get(n) !== "uta" || !n.getMesh() || n === utaNode) continue;
      const b = getBounds(n);
      const cx = (b.min[0] + b.max[0]) / 2, cy = (b.min[1] + b.max[1]) / 2, cz = (b.min[2] + b.max[2]) / 2;
      const r = Math.hypot(cx, cy);
      if (r > 0.2 || cz < 0.85 || cz > 1.1) {
        dropped.push(`${n.getName()} r=${r.toFixed(3)} z=${cz.toFixed(3)}`);
        n.dispose();
      }
    }
    console.log(`dropped ${dropped.length} stray UTA parts:`, dropped.join("; "));
  }

  // 4. materials by family, box UVs on plywood
  const mats = {};
  for (const [name, rgb] of Object.entries(FAMILIES)) {
    mats[name] = doc
      .createMaterial(name)
      .setBaseColorFactor([...rgb, 1])
      .setMetallicFactor(/aluminum|steel|mirror/.test(name) ? 1 : 0)
      .setRoughnessFactor(name === "mirror" ? 0.05 : 0.6)
      .setDoubleSided(true);
  }
  const familyOfMesh = new Map();
  for (const n of root.listNodes()) {
    const mesh = n.getMesh();
    if (!mesh) continue;
    const fam = classify(n.getName(), ctxOf.get(n));
    familyOfMesh.set(mesh, fam);
    n.setName(`${fam}::${n.getName()}`);
  }
  for (const [mesh, fam] of familyOfMesh) {
    for (const p of mesh.listPrimitives()) {
      p.setMaterial(mats[fam]);
      if (fam === "plywood") projectBoxUVs(doc, p);
    }
  }

  addSectorGear(doc, scene, mats["aluminum-brushed"]);
  console.log("sector gear built");

  // 5. secondary flat — holder centre after the UTA shift, focuser azimuth
  let holderCenter = null;
  let focuserCenter = null;
  for (const n of root.listNodes()) {
    if (/Secondary Holder/.test(n.getName())) {
      const b = getBounds(n);
      holderCenter = b.min.map((v, i) => (v + b.max[i]) / 2);
    }
    if (/Focuser Mount/.test(n.getName())) {
      const b = getBounds(n);
      focuserCenter = b.min.map((v, i) => (v + b.max[i]) / 2);
    }
  }
  if (holderCenter && focuserCenter) {
    const fd = [focuserCenter[0], focuserCenter[1], 0];
    const l = Math.hypot(fd[0], fd[1]);
    addSecondaryFlat(doc, scene, mats.mirror, holderCenter, [fd[0] / l, fd[1] / l, 0]);
    console.log("secondary flat at", holderCenter.map((v) => v.toFixed(3)), "toward", (Math.atan2(fd[1], fd[0]) * 180 / Math.PI).toFixed(0), "deg");
  } else {
    console.warn("secondary holder / focuser not found; no secondary flat added");
  }

  // 6. join Onshape's per-face primitives into one per mesh, then weld +
  //    simplify by class (per-face primitives cannot be simplified)
  for (const mesh of root.listMeshes()) {
    const fam = familyOfMesh.get(mesh);
    const prims = mesh.listPrimitives();
    // only plywood keeps UVs (box-projected above); everything else is untextured
    if (fam !== "plywood") {
      for (const p of prims) {
        const uv = p.getAttribute("TEXCOORD_0");
        if (uv) { p.setAttribute("TEXCOORD_0", null); uv.dispose(); }
      }
    }
    if (prims.length < 2) continue;
    try {
      const joined = joinPrimitives(prims);
      for (const p of prims) { mesh.removePrimitive(p); p.dispose(); }
      mesh.addPrimitive(joined);
    } catch (e) {
      console.warn("join failed for", mesh.getName(), fam, prims.length, "prims:", e.message);
    }
  }
  await doc.transform(weld());
  let before = 0, after = 0;
  const stats = [];
  for (const mesh of root.listMeshes()) {
    const fam = familyOfMesh.get(mesh) ?? "mirror";
    for (const p of mesh.listPrimitives()) {
      const t = triCount(p);
      before += t;
      const { size } = primBounds(p);
      const maxDim = Math.max(...size);
      let ratio = 1, error = 0.001;
      if (/steel/.test(fam) && t > 400) {
        // threaded fasteners: keep the silhouette, drop the threads
        ratio = Math.min(1, 320 / t); error = 1;
      } else if (maxDim < 0.07 && t > 1500) {
        ratio = Math.min(1, 900 / t); error = 0.2;
      } else if (t > 20000) {
        // vendor STEPs (motors, fan, gear)
        ratio = Math.min(1, 6000 / t); error = 0.05;
      } else if (t > 3000) {
        ratio = 0.5; error = 0.01;
      }
      if (ratio < 1) simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio, error, lockBorder: false });
      after += triCount(p);
      stats.push([triCount(p), t, fam, mesh.getName().slice(0, 40)]);
    }
  }
  console.log(`triangles (unique meshes): ${before} -> ${after}`);
  stats.sort((a, b) => b[0] - a[0]);
  for (const r of stats.slice(0, 14)) console.log("  ", r.join("  "));
  // render triangle count (instances)
  let render = 0;
  for (const n of root.listNodes()) if (n.getMesh()) for (const p of n.getMesh().listPrimitives()) render += triCount(p);
  console.log(`render triangles: ${render}`);

  await doc.transform(dedup(), prune(), unpartition());

  // 7. anchors for the choreography (Z-up metres, before any runtime rotation)
  const anchors = {};
  const groups = {
    scene: /./,
    rocker: /Rocker Side Wall/,
    groundBoard: /Ground Board/,
    mirrorBox: /^plywood::.*(Part 1)/,
    primaryMirror: /Primary Mirror/,
    secondary: /Secondary Mirror 70mm/,
    altMotor: /NEMA 23 23HS30-2804S$/,
    azMotor: /NEMA 17/,
    sectorGear: /ALT Sector Gear R285/,
    focuser: /Focuser Mount/,
    utaRing: /Ring Segment/,
    trussPoles: /Truss Pole 686/,
    bearingPlates: /Bearing Tower Plate/,
  };
  for (const [key, re] of Object.entries(groups)) {
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    let hit = 0;
    for (const n of root.listNodes()) {
      if (!n.getMesh() || !re.test(n.getName())) continue;
      const b = getBounds(n);
      hit++;
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], b.min[k]);
        max[k] = Math.max(max[k], b.max[k]);
      }
    }
    if (hit) anchors[key] = { min: min.map((v) => +v.toFixed(4)), max: max.map((v) => +v.toFixed(4)), n: hit };
  }
  await mkdir(path.dirname(OUT_ANCHORS), { recursive: true });
  await writeFile(OUT_ANCHORS, JSON.stringify(anchors, null, 1));
  console.log("anchors", anchors);

  // 8. compress + write
  doc.createExtension(KHRDracoMeshCompression).setRequired(true);
  await doc.transform(draco({ method: "edgebreaker", quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
  await mkdir(path.dirname(OUT_GLB), { recursive: true });
  await io.write(OUT_GLB, doc);
  const nodes = root.listNodes().filter((n) => n.getMesh()).length;
  console.log(`wrote ${OUT_GLB}: ${nodes} mesh nodes`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
