"use client";

import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { PI_Z, RING_AZIMUTHS, SHOE_AZIMUTHS, SPEC, rimPoint } from "./spec";
import { boxUV, type Materials } from "./materials";
import PiBoard, { PI_HOLES } from "./PiBoard";
import StepperDriver from "./StepperDriver";

type V3 = [number, number, number];
const S = SPEC;
const Y = new THREE.Vector3(0, 1, 0);
const q = (dir: V3) => new THREE.Quaternion().setFromUnitVectors(Y, new THREE.Vector3(...dir).normalize());
const Q = { px: q([1, 0, 0]), nx: q([-1, 0, 0]), pz: q([0, 0, 1]), nz: q([0, 0, -1]) };

/* ── small geometry helpers ─────────────────────────────────────── */

/** Cylinder between two points, axis along the segment. */
function Rod({ from, to, r, material, segments = 28 }: { from: V3; to: V3; r: number; material: THREE.Material; segments?: number }) {
  const { pos, quat, len } = useMemo(() => {
    const f = new THREE.Vector3(...from);
    const t = new THREE.Vector3(...to);
    const d = t.clone().sub(f);
    const len = d.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(Y, d.normalize());
    return { pos: f.add(t).multiplyScalar(0.5), quat, len };
  }, [from, to]);
  return (
    <mesh position={pos} quaternion={quat} material={material} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, len, segments]} />
    </mesh>
  );
}

function useSheet(w: number, h: number, d: number, r = 0.0015) {
  return useMemo(() => boxUV(new RoundedBoxGeometry(w, h, d, 3, r)), [w, h, d, r]);
}

/** Machined plate with a small chamfer and brushed grain at world scale. */
function Plate({ size, position, rotation, material, radius }: { size: V3; position: V3; rotation?: V3; material: THREE.Material; radius?: number }) {
  const geo = useSheet(size[0], size[1], size[2], radius);
  return <mesh geometry={geo} position={position} rotation={rotation} material={material} castShadow receiveShadow />;
}

/** Socket-head cap screw, axis along `dir`, head sitting on the surface. */
function Screw({ position, dir, material, socket, r = 0.0035 }: { position: V3; dir: V3; material: THREE.Material; socket: THREE.Material; r?: number }) {
  const quat = useMemo(() => q(dir), [dir]);
  return (
    <group position={position} quaternion={quat}>
      <mesh position={[0, 0.0015, 0]} material={material} castShadow>
        <cylinderGeometry args={[r, r, 0.003, 24]} />
      </mesh>
      <mesh position={[0, 0.0031, 0]} material={socket}>
        <cylinderGeometry args={[r * 0.45, r * 0.45, 0.0006, 6]} />
      </mesh>
    </group>
  );
}

function extrude(shape: THREE.Shape, depth: number, bevel = 0.0012) {
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 2,
    curveSegments: 96,
  });
}

/** Flat ring lying in the x–z plane. */
function useRingGeometry(rIn: number, rOut: number, h: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, rOut, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, rIn, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = extrude(shape, h, 0.0015);
    g.rotateX(Math.PI / 2);
    g.translate(0, h / 2, 0);
    return g;
  }, [rIn, rOut, h]);
}

/** Rocker side plate: cradle top edge plus a round lightening hole, extruded along x. */
function useRockerSideGeometry() {
  const { floorY, plate, wallDepth, cradleR, cutout } = S.rocker;
  return useMemo(() => {
    const hz = wallDepth / 2;
    const cy = S.altAxisY - floorY;
    const th0 = -Math.acos(hz / cradleR);
    const th1 = -Math.PI - th0;
    const shape = new THREE.Shape();
    shape.moveTo(-hz, 0);
    shape.lineTo(hz, 0);
    shape.lineTo(hz, cy + cradleR * Math.sin(th0));
    const steps = 72;
    for (let i = 1; i <= steps; i++) {
      const th = th0 + (i / steps) * (th1 - th0);
      shape.lineTo(cradleR * Math.cos(th), cy + cradleR * Math.sin(th));
    }
    shape.lineTo(-hz, 0);
    const hole = new THREE.Path();
    hole.absarc(0, cutout.y - floorY, cutout.r, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = extrude(shape, plate, 0.0012);
    g.rotateY(-Math.PI / 2);
    g.translate(plate / 2, 0, 0);
    return boxUV(g);
  }, [floorY, plate, wallDepth, cradleR, cutout]);
}

/** Front plate of the rocker with a half-round hand cutout at the top. */
function useRockerFrontGeometry(width: number) {
  const { plate, front } = S.rocker;
  return useMemo(() => {
    const shape = new THREE.Shape();
    const hw = width / 2;
    shape.moveTo(-hw, 0);
    shape.lineTo(hw, 0);
    shape.lineTo(hw, front.h);
    shape.lineTo(front.handleR, front.h);
    shape.absarc(0, front.h, front.handleR, 0, Math.PI, true);
    shape.lineTo(-hw, front.h);
    shape.closePath();
    const g = extrude(shape, plate, 0.0012);
    g.translate(0, 0, -plate / 2);
    return boxUV(g);
  }, [width, plate, front]);
}

/** Altitude bearing: a half-disc below the axis with a short plate above it. */
function useBearingGeometry() {
  const { r, plate, top } = S.bearing;
  const up = top - S.altAxisY;
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-r, up);
    shape.lineTo(-r, 0);
    shape.absarc(0, 0, r, Math.PI, Math.PI * 2, false);
    shape.lineTo(r, up);
    shape.closePath();
    const g = extrude(shape, plate, 0.0012);
    g.rotateY(Math.PI / 2);
    g.translate(-plate / 2, 0, 0);
    return boxUV(g);
  }, [r, plate, up]);
}

/** Laminate rim bonded to the running edge of a bearing. */
function useBearingRimGeometry() {
  const { r, plate, rim } = S.bearing;
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, r + 0.0015, Math.PI, Math.PI * 2, false);
    shape.absarc(0, 0, r - rim, Math.PI * 2, Math.PI, true);
    shape.closePath();
    const g = extrude(shape, plate + 0.003, 0);
    g.rotateY(Math.PI / 2);
    g.translate(-(plate + 0.003) / 2, 0, 0);
    return g;
  }, [r, plate, rim]);
}

/** Smooth altitude sector: an arc plate on the outer face of one bearing. */
function useSectorGeometry(rOut: number, width: number, th: number) {
  return useMemo(() => {
    const a0 = Math.PI + 0.35, a1 = 2 * Math.PI - 0.35;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, rOut, a0, a1, false);
    shape.absarc(0, 0, rOut - width, a1, a0, true);
    shape.closePath();
    const g = extrude(shape, th, 0);
    g.rotateY(-Math.PI / 2);
    return g;
  }, [rOut, width, th]);
}

function useEllipseGeometry(a: number, b: number, th: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, a, b, 0, Math.PI * 2, false, 0);
    const g = extrude(shape, th, 0);
    g.translate(0, 0, -th);
    return g;
  }, [a, b, th]);
}

/** Thumb knob: knurled cylinder with a domed cap. */
function Knob({ position, quaternion, material }: { position: V3; quaternion?: THREE.Quaternion; material: THREE.Material }) {
  return (
    <group position={position} quaternion={quaternion}>
      <mesh position={[0, 0.004, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.0085, 0.0085, 0.008, 24]} />
      </mesh>
      <mesh position={[0, 0.009, 0]} material={material}>
        <sphereGeometry args={[0.0055, 16, 12]} />
      </mesh>
    </group>
  );
}

/* ── Control box: Pi 4, two DM542 drives, a terminal strip ─────────── */

/** Dark anodised shell on the rear of the rocker, smoked lid, boards on standoffs. */
function ControlBox({ m }: { m: Materials }) {
  const { w, h, d, x, y, zFace } = S.enclosure;
  const wall = 0.004;
  const zBack = zFace - wall / 2;
  const zInner = zFace - wall;
  const zLid = zFace - d + 0.001;
  const zMid = zFace - d / 2;
  const lidGeo = useMemo(() => new RoundedBoxGeometry(w - 0.006, h - 0.006, 0.002, 2, 0.001), [w, h]);
  const piX = S.pi.x, piY = S.pi.y;
  // the board faces the lid, so its local +x lands at world −x
  const holes: V3[] = PI_HOLES.map(([hx, hy]) => [piX - hx, piY + hy, 0]);
  const piBack = PI_Z + 0.0016;
  const stripY = y - 0.058;
  const driveX = [x + 0.012, x + 0.094];
  return (
    <group>
      {/* shell */}
      <Plate size={[w, h, wall]} position={[x, y, zBack]} material={m.aluDark} radius={0.001} />
      <Plate size={[w, wall, d]} position={[x, y + h / 2 - wall / 2, zMid]} material={m.aluDark} radius={0.001} />
      <Plate size={[w, wall, d]} position={[x, y - h / 2 + wall / 2, zMid]} material={m.aluDark} radius={0.001} />
      <Plate size={[wall, h, d]} position={[x - w / 2 + wall / 2, y, zMid]} material={m.aluDark} radius={0.001} />
      <Plate size={[wall, h, d]} position={[x + w / 2 - wall / 2, y, zMid]} material={m.aluDark} radius={0.001} />
      {/* lid: smoked acrylic on four screws */}
      <mesh geometry={lidGeo} position={[x, y, zLid]} material={m.lid} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
        <Screw key={i} position={[x + sx * (w / 2 - 0.007), y + sy * (h / 2 - 0.007), zLid - 0.001]} dir={[0, 0, -1]} material={m.steel} socket={m.blackMatte} r={0.0028} />
      ))}
      {/* cable gland and a lead out of the side */}
      <mesh position={[x + w / 2 + 0.005, y - 0.045, zMid]} rotation={[0, 0, Math.PI / 2]} material={m.plastic}>
        <cylinderGeometry args={[0.006, 0.006, 0.012, 20]} />
      </mesh>
      <Rod from={[x + w / 2 + 0.011, y - 0.045, zMid]} to={[x + w / 2 + 0.05, y - 0.09, zMid + 0.02]} r={0.0035} material={m.rubber} segments={12} />
      {/* Raspberry Pi 4 on brass standoffs through its four mounting holes */}
      {holes.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], (zInner + piBack) / 2]} rotation={[Math.PI / 2, 0, 0]} material={m.brass}>
          <cylinderGeometry args={[0.0025, 0.0025, zInner - piBack, 6]} />
        </mesh>
      ))}
      {/* the boards carry their own textures; the instrument must not wait for them */}
      <Suspense fallback={null}>
        <group position={[piX, piY, PI_Z]} rotation={[0, Math.PI, 0]}>
          <PiBoard m={m} />
        </group>
        <StepperDriver m={m} position={[driveX[0], y, zInner]} />
        <StepperDriver m={m} position={[driveX[1], y, zInner]} />
      </Suspense>
      {holes.map((p, i) => (
        <Screw key={`s${i}`} position={[p[0], p[1], PI_Z]} dir={[0, 0, -1]} material={m.steel} socket={m.blackMatte} r={0.0022} />
      ))}
      {/* barrier terminal strip under the Pi, and the wiring */}
      <mesh position={[piX, stripY, zInner - 0.0055]} material={m.plastic} castShadow>
        <boxGeometry args={[0.052, 0.01, 0.011]} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[piX - 0.02 + i * 0.008, stripY, zInner - 0.0113]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}>
          <cylinderGeometry args={[0.0017, 0.0017, 0.0008, 10]} />
        </mesh>
      ))}
      {/* power: strip → drives along the bottom of the box; signal: header → P1 on the nearest drive */}
      <Rod from={[piX + 0.02, stripY, zInner - 0.012]} to={[driveX[0] - 0.045, y - 0.042, zInner - 0.02]} r={0.0012} material={m.wireRed} segments={8} />
      <Rod from={[piX + 0.012, stripY, zInner - 0.012]} to={[driveX[0] - 0.045, y - 0.037, zInner - 0.02]} r={0.0012} material={m.wireBlack} segments={8} />
      <Rod from={[driveX[1] - 0.045, y - 0.042, zInner - 0.02]} to={[driveX[0] + 0.03, y - 0.066, zInner - 0.014]} r={0.0012} material={m.wireRed} segments={8} />
      <Rod from={[driveX[0] + 0.03, y - 0.066, zInner - 0.014]} to={[piX + 0.02, stripY, zInner - 0.012]} r={0.0012} material={m.wireRed} segments={8} />
      {[0, 1, 2].map((i) => (
        <Rod key={i} from={[piX + 0.03425 - i * 0.00254, piY + (i % 2 ? 0.0255 : 0.023), PI_Z - 0.0085]} to={[driveX[0] - 0.045, y + 0.02 + i * 0.005, zInner - 0.02]} r={0.0006} material={i === 1 ? m.wireRed : m.wireBlack} segments={8} />
      ))}
      {[0, 1].map((i) => (
        <Rod key={i} from={[piX + 0.03425 - (i + 4) * 0.00254, piY + (i % 2 ? 0.0255 : 0.023), PI_Z - 0.0085]} to={[driveX[1] - 0.045, y + 0.02 + i * 0.005, zInner - 0.02]} r={0.0006} material={i === 0 ? m.wireBlack : m.wireRed} segments={8} />
      ))}
      <Rod from={[driveX[1] - 0.045, y - 0.03, zInner - 0.02]} to={[x + w / 2, y - 0.045, zMid]} r={0.0016} material={m.wireBlack} segments={8} />
      <Rod from={[driveX[0] - 0.045, y - 0.025, zInner - 0.02]} to={[x + w / 2, y - 0.045, zMid]} r={0.0016} material={m.wireRed} segments={8} />
    </group>
  );
}

/* ── the instrument ─────────────────────────────────────────────── */

export default function IdealTelescope({ m }: { m: Materials }) {
  const ringGeo = useRingGeometry(S.cage.rIn, S.cage.rOut, S.cage.h);
  const bearingGeo = useBearingGeometry();
  const bearingRimGeo = useBearingRimGeometry();
  const rockerSideGeo = useRockerSideGeometry();
  const rockerFrontGeo = useRockerFrontGeometry(S.rocker.wallX * 2 - S.rocker.plate);
  const secondaryGeo = useEllipseGeometry(S.secondary.a, S.secondary.b, 0.0012);
  const secondaryBackGeo = useEllipseGeometry(S.secondary.a + 0.003, S.secondary.b + 0.003, 0.008);
  const sectorGeo = useSectorGeometry(S.bearing.r - 0.014, 0.028, 0.005);
  const motorGeo = useMemo(() => new RoundedBoxGeometry(0.076, 0.057, 0.057, 3, 0.004), []);
  const azMotorGeo = useMemo(() => new RoundedBoxGeometry(0.042, 0.048, 0.042, 3, 0.003), []);
  const shoeGeo = useMemo(() => new RoundedBoxGeometry(0.07, 0.06, 0.03, 2, 0.003), []);
  const clampGeo = useMemo(() => new RoundedBoxGeometry(0.032, 0.05, 0.064, 2, 0.003), []);
  const focuserBodyGeo = useMemo(() => new RoundedBoxGeometry(0.064, 0.05, 0.05, 2, 0.004), []);

  const boxTop = S.mirrorBox.top;
  const half = S.mirrorBox.half;
  const pl = S.mirrorBox.plate;
  const boxH = boxTop - S.mirrorBox.bottom;
  const rp = S.rocker.plate;

  const poles = useMemo(() => {
    const out: { from: V3; to: V3 }[] = [];
    const ringR = S.cage.rIn - 0.004;
    SHOE_AZIMUTHS.forEach((az, i) => {
      const [sx, sz] = rimPoint(az, half - pl / 2);
      for (const t of [RING_AZIMUTHS[i], RING_AZIMUTHS[(i + 1) % 3]]) {
        out.push({
          from: [sx, boxTop - 0.02, sz],
          to: [Math.cos(t) * ringR, S.cage.lowerY + S.cage.h, Math.sin(t) * ringR],
        });
      }
    });
    return out;
  }, [half, pl, boxTop]);

  const fDir = useMemo(() => new THREE.Vector3(Math.cos(S.focuserAzimuth), 0, Math.sin(S.focuserAzimuth)), []);
  const fSide = useMemo(() => new THREE.Vector3(-fDir.z, 0, fDir.x), [fDir]);
  const focuserY = (S.cage.lowerY + S.cage.upperY) / 2;
  const fQuat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(Y, fDir), [fDir]);
  const secondaryQuat = useMemo(() => {
    const n = fDir.clone().add(Y).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  }, [fDir]);
  const knobSideQuat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(Y, fSide), [fSide]);
  const knobSideQuatNeg = useMemo(() => new THREE.Quaternion().setFromUnitVectors(Y, fSide.clone().negate()), [fSide]);

  const padZ = S.rocker.cradleR * Math.sin(S.pad.angle);
  const padY = S.altAxisY - S.rocker.cradleR * Math.cos(S.pad.angle);
  const fp = (dd: number): V3 => [fDir.x * dd, 0, fDir.z * dd];
  const rockerBottom = S.rocker.floorY;
  const rockerInnerW = S.rocker.wallX * 2 - rp;

  return (
    <group>
      {/* ── Base ─────────────────────────────────────────────── */}
      {[0, 1, 2].map((i) => {
        const a = Math.PI / 2 + (i * 2 * Math.PI) / 3;
        return (
          <mesh key={i} position={[Math.cos(a) * S.foot.ring, S.foot.h / 2, Math.sin(a) * S.foot.ring]} material={m.rubber} castShadow>
            <cylinderGeometry args={[S.foot.r, S.foot.r * 0.92, S.foot.h, 40]} />
          </mesh>
        );
      })}
      <mesh position={[0, S.groundBoard.y + S.groundBoard.h / 2, 0]} material={m.alu} castShadow receiveShadow>
        <cylinderGeometry args={[S.groundBoard.r, S.groundBoard.r, S.groundBoard.h, 160]} />
      </mesh>
      <mesh position={[0, S.groundBoard.y + S.groundBoard.h + S.azBearing.h / 2, 0]} material={m.laminate} receiveShadow>
        <cylinderGeometry args={[S.azBearing.r, S.azBearing.r, S.azBearing.h, 160]} />
      </mesh>

      {/* ── Rocker box: machined aluminium plates ────────────── */}
      <Plate size={[S.rocker.wallX * 2 + rp, rp, S.rocker.wallDepth]} position={[0, rockerBottom + rp / 2, 0]} material={m.alu} />
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} geometry={rockerSideGeo} position={[sgn * S.rocker.wallX, rockerBottom, 0]} material={m.alu} castShadow receiveShadow />
      ))}
      {[-1, 1].map((sgn) => (
        <mesh
          key={sgn}
          geometry={rockerFrontGeo}
          position={[0, rockerBottom + rp, sgn * (S.rocker.wallDepth / 2 - rp / 2)]}
          rotation={[0, sgn < 0 ? Math.PI : 0, 0]}
          material={m.alu}
          castShadow
          receiveShadow
        />
      ))}
      {/* fastener rows: side plates to floor, front plates to sides */}
      {[-1, 1].flatMap((sx) =>
        [-0.17, -0.06, 0.06, 0.17].map((z) => (
          <Screw key={`${sx}${z}`} position={[sx * (S.rocker.wallX + rp / 2), rockerBottom + 0.02, z]} dir={[sx, 0, 0]} material={m.black} socket={m.blackMatte} />
        )),
      )}
      {[-1, 1].flatMap((sz) =>
        [-1, 1].flatMap((sx) =>
          [0.03, 0.09].map((yy) => (
            <Screw key={`${sz}${sx}${yy}`} position={[sx * (S.rocker.wallX + rp / 2), rockerBottom + rp + yy, sz * (S.rocker.wallDepth / 2 - 0.012)]} dir={[sx, 0, 0]} material={m.black} socket={m.blackMatte} />
          )),
        ),
      )}
      {/* PTFE pads in the cradle */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * S.rocker.wallX, padY + 0.004, sz * padZ]} rotation={[sz * -S.pad.angle, 0, 0]} material={m.ptfe} castShadow>
            <boxGeometry args={[0.03, 0.008, 0.05]} />
          </mesh>
        )),
      )}
      {/* azimuth pivot */}
      <mesh position={[0, rockerBottom + rp + 0.004, 0]} material={m.steel}>
        <cylinderGeometry args={[0.012, 0.012, 0.008, 32]} />
      </mesh>
      <ControlBox m={m} />

      {/* ── Mirror box: dark anodised outside, flocked inside ── */}
      <Plate size={[half * 2, pl, half * 2]} position={[0, S.mirrorBox.bottom + pl / 2, 0]} material={m.aluDark} radius={0.002} />
      {[-1, 1].map((sgn) => (
        <Plate key={`x${sgn}`} size={[pl, boxH, half * 2]} position={[sgn * (half - pl / 2), (boxTop + S.mirrorBox.bottom) / 2, 0]} material={m.aluDark} radius={0.002} />
      ))}
      {[-1, 1].map((sgn) => (
        <Plate key={`z${sgn}`} size={[half * 2 - pl * 2, boxH, pl]} position={[0, (boxTop + S.mirrorBox.bottom) / 2, sgn * (half - pl / 2)]} material={m.aluDark} radius={0.002} />
      ))}
      <mesh position={[0, (boxTop + S.mirrorBox.bottom) / 2 - 0.004, 0]} material={m.flock}>
        <boxGeometry args={[half * 2 - pl * 2 - 0.001, boxH - 0.008, half * 2 - pl * 2 - 0.001]} />
      </mesh>
      {/* corner fasteners on the side plates */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].flatMap((sz) =>
          [0.03, 0.15, 0.27].map((yy) => (
            <Screw key={`${sx}${sz}${yy}`} position={[sx * half, S.mirrorBox.bottom + yy, sz * (half - 0.012)]} dir={[sx, 0, 0]} material={m.steel} socket={m.blackMatte} r={0.003} />
          )),
        ),
      )}
      {/* carry handle on the front */}
      <mesh position={[0, boxTop - 0.09, half + 0.012]} material={m.steel} castShadow>
        <torusGeometry args={[0.055, 0.006, 16, 48, Math.PI]} />
      </mesh>
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} position={[sgn * 0.055, boxTop - 0.09, half + 0.006]} rotation={[Math.PI / 2, 0, 0]} material={m.steel}>
          <cylinderGeometry args={[0.006, 0.006, 0.012, 16]} />
        </mesh>
      ))}

      {/* altitude bearings: aluminium arcs with laminate rims and spacers */}
      {[-1, 1].map((sgn) => (
        <group key={sgn} position={[sgn * S.bearing.x, S.altAxisY, 0]}>
          <mesh geometry={bearingGeo} material={m.alu} castShadow receiveShadow />
          <mesh geometry={bearingRimGeo} material={m.laminate} castShadow />
          {[[-0.1, -0.16], [0.1, -0.16], [-0.1, 0.0], [0.1, 0.0]].map(([z, yy], i) => (
            <Screw key={i} position={[sgn * (S.bearing.plate / 2), yy, z]} dir={[sgn, 0, 0]} material={m.black} socket={m.blackMatte} r={0.0045} />
          ))}
        </group>
      ))}
      {[-1, 1].flatMap((sgn) =>
        [-0.1, 0.1].map((z) => (
          <mesh key={`${sgn}${z}`} position={[sgn * (half + (S.bearing.x - S.bearing.plate / 2 - half) / 2), S.altAxisY - 0.07, z]} material={m.black}>
            <boxGeometry args={[S.bearing.x - S.bearing.plate / 2 - half, 0.1, 0.06]} />
          </mesh>
        )),
      )}

      {/* mirror cell and primary */}
      <mesh position={[0, S.mirrorBox.bottom + pl + 0.012, 0]} material={m.blackMatte} receiveShadow>
        <cylinderGeometry args={[0.142, 0.142, 0.024, 96]} />
      </mesh>
      <mesh position={[0, S.primary.y + S.primary.h / 2, 0]} material={m.glass} castShadow receiveShadow>
        <cylinderGeometry args={[S.primary.r, S.primary.r, S.primary.h, 160]} />
      </mesh>
      <mesh position={[0, S.primary.y + S.primary.h + 0.0006, 0]} material={m.mirror}>
        <cylinderGeometry args={[S.primary.r - 0.0015, S.primary.r - 0.0015, 0.0012, 160]} />
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
        const [sx, sz] = rimPoint(az, half - pl / 2);
        const rot: V3 = [0, -az + Math.PI / 2, 0];
        return (
          <group key={i} position={[sx, boxTop - 0.035, sz]} rotation={rot}>
            <mesh geometry={shoeGeo} material={m.black} castShadow />
            <Knob position={[-0.02, 0.03, 0]} material={m.black} />
            <Knob position={[0.02, 0.03, 0]} material={m.black} />
          </group>
        );
      })}
      {poles.map((p, i) => (
        <Rod key={i} from={p.from} to={p.to} r={S.pole.r} material={m.aluminum} />
      ))}
      {RING_AZIMUTHS.map((az, i) => (
        <group key={i} position={[Math.cos(az) * (S.cage.rIn - 0.004), S.cage.lowerY - 0.014, Math.sin(az) * (S.cage.rIn - 0.004)]} rotation={[0, -az, 0]}>
          <mesh geometry={clampGeo} material={m.black} castShadow />
          <Knob position={[-0.024, -0.02, 0.018]} quaternion={Q.nx} material={m.black} />
          <Knob position={[-0.024, -0.02, -0.018]} quaternion={Q.nx} material={m.black} />
        </group>
      ))}

      {/* ── Upper cage ───────────────────────────────────────── */}
      <mesh geometry={ringGeo} position={[0, S.cage.lowerY, 0]} material={m.black} castShadow receiveShadow />
      <mesh geometry={ringGeo} position={[0, S.cage.upperY, 0]} material={m.black} castShadow receiveShadow />
      <mesh position={[0, (S.cage.lowerY + S.cage.upperY) / 2 + S.cage.h / 2, 0]} material={m.flock}>
        <cylinderGeometry args={[S.cage.rIn + 0.0005, S.cage.rIn + 0.0005, S.cage.upperY - S.cage.lowerY - S.cage.h, 128, 1, true]} />
      </mesh>
      {SHOE_AZIMUTHS.map((az, i) => {
        const r = (S.cage.rIn + S.cage.rOut) / 2;
        return (
          <Rod key={i} from={[Math.cos(az) * r, S.cage.lowerY + S.cage.h / 2, Math.sin(az) * r]} to={[Math.cos(az) * r, S.cage.upperY - S.cage.h / 2, Math.sin(az) * r]} r={0.01} material={m.black} />
        );
      })}
      {SHOE_AZIMUTHS.map((az, i) => {
        const len = S.cage.rIn - S.spider.hubR + 0.004;
        const midR = S.spider.hubR + len / 2 - 0.002;
        return (
          <mesh key={i} position={[Math.cos(az) * midR, S.spider.y, Math.sin(az) * midR]} rotation={[0, -az, 0]} material={m.steel}>
            <boxGeometry args={[len, 0.024, 0.0008]} />
          </mesh>
        );
      })}
      <mesh position={[0, S.spider.y, 0]} material={m.black} castShadow>
        <cylinderGeometry args={[S.spider.hubR, S.spider.hubR, 0.03, 48]} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i * 2 * Math.PI) / 3 + Math.PI / 3;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.02, S.spider.y + 0.018, Math.sin(a) * 0.02]} material={m.steel}>
            <cylinderGeometry args={[0.003, 0.003, 0.006, 12]} />
          </mesh>
        );
      })}
      <mesh position={[0, S.spider.y - 0.035, 0]} material={m.black} castShadow>
        <cylinderGeometry args={[0.03, 0.033, 0.04, 48]} />
      </mesh>
      <group position={[0, S.secondary.y, 0]} quaternion={secondaryQuat}>
        <mesh geometry={secondaryBackGeo} material={m.black} castShadow />
        <mesh geometry={secondaryGeo} position={[0, 0, 0.0006]} material={m.mirror} />
      </group>

      {/* focuser: base, body with two knobs, chrome drawtube, camera */}
      <group position={[0, focuserY, 0]}>
        <mesh position={fp(S.cage.rOut + 0.006)} quaternion={fQuat} material={m.black} castShadow>
          <boxGeometry args={[0.08, 0.012, 0.08]} />
        </mesh>
        <mesh geometry={focuserBodyGeo} position={fp(S.cage.rOut + 0.036)} quaternion={fQuat} material={m.anodized} castShadow />
        <Knob position={[fDir.x * (S.cage.rOut + 0.036) + fSide.x * 0.03, 0, fDir.z * (S.cage.rOut + 0.036) + fSide.z * 0.03]} quaternion={knobSideQuat} material={m.anodized} />
        <Knob position={[fDir.x * (S.cage.rOut + 0.036) - fSide.x * 0.03, 0, fDir.z * (S.cage.rOut + 0.036) - fSide.z * 0.03]} quaternion={knobSideQuatNeg} material={m.anodized} />
        <mesh position={fp(S.cage.rOut + 0.085)} quaternion={fQuat} material={m.chrome} castShadow>
          <cylinderGeometry args={[0.027, 0.027, 0.06, 48]} />
        </mesh>
        <mesh position={fp(S.cage.rOut + 0.118)} quaternion={fQuat} material={m.accent}>
          <cylinderGeometry args={[0.041, 0.041, 0.008, 48]} />
        </mesh>
        <mesh position={fp(S.cage.rOut + 0.164)} quaternion={fQuat} material={m.anodized} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.084, 48]} />
        </mesh>
        <mesh position={fp(S.cage.rOut + 0.208)} quaternion={fQuat} material={m.blackMatte}>
          <cylinderGeometry args={[0.03, 0.036, 0.006, 48]} />
        </mesh>
      </group>

      {/* ── Drive ────────────────────────────────────────────── */}
      <mesh geometry={sectorGeo} position={[-(S.bearing.x + S.bearing.plate / 2 + 0.004), S.altAxisY, 0]} material={m.anodized} castShadow />
      <group position={[-(S.rocker.wallX + rp / 2), S.altAxisY - S.bearing.r - 0.03, 0.02]}>
        <mesh geometry={motorGeo} position={[-0.048, 0, 0]} material={m.anodized} castShadow />
        <mesh position={[-0.006, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.steel}>
          <cylinderGeometry args={[0.019, 0.019, 0.006, 40]} />
        </mesh>
        <mesh position={[-0.0015, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.steel}>
          <cylinderGeometry args={[0.012, 0.012, 0.012, 32]} />
        </mesh>
      </group>
      <mesh geometry={azMotorGeo} position={[0.16, rockerBottom - 0.028, 0.14]} material={m.anodized} castShadow />
      {/* keep the inner width honest for the front plate geometry */}
      <group visible={false}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[rockerInnerW, 0.001, 0.001]} />
        </mesh>
      </group>
    </group>
  );
}
