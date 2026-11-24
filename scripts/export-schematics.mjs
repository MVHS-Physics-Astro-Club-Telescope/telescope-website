#!/usr/bin/env node
/**
 * Export the four HAT schematic sheets from the electrical repo as dark,
 * warm line-work SVGs for the site's schematics viewer.
 *
 *   npm run export:schematics -- <electrical-checkout> <commit>
 *   npm run export:schematics -- ~/Projects/telescope/electrical 0491df8
 *
 * 1. `git archive` the KiCad project at <commit> into a temp dir, so the
 *    checkout's branch and working tree are never touched.
 * 2. `kicad-cli sch export svg` with the built-in default theme (pinned, so a
 *    personal colour theme can't leak in), no drawing sheet, no background,
 *    and visible hop-overs where wires cross without connecting.
 * 3. Re-theme and shrink each sheet: every KiCad default colour maps to a
 *    role (wire, symbol, text, note...) and that role to a solid colour
 *    pre-mixed over the site's black, so overlapping strokes never double up.
 *    Unknown colours, visible <text>, or unexpected transforms abort the run
 *    instead of slipping through un-themed.
 * 4. Drop the invisible search text and the team-process text listed in
 *    STRIP (sheet owners, editing rules), de-duplicate items KiCad plots
 *    twice (box symbols' field text), join segments into polylines, round to
 *    0.01 mm, write relative path data, crop to the drawing.
 * 5. Write public/schematics/<slug>.svg and src/data/schematics-export.json,
 *    only once every sheet has passed its checks.
 *
 * Needs git, tar and kicad-cli 10 (KICAD_CLI overrides the binary path).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "schematics");
const DATA_FILE = path.join(ROOT, "src", "data", "schematics-export.json");
const PROJECT_DIR = "mv-telescope-hat";
const ROOT_SHEET = "mv-telescope-hat";
const REPO_URL = "https://github.com/MVHS-Physics-Astro-Club-Telescope/telescope-electrical";

/** KiCad names a sub-sheet's file `<root>-<sheet name>.svg`. */
const SHEETS = [
  { slug: "overview", kicadName: null },
  { slug: "pi-header", kicadName: "Pi header" },
  { slug: "hat-signals", kicadName: "HAT signals" },
  { slug: "power", kicadName: "Power and drivers" },
];

/**
 * Team-process text that stays in the KiCad project but not on the public
 * site: who owns which sheet, and the rules for editing them. Each rule must
 * match exactly `distinct` different strings, and nothing that still reads
 * like an owner or process note may be left on the sheet, so a re-export after
 * the wording changes stops instead of quietly publishing it. Engineering
 * notes are not listed and stay.
 */
const STRIP = {
  overview: {
    rules: [
      { what: "owners note, line 1", match: (t) => t.startsWith("OWNERS: "), distinct: 1 },
      { what: "owners note, line 2", match: (t) => t.startsWith("Edit only your own sheet."), distinct: 1 },
      { what: "owners note, line 3", match: (t) => t.startsWith("Every change goes through a pull request"), distinct: 1 },
      { what: "sheet Owner fields", match: (t) => t.startsWith("Owner: "), distinct: 3 },
    ],
    leftovers: /\bowners?\b|pull request|\bERC\b|your own sheet/i,
  },
};

/* ─── Palette ──────────────────────────────────────────────
 * Site tokens (src/app/globals.css): ink #f4f3ef, glow #f3e4c3, bg #000.
 * Each role is a token at an opacity, pre-mixed over black.            */
const INK = [0xf4, 0xf3, 0xef];
const GLOW = [0xf3, 0xe4, 0xc3];
const over = (rgb, a) =>
  "#" + rgb.map((c) => Math.round(c * a).toString(16).padStart(2, "0")).join("");

/** Draw order follows this list: fills first, wiring, symbols, then text. */
const ROLES = {
  bodyFill: { paint: "fill", color: over(GLOW, 0.05) },
  wire: { paint: "stroke", color: over(GLOW, 1), widthScale: 1.25 },
  junction: { paint: "fill", color: over(GLOW, 1) },
  noConnect: { paint: "stroke", color: over(INK, 0.38) },
  symbol: { paint: "stroke", color: over(INK, 0.5) },
  symbolFill: { paint: "both", color: over(INK, 0.5) },
  note: { paint: "stroke", color: over(INK, 0.36) },
  sheetField: { paint: "stroke", color: over(INK, 0.4) },
  pinNumber: { paint: "stroke", color: over(INK, 0.36) },
  name: { paint: "stroke", color: over(INK, 0.66) },
  label: { paint: "stroke", color: over(GLOW, 0.78) },
};
const ROLE_ORDER = Object.keys(ROLES);

/**
 * KiCad 10 built-in default theme colours, as they appear in the SVG, by how
 * they're painted. Anything not listed aborts the export.
 */
function roleFor(style) {
  const { fill, stroke } = style;
  if (fill === "#FFFFC2" && stroke === null) return "bodyFill"; // symbol body background
  if (fill === "#009600" && stroke === null) return "junction";
  if (fill === "#840000" && stroke === "#840000") return "symbolFill"; // filled symbol graphics
  if (fill !== null) return null;
  switch (stroke) {
    case "#009600": return "wire";
    case "#000084": return "noConnect"; // no-connect flags and buses
    case "#840000": return "symbol"; // symbol outlines, pins, sheet borders, global labels
    case "#0000C2": return "note"; // the blue sheet notes and note graphics
    case "#840084": return "sheetField"; // sheet fields ("Owner: ...")
    case "#A90000": return "pinNumber";
    case "#006464": return "name"; // pin names, references, values, sheet names and pins
    case "#725600": return "label"; // hierarchical labels, sheet file names
    case "#0F0F0F": return "label"; // local net labels
    default: return null;
  }
}

/* ─── Tiny XML reader (enough for Eeschema's SVG plotter) ───────────── */
function parseXml(src) {
  const root = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<(\/?)([A-Za-z][\w:-]*)((?:\s+[\w:-]+\s*=\s*"[^"]*")*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[5] !== undefined) {
      if (m[5].trim()) stack.at(-1).children.push({ tag: "#text", text: m[5] });
      continue;
    }
    if (!m[2]) continue; // prolog, doctype, comment
    const [, closing, tag, rawAttrs, selfClosing] = m;
    if (closing) {
      const open = stack.pop();
      if (open.tag !== tag) throw new Error(`XML: </${tag}> closes <${open.tag}>`);
      continue;
    }
    const attrs = {};
    for (const a of rawAttrs.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) attrs[a[1]] = a[2];
    const node = { tag, attrs, children: [] };
    stack.at(-1).children.push(node);
    if (!selfClosing) stack.push(node);
  }
  if (stack.length !== 1) throw new Error("XML: unclosed elements");
  return root;
}

function parseStyle(s = "") {
  const out = {};
  for (const decl of s.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    out[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
  }
  return out;
}

/* ─── Geometry: everything becomes absolute subpaths in 1/100 mm ─────── */
const q = (v) => Math.round(Number(v) * 100);

/** Parse Eeschema path data (absolute M, L, A, Z only). */
function parsePath(d) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const subpaths = [];
  let sp = null;
  let i = 0;
  let cmd = null;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    switch (cmd) {
      case "M":
        sp = { start: [q(num()), q(num())], segs: [], closed: false };
        subpaths.push(sp);
        cmd = "L";
        break;
      case "L":
        sp.segs.push({ type: "L", to: [q(num()), q(num())] });
        break;
      case "A": {
        const rx = q(num()), ry = q(num()), rot = num(), large = num(), sweep = num();
        sp.segs.push({ type: "A", rx, ry, rot, large, sweep, to: [q(num()), q(num())] });
        break;
      }
      case "Z":
      case "z":
        sp.closed = true;
        break;
      default:
        throw new Error(`Unsupported path command "${cmd}" in ${d.slice(0, 60)}`);
    }
  }
  return subpaths;
}

function rectPath({ x, y, width, height }) {
  const x0 = q(x), y0 = q(y), x1 = q(Number(x) + Number(width)), y1 = q(Number(y) + Number(height));
  return [{
    start: [x0, y0],
    segs: [[x1, y0], [x1, y1], [x0, y1]].map((to) => ({ type: "L", to })),
    closed: true,
  }];
}

function circlePath({ cx, cy, r }) {
  const c = [q(cx), q(cy)], R = q(r);
  const arc = (to) => ({ type: "A", rx: R, ry: R, rot: 0, large: 1, sweep: 0, to });
  return [{ start: [c[0] - R, c[1]], segs: [arc([c[0] + R, c[1]]), arc([c[0] - R, c[1]])], closed: true }];
}

/* ─── Collect drawables per role ─────────────────────────────────────── */
function collectItems(svgRoot, sheet) {
  const items = [];
  const stats = { hiddenText: 0 };
  const walk = (node, style, transformed) => {
    for (const child of node.children) {
      const { tag, attrs } = child;
      if (tag === "#text" || tag === "title" || tag === "desc") continue;
      if (tag === "text") {
        if (attrs.opacity !== "0") throw new Error(`${sheet}: visible <text> "${child.children[0]?.text}"`);
        stats.hiddenText++;
        continue;
      }
      if (tag === "svg") { walk(child, style, false); continue; }
      if (tag === "g") {
        const merged = attrs.style ? { ...style, ...parseStyle(attrs.style) } : style;
        const t = attrs.transform && attrs.transform !== "translate(0 0) scale(1 1)";
        if (attrs.class === "stroked-text") {
          const text = { geometry: [], style: merged, isText: true, text: "" };
          collectStrokedText(child, text);
          items.push(text);
          continue;
        }
        walk(child, merged, transformed || t);
        continue;
      }
      if (transformed) throw new Error(`${sheet}: drawable <${tag}> inside a transformed group`);
      let geometry;
      if (tag === "path") geometry = parsePath(attrs.d);
      else if (tag === "rect") {
        if (Number(attrs.rx || 0) !== 0) throw new Error(`${sheet}: rounded rect`);
        geometry = rectPath(attrs);
      } else if (tag === "circle") geometry = circlePath(attrs);
      else throw new Error(`${sheet}: unexpected <${tag}>`);
      const own = attrs.style ? { ...style, ...parseStyle(attrs.style) } : style;
      items.push({ geometry, style: own, isText: false });
    }
  };
  const collectStrokedText = (g, text) => {
    for (const c of g.children) {
      if (c.tag === "desc") { text.text = c.children.map((t) => t.text ?? "").join(""); continue; }
      if (c.tag === "#text") continue;
      if (c.tag !== "path") throw new Error(`${sheet}: <${c.tag}> inside stroked text`);
      text.geometry.push(...parsePath(c.attrs.d));
    }
  };
  walk(svgRoot, {}, false);
  return { items, stats };
}

/** Drops the STRIP text for one sheet; throws if the expected strings aren't all there. */
function stripTeamText(items, sheet) {
  const spec = STRIP[sheet];
  if (!spec) return { kept: items, stripped: [] };
  const found = spec.rules.map(() => new Set());
  const kept = [];
  for (const item of items) {
    const i = item.isText ? spec.rules.findIndex((r) => r.match(item.text)) : -1;
    if (i === -1) kept.push(item);
    else found[i].add(item.text);
  }
  spec.rules.forEach((r, i) => {
    if (found[i].size !== r.distinct) {
      throw new Error(
        `${sheet}: expected ${r.distinct} distinct "${r.what}" string(s) to strip, found ${found[i].size}` +
          (found[i].size ? ` (${[...found[i]].join(" | ")})` : "") +
          "; update STRIP in scripts/export-schematics.mjs",
      );
    }
  });
  const left = kept.filter((item) => item.isText && spec.leftovers.test(item.text));
  if (left.length) {
    throw new Error(
      `${sheet}: team-process text left after stripping: ${left.map((t) => `"${t.text}"`).join(", ")}; update STRIP`,
    );
  }
  return { kept, stripped: found.flatMap((s) => [...s]) };
}

function styleOf(item, sheet) {
  const raw = item.style;
  const color = (v) => (v && v !== "none" ? v.toUpperCase() : null);
  const fill = color(raw.fill);
  const stroke = color(raw.stroke);
  let role = roleFor({ fill, stroke });
  if (!role) throw new Error(`${sheet}: no role for fill ${raw.fill} / stroke ${raw.stroke}`);
  // A hierarchical sheet's "File: x.kicad_sch" field shares the label colour;
  // it's bookkeeping, so it goes quiet with the other sheet fields.
  if (item.isText && role === "label" && item.text.startsWith("File: ")) role = "sheetField";
  const width = stroke ? Number(raw["stroke-width"]) : 0;
  const dash = raw["stroke-dasharray"] ?? null;
  return { role, width, dash };
}

/* ─── Path data writer: relative, joined, compact ────────────────────── */
function fmt(hundredths) {
  const s = (hundredths / 100).toString();
  return s.replace(/^(-?)0\./, "$1.");
}

function writer() {
  let out = "";
  let last = ""; // last emitted token, to decide on separators
  let lastCmd = "";
  const emitCmd = (c) => {
    if (c === lastCmd && c !== "m") return;
    out += c;
    last = c;
    lastCmd = c;
  };
  const emitNum = (n) => {
    const s = fmt(n);
    const needsSep =
      last !== "" && !/[A-Za-z]$/.test(last) && !s.startsWith("-") &&
      !(s.startsWith(".") && last.includes("."));
    out += (needsSep ? " " : "") + s;
    last = s;
  };
  return { emitCmd, emitNum, text: () => out };
}

/**
 * Serialise subpaths. `join` chains a subpath onto the previous one when it
 * starts where the pen already is (stroke-only paths, where that renders the
 * same with round caps and joins).
 */
function pathData(subpaths, join) {
  const w = writer();
  let pen = [0, 0];
  let subStart = [0, 0];
  let open = false;
  for (const sp of subpaths) {
    const continues = join && open && sp.start[0] === pen[0] && sp.start[1] === pen[1];
    if (!continues) {
      w.emitCmd("m");
      w.emitNum(sp.start[0] - pen[0]);
      w.emitNum(sp.start[1] - pen[1]);
      pen = sp.start;
      subStart = sp.start;
    }
    for (const seg of sp.segs) {
      const dx = seg.to[0] - pen[0];
      const dy = seg.to[1] - pen[1];
      if (seg.type === "L") {
        if (dx === 0 && dy === 0) continue;
        if (dy === 0) { w.emitCmd("h"); w.emitNum(dx); }
        else if (dx === 0) { w.emitCmd("v"); w.emitNum(dy); }
        else { w.emitCmd("l"); w.emitNum(dx); w.emitNum(dy); }
      } else {
        w.emitCmd("a");
        w.emitNum(seg.rx); w.emitNum(seg.ry); w.emitNum(Math.round(seg.rot * 100));
        w.emitNum(seg.large * 100); w.emitNum(seg.sweep * 100);
        w.emitNum(dx); w.emitNum(dy);
      }
      pen = seg.to;
    }
    if (sp.closed) {
      w.emitCmd("z");
      pen = subStart;
      open = false;
    } else {
      open = true;
    }
  }
  return w.text();
}

/* ─── One sheet ──────────────────────────────────────────────────────── */
function transformSheet(rawSvg, sheet) {
  if (/mvhs/i.test(rawSvg)) console.warn(`  note: raw ${sheet} export mentions MVHS (checked again after theming)`);
  const doc = parseXml(rawSvg);
  const svg = doc.children.find((c) => c.tag === "svg");
  const collected = collectItems(svg, sheet);
  const { stats } = collected;
  const { kept: items, stripped } = stripTeamText(collected.items, sheet);

  const buckets = new Map();
  const seen = new Set();
  let duplicateText = 0;
  let duplicateOther = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const grow = ([x, y], pad) => {
    minX = Math.min(minX, x - pad); minY = Math.min(minY, y - pad);
    maxX = Math.max(maxX, x + pad); maxY = Math.max(maxY, y + pad);
  };

  for (const item of items) {
    const { role, width, dash } = styleOf(item, sheet);
    if (!item.geometry.length) continue;
    const key = `${role}|${width}|${dash ?? ""}`;
    const fingerprint = key + "|" + pathData(item.geometry, false);
    if (seen.has(fingerprint)) {
      if (item.isText) duplicateText++;
      else duplicateOther++;
      continue;
    }
    seen.add(fingerprint);
    if (!buckets.has(key)) buckets.set(key, { role, width, dash, items: [] });
    buckets.get(key).items.push(item.geometry);
    for (const sp of item.geometry) {
      grow(sp.start, 0);
      for (const seg of sp.segs) grow(seg.to, seg.type === "A" ? seg.rx : 0);
    }
  }

  // Crop to the drawing with a margin (coordinates in 1/100 mm).
  const PAD = 600;
  const vb = [minX - PAD, minY - PAD, maxX - minX + 2 * PAD, maxY - minY + 2 * PAD];

  const ordered = [...buckets.values()].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || a.width - b.width,
  );
  const elements = [];
  for (const b of ordered) {
    const spec = ROLES[b.role];
    const attrs = [];
    const sw = Math.round(b.width * (spec.widthScale ?? 1) * 1000) / 1000;
    if (spec.paint === "fill") attrs.push(`fill="${spec.color}"`);
    if (spec.paint === "stroke") attrs.push(`stroke="${spec.color}"`, `stroke-width="${fmt(sw * 100)}"`);
    if (spec.paint === "both") attrs.push(`fill="${spec.color}"`, `stroke="${spec.color}"`, `stroke-width="${fmt(sw * 100)}"`);
    if (b.dash) {
      const dash = b.dash.split(",").map((v) => fmt(q(v))).join(" ");
      attrs.push(`stroke-dasharray="${dash}"`);
    }
    if (spec.paint === "stroke") {
      // One path per bucket: segments chain into polylines.
      elements.push(`<path ${attrs.join(" ")} d="${pathData(b.items.flat(), true)}"/>`);
    } else {
      // Filled shapes keep one path each so windings never cancel.
      elements.push(`<g ${attrs.join(" ")}>${b.items.map((g) => `<path d="${pathData(g, false)}"/>`).join("")}</g>`);
    }
  }

  const [x, y, w, h] = vb.map(fmt);
  const pxW = Math.round((vb[2] / 100) * 4);
  const pxH = Math.round((vb[3] / 100) * 4);
  const out =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${pxW}" height="${pxH}" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    elements.join("") +
    `</svg>\n`;
  if (/mvhs/i.test(out)) throw new Error(`${sheet}: "MVHS" in the themed SVG`);
  return {
    svg: out,
    width: vb[2] / 100,
    height: vb[3] / 100,
    duplicateText,
    duplicateOther,
    hiddenText: stats.hiddenText,
    stripped,
  };
}

/* ─── Main ───────────────────────────────────────────────────────────── */
/**
 * --draw-hop-over uses the project's hop size, and this project leaves it at
 * choice 0, which plots a zero-size hop (nothing visible). Choice 2 is a
 * 0.61 mm radius arc, about three wire widths. Only the temp copy changes.
 */
const HOP_OVER_SIZE_CHOICE = 2;
function setHopOverSize(proFile) {
  const pro = JSON.parse(fs.readFileSync(proFile, "utf8"));
  const drawing = pro?.schematic?.drawing;
  if (!drawing || !("hop_over_size_choice" in drawing)) {
    throw new Error(`${proFile}: no schematic.drawing.hop_over_size_choice to set`);
  }
  drawing.hop_over_size_choice = HOP_OVER_SIZE_CHOICE;
  fs.writeFileSync(proFile, JSON.stringify(pro, null, 2));
}

function kicadCli() {
  const candidates = [
    process.env.KICAD_CLI,
    path.join(os.homedir(), "Applications/KiCad/KiCad.app/Contents/MacOS/kicad-cli"),
    "/Applications/KiCad/KiCad.app/Contents/MacOS/kicad-cli",
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return "kicad-cli";
}

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });
}

function main() {
  const [checkout, commit] = process.argv.slice(2);
  if (!checkout || !commit) {
    console.error("usage: npm run export:schematics -- <electrical-checkout> <commit>");
    process.exit(2);
  }
  const repo = path.resolve(checkout.replace(/^~(?=$|\/)/, os.homedir()));
  const sha = run("git", ["-C", repo, "rev-parse", "--verify", `${commit}^{commit}`]).trim();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mv-schematics-"));
  try {
    const tar = path.join(tmp, "src.tar");
    run("git", ["-C", repo, "archive", "--format=tar", "-o", tar, sha, PROJECT_DIR]);
    run("tar", ["-xf", tar, "-C", tmp]);
    setHopOverSize(path.join(tmp, PROJECT_DIR, `${ROOT_SHEET}.kicad_pro`));

    const cli = kicadCli();
    const kicadVersion = run(cli, ["version"]).trim();
    const rawDir = path.join(tmp, "svg");
    run(cli, [
      "sch", "export", "svg",
      "--theme", "_builtin_default",
      "--exclude-drawing-sheet",
      "--no-background-color",
      "--draw-hop-over",
      "-o", rawDir,
      path.join(tmp, PROJECT_DIR, `${ROOT_SHEET}.kicad_sch`),
    ]);

    const produced = fs.readdirSync(rawDir).filter((f) => f.endsWith(".svg")).sort();
    const expected = SHEETS.map((s) => (s.kicadName ? `${ROOT_SHEET}-${s.kicadName}.svg` : `${ROOT_SHEET}.svg`)).sort();
    if (JSON.stringify(produced) !== JSON.stringify(expected)) {
      throw new Error(`kicad-cli produced ${produced.join(", ")}; expected ${expected.join(", ")}`);
    }

    // Theme every sheet before writing any, so a failed check leaves the old files alone.
    const results = SHEETS.map((s) => {
      const file = s.kicadName ? `${ROOT_SHEET}-${s.kicadName}.svg` : `${ROOT_SHEET}.svg`;
      const raw = fs.readFileSync(path.join(rawDir, file), "utf8");
      return { s, raw, r: transformSheet(raw, s.slug) };
    });

    fs.mkdirSync(OUT_DIR, { recursive: true });
    const sheets = [];
    const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
    for (const { s, raw, r } of results) {
      fs.writeFileSync(path.join(OUT_DIR, `${s.slug}.svg`), r.svg);
      console.log(
        `${s.slug.padEnd(12)} ${kb(Buffer.byteLength(raw)).padStart(7)} -> ${kb(Buffer.byteLength(r.svg)).padStart(6)}` +
          `  ${r.width.toFixed(1)} x ${r.height.toFixed(1)} mm` +
          (r.duplicateText ? `  (dropped ${r.duplicateText} duplicate text item${r.duplicateText > 1 ? "s" : ""})` : "") +
          (r.duplicateOther ? `  (dropped ${r.duplicateOther} duplicate shape${r.duplicateOther > 1 ? "s" : ""})` : ""),
      );
      for (const t of r.stripped) console.log(`${"".padEnd(12)} removed team text: ${t}`);
      sheets.push({ slug: s.slug, src: `/schematics/${s.slug}.svg`, width: r.width, height: r.height });
    }

    const data = {
      $comment: "Generated by scripts/export-schematics.mjs. Do not edit by hand.",
      repo: REPO_URL,
      commit: sha,
      kicad: kicadVersion,
      sheets,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n");
    console.log(`source ${REPO_URL}/tree/${sha.slice(0, 7)} (kicad-cli ${kicadVersion})`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

main();
