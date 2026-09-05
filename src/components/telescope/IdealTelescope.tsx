"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RING_AZIMUTHS, SHOE_AZIMUTHS, SPEC, rimPoint } from "./spec";
import type { Materials } from "./materials";

type V3 = [number, number, number];

/** Cylinder between two points, axis along the segment. */
function Rod({ from, to, r, material, segments = 24 }: { from: V3; to: V3; r: number; material: THREE.Material; segments?: number }) {
  const { pos, quat, len } = useMemo(() => {
    const f = new THREE.Vector3(...from);
    const t = new THREE.Vector3(...to);
    const d = t.clone().sub(f);
    const len = d.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    return { pos: f.add(t).multiplyScalar(0.5), quat, len };
  }, [from, to]);
  return (
    <mesh position={pos} quaternion={quat} material={material} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, len, segments]} />
    </mesh>
  );
}

function useRoundedBox(w: number, h: number, d: number, r = 0.003) {
  return useMemo(() => new RoundedBoxGeometry(w, h, d, 3, r), [w, h, d, r]);
}

function Slab({ size, position, rotation, material, radius = 0.003 }: { size: V3; position: V3; rotation?: V3; material: THREE.Material; radius?: number }) {
  const geo = useRoundedBox(size[0], size[1], size[2], radius);
  return <mesh geometry={geo} position={position} rotation={rotation} material={material} castShadow receiveShadow />;
}

/** Flat ring lying in the x–z plane. */
function useRingGeometry(rIn: number, rOut: number, h: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, rOut, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, rIn, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 96 });
    g.rotateX(Math.PI / 2);
    g.translate(0, h / 2, 0);
    return g;
  }, [rIn, rOut, h]);
}

/** Altitude bearing: a half-disc below the axis with a straight-topped plate above it. */
function useBearingGeometry() {
  const { r, ply, top } = SPEC.bearing;
  const up = top - SPEC.altAxisY;
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-r, up);
    shape.lineTo(-r, 0);
    shape.absarc(0, 0, r, Math.PI, Math.PI * 2, false);
    shape.lineTo(r, up);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: ply, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 2, curveSegments: 96 });
    g.rotateY(Math.PI / 2); // extrude along x
    g.translate(-ply / 2, 0, 0);
    return g;
  }, [r, ply, up]);
}

/** Smooth altitude sector: an arc plate on the outer face of one bearing. */
function useSectorGeometry(rOut: number, width: number, th: number) {
  return useMemo(() => {
    const a0 = Math.PI + 0.35, a1 = 2 * Math.PI - 0.35;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, rOut, a0, a1, false);
    shape.absarc(0, 0, rOut - width, a1, a0, true);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: th, bevelEnabled: false, curveSegments: 96 });
    g.rotateY(-Math.PI / 2); // plate normal along −x, extruded outward
    return g;
  }, [rOut, width, th]);
}

function useEllipseGeometry(a: number, b: number, th: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, a, b, 0, Math.PI * 2, false, 0);
    const g = new THREE.ExtrudeGeometry(shape, { depth: th, bevelEnabled: false, curveSegments: 64 });
    g.translate(0, 0, -th);
    return g;
  }, [a, b, th]);
}

export default function IdealTelescope({ m }: { m: Materials }) {
  const S = SPEC;
  const ringGeo = useRingGeometry(S.cage.rIn, S.cage.rOut, S.cage.h);
  const bearingGeo = useBearingGeometry();
  const secondaryGeo = useEllipseGeometry(S.secondary.a, S.secondary.b, 0.0012);
  const secondaryBackGeo = useEllipseGeometry(S.secondary.a + 0.003, S.secondary.b + 0.003, 0.008);
  const motorGeo = useRoundedBox(0.076, 0.057, 0.057, 0.004);
  const azMotorGeo = useRoundedBox(0.042, 0.048, 0.042, 0.003);
  const enclosureGeo = useRoundedBox(0.15, 0.07, 0.03, 0.004);
  const sectorGeo = useSectorGeometry(S.bearing.r - 0.012, 0.028, 0.005);

  const boxTop = S.mirrorBox.top;
  const half = S.mirrorBox.half;
  const ply = S.mirrorBox.ply;

  // Truss geometry: shoes on the box rim, pairs meeting at three ring points.
  const poles = useMemo(() => {
    const out: { from: V3; to: V3 }[] = [];
    const ringR = S.cage.rIn - 0.004;
    SHOE_AZIMUTHS.forEach((az, i) => {
      const [sx, sz] = rimPoint(az, half - ply / 2);
      const targets = [RING_AZIMUTHS[i], RING_AZIMUTHS[(i + 1) % 3]];
      for (const t of targets) {
        out.push({
          from: [sx, boxTop - 0.02, sz],
          to: [Math.cos(t) * ringR, S.cage.lowerY + S.cage.h, Math.sin(t) * ringR],
        });
      }
    });
    return out;
  }, [S, half, ply, boxTop]);

  const focuserDir = useMemo(() => new THREE.Vector3(Math.cos(S.focuserAzimuth), 0, Math.sin(S.focuserAzimuth)), [S.focuserAzimuth]);
  const focuserY = (S.cage.lowerY + S.cage.upperY) / 2;
  const focuserQuat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), focuserDir),
    [focuserDir],
  );
  // Secondary flat: normal bisects "down the tube" and "out to the focuser".
  const secondaryQuat = useMemo(() => {
    const n = focuserDir.clone().add(new THREE.Vector3(0, 1, 0)).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  }, [focuserDir]);

  const padZ = S.bearing.r * Math.sin(S.pad.angle);
  const padY = S.rocker.wallTop + 0.005;

  return (
    <group>
      {/* ── Base ─────────────────────────────────────────────── */}
      {[0, 1, 2].map((i) => {
        const a = Math.PI / 2 + (i * 2 * Math.PI) / 3;
        return (
          <mesh key={i} position={[Math.cos(a) * S.foot.ring, S.foot.h / 2, Math.sin(a) * S.foot.ring]} material={m.rubber} castShadow>
            <cylinderGeometry args={[S.foot.r, S.foot.r * 0.9, S.foot.h, 32]} />
          </mesh>
        );
      })}
      <mesh position={[0, S.groundBoard.y + S.groundBoard.h / 2, 0]} material={m.plywood} castShadow receiveShadow>
        <cylinderGeometry args={[S.groundBoard.r, S.groundBoard.r, S.groundBoard.h, 128]} />
      </mesh>
      <mesh position={[0, S.groundBoard.y + S.groundBoard.h + S.azBearing.h / 2, 0]} material={m.laminate} receiveShadow>
        <cylinderGeometry args={[S.azBearing.r, S.azBearing.r, S.azBearing.h, 128]} />
      </mesh>

      {/* ── Rocker box ───────────────────────────────────────── */}
      <Slab size={[S.rocker.wallX * 2 + S.rocker.ply, S.rocker.ply, S.rocker.floorSize]} position={[0, S.rocker.floorY + S.rocker.ply / 2, 0]} material={m.plywood} />
      {[-1, 1].map((sgn) => (
        <Slab
          key={sgn}
          size={[S.rocker.ply, S.rocker.wallTop - S.rocker.floorY, S.rocker.wallDepth]}
          position={[sgn * S.rocker.wallX, (S.rocker.wallTop + S.rocker.floorY) / 2, 0]}
          material={m.plywood}
        />
      ))}
      {/* front and rear braces */}
      {[-1, 1].map((sgn) => (
        <Slab
          key={sgn}
          size={[S.rocker.wallX * 2 - S.rocker.ply, 0.09, S.rocker.ply]}
          position={[0, S.rocker.floorY + S.rocker.ply + 0.045, sgn * (S.rocker.wallDepth / 2 - S.rocker.ply / 2)]}
          material={m.plywood}
        />
      ))}
      {/* PTFE pads on the wall tops */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * S.rocker.wallX, padY, sz * padZ]} material={m.ptfe} castShadow>
            <boxGeometry args={[0.03, 0.01, 0.05]} />
          </mesh>
        )),
      )}

      {/* ── Mirror box ───────────────────────────────────────── */}
      <Slab size={[half * 2, ply, half * 2]} position={[0, S.mirrorBox.bottom + ply / 2, 0]} material={m.plywood} />
      {[-1, 1].map((sgn) => (
        <Slab key={`x${sgn}`} size={[ply, boxTop - S.mirrorBox.bottom, half * 2]} position={[sgn * (half - ply / 2), (boxTop + S.mirrorBox.bottom) / 2, 0]} material={m.plywood} />
      ))}
      {[-1, 1].map((sgn) => (
        <Slab key={`z${sgn}`} size={[half * 2 - ply * 2, boxTop - S.mirrorBox.bottom, ply]} position={[0, (boxTop + S.mirrorBox.bottom) / 2, sgn * (half - ply / 2)]} material={m.plywood} />
      ))}
      {/* altitude bearings */}
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} geometry={bearingGeo} position={[sgn * S.bearing.x, S.altAxisY, 0]} material={m.plywood} castShadow receiveShadow />
      ))}
      {/* bearing spacers */}
      {[-1, 1].flatMap((sgn) =>
        [-0.1, 0.1].map((z) => (
          <mesh key={`${sgn}${z}`} position={[sgn * (half + (S.bearing.x - S.bearing.ply / 2 - half) / 2), S.altAxisY - 0.05, z]} material={m.black}>
            <boxGeometry args={[S.bearing.x - S.bearing.ply / 2 - half, 0.06, 0.05]} />
          </mesh>
        )),
      )}

      {/* mirror cell and primary */}
      <mesh position={[0, S.mirrorBox.bottom + ply + 0.012, 0]} material={m.blackMatte} receiveShadow>
        <cylinderGeometry args={[0.142, 0.142, 0.024, 96]} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = Math.PI / 6 + (i * 2 * Math.PI) / 3;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.09, S.mirrorBox.bottom + ply + 0.03, Math.sin(a) * 0.09]} material={m.black}>
            <cylinderGeometry args={[0.012, 0.012, 0.012, 24]} />
          </mesh>
        );
      })}
      <mesh position={[0, S.primary.y + S.primary.h / 2, 0]} material={m.glass} castShadow receiveShadow>
        <cylinderGeometry args={[S.primary.r, S.primary.r, S.primary.h, 128]} />
      </mesh>
      <mesh position={[0, S.primary.y + S.primary.h + 0.0006, 0]} material={m.mirror}>
        <cylinderGeometry args={[S.primary.r - 0.002, S.primary.r - 0.002, 0.0012, 128]} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = Math.PI / 2 + (i * 2 * Math.PI) / 3;
        return (
          <mesh key={i} position={[Math.cos(a) * (S.primary.r - 0.006), S.primary.y + S.primary.h + 0.003, Math.sin(a) * (S.primary.r - 0.006)]} rotation={[0, -a, 0]} material={m.black}>
            <boxGeometry args={[0.02, 0.004, 0.012]} />
          </mesh>
        );
      })}

      {/* ── Truss ────────────────────────────────────────────── */}
      {SHOE_AZIMUTHS.map((az, i) => {
        const [sx, sz] = rimPoint(az, half - ply / 2);
        return (
          <mesh key={i} position={[sx, boxTop - 0.03, sz]} rotation={[0, -az + Math.PI / 2, 0]} material={m.black} castShadow>
            <boxGeometry args={[0.07, 0.06, 0.03]} />
          </mesh>
        );
      })}
      {poles.map((p, i) => (
        <Rod key={i} from={p.from} to={p.to} r={S.pole.r} material={m.aluminum} />
      ))}
      {RING_AZIMUTHS.map((az, i) => (
        <mesh key={i} position={[Math.cos(az) * (S.cage.rIn - 0.004), S.cage.lowerY - 0.012, Math.sin(az) * (S.cage.rIn - 0.004)]} rotation={[0, -az, 0]} material={m.black} castShadow>
          <boxGeometry args={[0.03, 0.05, 0.062]} />
        </mesh>
      ))}

      {/* ── Upper cage ───────────────────────────────────────── */}
      <mesh geometry={ringGeo} position={[0, S.cage.lowerY, 0]} material={m.black} castShadow receiveShadow />
      <mesh geometry={ringGeo} position={[0, S.cage.upperY, 0]} material={m.black} castShadow receiveShadow />
      {SHOE_AZIMUTHS.map((az, i) => {
        const r = (S.cage.rIn + S.cage.rOut) / 2;
        return (
          <Rod
            key={i}
            from={[Math.cos(az) * r, S.cage.lowerY + S.cage.h / 2, Math.sin(az) * r]}
            to={[Math.cos(az) * r, S.cage.upperY - S.cage.h / 2, Math.sin(az) * r]}
            r={0.009}
            material={m.black}
          />
        );
      })}
      {/* spider */}
      {SHOE_AZIMUTHS.map((az, i) => {
        const len = S.cage.rIn - S.spider.hubR + 0.004;
        const mid = S.spider.hubR + len / 2 - 0.002;
        return (
          <mesh key={i} position={[Math.cos(az) * mid, S.spider.y, Math.sin(az) * mid]} rotation={[0, -az, 0]} material={m.steel}>
            <boxGeometry args={[len, 0.022, 0.0008]} />
          </mesh>
        );
      })}
      <mesh position={[0, S.spider.y, 0]} material={m.black} castShadow>
        <cylinderGeometry args={[S.spider.hubR, S.spider.hubR, 0.03, 48]} />
      </mesh>
      {/* secondary holder and the 45° flat beneath it */}
      <mesh position={[0, S.spider.y - 0.035, 0]} material={m.black} castShadow>
        <cylinderGeometry args={[0.03, 0.033, 0.04, 48]} />
      </mesh>
      <group position={[0, S.secondary.y, 0]} quaternion={secondaryQuat}>
        <mesh geometry={secondaryBackGeo} material={m.black} castShadow />
        <mesh geometry={secondaryGeo} position={[0, 0, 0.0006]} material={m.mirror} />
      </group>

      {/* focuser and camera */}
      <group position={[0, focuserY, 0]}>
        <mesh position={[focuserDir.x * (S.cage.rOut + 0.012), 0, focuserDir.z * (S.cage.rOut + 0.012)]} quaternion={focuserQuat} material={m.black} castShadow>
          <boxGeometry args={[0.07, 0.03, 0.07]} />
        </mesh>
        <mesh position={[focuserDir.x * (S.cage.rOut + 0.06), 0, focuserDir.z * (S.cage.rOut + 0.06)]} quaternion={focuserQuat} material={m.aluminum} castShadow>
          <cylinderGeometry args={[0.027, 0.027, 0.07, 48]} />
        </mesh>
        <mesh position={[focuserDir.x * (S.cage.rOut + 0.1), 0, focuserDir.z * (S.cage.rOut + 0.1)]} quaternion={focuserQuat} material={m.accent}>
          <cylinderGeometry args={[0.041, 0.041, 0.008, 48]} />
        </mesh>
        <mesh position={[focuserDir.x * (S.cage.rOut + 0.146), 0, focuserDir.z * (S.cage.rOut + 0.146)]} quaternion={focuserQuat} material={m.anodized} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.084, 48]} />
        </mesh>
        <mesh position={[focuserDir.x * (S.cage.rOut + 0.19), 0, focuserDir.z * (S.cage.rOut + 0.19)]} quaternion={focuserQuat} material={m.blackMatte}>
          <cylinderGeometry args={[0.03, 0.036, 0.006, 48]} />
        </mesh>
      </group>

      {/* ── Drive and electronics ────────────────────────────── */}
      {/* altitude drive: a smooth sector arc on the −x bearing, driven by a NEMA 23 on the rocker wall */}
      <mesh geometry={sectorGeo} position={[-(S.bearing.x + S.bearing.ply / 2 + 0.003), S.altAxisY, 0]} material={m.anodized} castShadow />
      <group position={[-(S.rocker.wallX + S.rocker.ply / 2), S.altAxisY - S.bearing.r - 0.03, 0.02]}>
        <mesh geometry={motorGeo} position={[-0.048, 0, 0]} material={m.anodized} castShadow />
        <mesh position={[-0.006, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.steel}>
          <cylinderGeometry args={[0.019, 0.019, 0.006, 40]} />
        </mesh>
        <mesh position={[-0.0015, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.steel}>
          <cylinderGeometry args={[0.012, 0.012, 0.012, 32]} />
        </mesh>
      </group>
      {/* control enclosure on the rear brace, one status LED */}
      <group position={[-0.08, S.rocker.floorY + 0.06, -(S.rocker.wallDepth / 2 + 0.016)]}>
        <mesh geometry={enclosureGeo} material={m.anodized} castShadow />
        <mesh position={[0.058, 0.02, -0.016]} rotation={[Math.PI / 2, 0, 0]} material={m.led}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.002, 12]} />
        </mesh>
        {/* cable down to the floor */}
        <Rod from={[-0.06, -0.035, 0]} to={[-0.06, -0.06, 0.04]} r={0.003} material={m.rubber} segments={12} />
      </group>
      {/* azimuth motor tucked under the rocker floor */}
      <mesh geometry={azMotorGeo} position={[0.16, S.rocker.floorY - 0.028, 0.14]} material={m.anodized} castShadow />
    </group>
  );
}
