/**
 * Pan and zoom for one drawing inside a fixed viewport.
 *
 * The drawing is laid out at its "fit" size (contained in the viewport) and
 * moved with a single `translate() scale()` on `content`, origin top left.
 * Scale 1 is fit. Everything runs on pointer events and rAF outside React:
 *
 * - one pointer drags 1:1, rubber-bands past the edges, and glides on release
 *   with the release velocity (exponential decay, like scrolling);
 * - two pointers pinch around their midpoint;
 * - wheel and trackpad pinch zoom around the cursor;
 * - double click or double tap zooms to reading size, or back to fit.
 *
 * Animated zooms interpolate scale in log space around the fixed point of the
 * start and end transforms, so the drawing never slides sideways mid-zoom.
 */

export type PanZoomState = { scale: number; atFit: boolean; atMax: boolean };

export type PanZoomOptions = {
  viewport: HTMLElement;
  content: HTMLElement;
  /** Drawing size in its own units (mm); only the aspect and density matter. */
  drawing: { width: number; height: number };
  reducedMotion: () => boolean;
  onChange: (state: PanZoomState) => void;
  onInteract: () => void;
};

export type PanZoom = {
  zoomBy(factor: number): void;
  panBy(dx: number, dy: number): void;
  reset(animate?: boolean): void;
  isZoomed(): boolean;
  destroy(): void;
};

type View = { s: number; x: number; y: number };
type Point = { x: number; y: number };
type Gesture =
  | { kind: "pan"; start: Point; v0: View }
  | { kind: "pinch"; dist0: number; mid0: Point; v0: View };

/** Deepest zoom: 1 mm of drawing = 26 px, so 1.27 mm sheet text is ~33 px. */
const MAX_PX_PER_MM = 26;
/** Double-tap target: sheet text (1.27 mm) at ~13 px. */
const READ_PX_PER_MM = 10;
/** Momentum decay constant in ms (velocity halves every ~150 ms). */
const GLIDE_TAU = 220;
const ZOOM_MS = 320;
const TAP_SLOP = 6;
const DOUBLE_TAP_MS = 320;
const DOUBLE_TAP_SLOP = 28;

/** Apple's rubber-band curve: the further past the edge, the less it follows. */
function rubber(over: number, dim: number, c = 0.55) {
  return (over * dim * c) / (dim + c * Math.abs(over));
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

export function createPanZoom(o: PanZoomOptions): PanZoom {
  let vw = 0; // viewport size, px
  let vh = 0;
  let w = 0; // drawing size at fit, px
  let h = 0;
  let v: View = { s: 1, x: 0, y: 0 };
  /** Where the running animateTo is heading, so a repeated press builds on it. */
  let pending: View | null = null;
  let raf = 0;
  let settleTimer = 0;
  let lastState = "";

  const pointers = new Map<number, Point>();
  let rect: DOMRect | null = null;
  let gesture: Gesture | null = null;
  let samples: { t: number; x: number; y: number }[] = [];
  let lastMid: Point = { x: 0, y: 0 };
  let downAt = 0;
  let downPos: Point = { x: 0, y: 0 };
  let moved = 0;
  let lastTap = { t: -Infinity, x: 0, y: 0 };

  const pxPerMm = () => (w > 0 ? w / o.drawing.width : 1);
  const maxScale = () => Math.max(2, MAX_PX_PER_MM / pxPerMm());
  const readScale = () => Math.min(maxScale(), Math.max(2, READ_PX_PER_MM / pxPerMm()));

  /** Allowed translation on one axis: centred while smaller than the viewport. */
  function range(s: number, dim: number, size: number): [number, number] {
    const c = size * s;
    if (c <= dim) {
      const m = (dim - c) / 2;
      return [m, m];
    }
    return [dim - c, 0];
  }

  function clamp(t: View): View {
    const s = Math.min(Math.max(t.s, 1), maxScale());
    const [x0, x1] = range(s, vw, w);
    const [y0, y1] = range(s, vh, h);
    return { s, x: Math.min(Math.max(t.x, x0), x1), y: Math.min(Math.max(t.y, y0), y1) };
  }

  function soft(t: View): View {
    const [x0, x1] = range(t.s, vw, w);
    const [y0, y1] = range(t.s, vh, h);
    const band = (val: number, lo: number, hi: number, dim: number) =>
      val < lo ? lo - rubber(lo - val, dim) : val > hi ? hi + rubber(val - hi, dim) : val;
    return { s: t.s, x: band(t.x, x0, x1, vw), y: band(t.y, y0, y1, vh) };
  }

  function softScale(raw: number) {
    const lo = 1;
    const hi = maxScale();
    if (raw < lo) return lo * Math.pow(raw / lo, 0.35);
    if (raw > hi) return hi * Math.pow(raw / hi, 0.35);
    return raw;
  }

  /** The view at scale `s` that keeps the drawing point under `p` (in view `from`) in place. */
  function zoomAt(p: Point, s: number, from: View = v): View {
    const cx = (p.x - from.x) / from.s;
    const cy = (p.y - from.y) / from.s;
    return { s, x: p.x - cx * s, y: p.y - cy * s };
  }

  function notify() {
    const max = maxScale();
    const state: PanZoomState = { scale: v.s, atFit: v.s <= 1.001, atMax: v.s >= max * 0.999 };
    const key = `${Math.round(state.scale * 100)}|${state.atFit}|${state.atMax}`;
    if (key === lastState) return;
    lastState = key;
    o.onChange(state);
  }

  function render(next: View) {
    v = next;
    o.content.style.transform = `translate(${next.x}px, ${next.y}px) scale(${next.s})`;
    notify();
  }

  /*
   * While something moves, promote the drawing to its own layer so frames are
   * cheap; drop the hint once it settles so the browser re-rasterises the
   * vector at the final scale and the line-work stays sharp.
   */
  function busy() {
    window.clearTimeout(settleTimer);
    o.content.style.willChange = "transform";
  }
  function idle() {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      o.content.style.willChange = "auto";
    }, 140);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    pending = null;
  }

  function animateTo(target: View, duration = ZOOM_MS) {
    stop();
    const end = clamp(target);
    if (duration === 0 || o.reducedMotion()) {
      render(end);
      idle();
      return;
    }
    pending = end;
    const start = v;
    const ds = start.s - end.s;
    const zooming = Math.abs(ds) > 1e-6;
    // Drawing point that sits at the same screen spot in both views.
    const cx = zooming ? (end.x - start.x) / ds : 0;
    const cy = zooming ? (end.y - start.y) / ds : 0;
    const fx = start.x + start.s * cx;
    const fy = start.y + start.s * cy;
    const t0 = performance.now();
    busy();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = easeOut(p);
      if (p >= 1) {
        render(end);
        raf = 0;
        pending = null;
        idle();
        return;
      }
      if (zooming) {
        const s = start.s * Math.pow(end.s / start.s, e);
        render({ s, x: fx - s * cx, y: fy - s * cy });
      } else {
        render({ s: start.s, x: start.x + (end.x - start.x) * e, y: start.y + (end.y - start.y) * e });
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  /** Carry the release velocity (px/ms) and let it decay, stopping at the edges. */
  function glide(vx: number, vy: number) {
    stop();
    busy();
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const k = Math.exp(-dt / GLIDE_TAU);
      vx *= k;
      vy *= k;
      const raw = { s: v.s, x: v.x + vx * dt, y: v.y + vy * dt };
      const next = clamp(raw);
      if (next.x !== raw.x) vx = 0;
      if (next.y !== raw.y) vy = 0;
      render(next);
      if (Math.hypot(vx, vy) > 0.02) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
        idle();
      }
    };
    raf = requestAnimationFrame(step);
  }

  function velocity(): Point {
    if (samples.length < 2) return { x: 0, y: 0 };
    const a = samples[0];
    const b = samples[samples.length - 1];
    const dt = b.t - a.t;
    // A finger that paused before lifting has no momentum left.
    if (dt <= 0 || performance.now() - b.t > 60) return { x: 0, y: 0 };
    return { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt };
  }

  function local(e: PointerEvent | WheelEvent): Point {
    const r = rect ?? o.viewport.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  /** (Re)start the gesture from the pointers now down, from the current view. */
  function begin() {
    const pts = [...pointers.values()];
    samples = [];
    if (pts.length >= 2) {
      const [a, b] = pts;
      lastMid = mid(a, b);
      gesture = { kind: "pinch", dist0: Math.hypot(b.x - a.x, b.y - a.y), mid0: lastMid, v0: v };
    } else if (pts.length === 1) {
      gesture = { kind: "pan", start: pts[0], v0: v };
      samples.push({ t: performance.now(), ...pts[0] });
    } else {
      gesture = null;
    }
  }

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (pointers.size >= 2) return; // a third finger changes nothing
    rect = o.viewport.getBoundingClientRect();
    o.viewport.setPointerCapture(e.pointerId);
    const p = local(e);
    pointers.set(e.pointerId, p);
    stop();
    busy();
    o.onInteract();
    if (pointers.size === 1) {
      downAt = e.timeStamp;
      downPos = p;
      moved = 0;
    } else {
      moved = Infinity;
    }
    begin();
  }

  function onPointerMove(e: PointerEvent) {
    if (!pointers.has(e.pointerId) || !gesture) return;
    const p = local(e);
    pointers.set(e.pointerId, p);
    if (gesture.kind === "pan") {
      moved = Math.max(moved, Math.hypot(p.x - downPos.x, p.y - downPos.y));
      const { v0, start } = gesture;
      render(soft({ s: v0.s, x: v0.x + p.x - start.x, y: v0.y + p.y - start.y }));
      const now = performance.now();
      samples.push({ t: now, x: p.x, y: p.y });
      while (samples.length > 2 && now - samples[0].t > 100) samples.shift();
      return;
    }
    const [a, b] = [...pointers.values()];
    const m = mid(a, b);
    lastMid = m;
    const { v0, mid0, dist0 } = gesture;
    const s = softScale((v0.s * Math.hypot(b.x - a.x, b.y - a.y)) / Math.max(dist0, 1));
    const cx = (mid0.x - v0.x) / v0.s;
    const cy = (mid0.y - v0.y) / v0.s;
    render(soft({ s, x: m.x - cx * s, y: m.y - cy * s }));
  }

  function onPointerUp(e: PointerEvent) {
    if (!pointers.has(e.pointerId)) return;
    const p = local(e);
    pointers.delete(e.pointerId);
    const ended = gesture;
    if (pointers.size > 0) {
      // Pinch down to one finger: keep dragging from here, no jump.
      begin();
      return;
    }
    gesture = null;
    rect = null;

    const isTap =
      e.type === "pointerup" && ended?.kind === "pan" && moved < TAP_SLOP && e.timeStamp - downAt < 300;
    if (isTap) {
      const double =
        e.timeStamp - lastTap.t < DOUBLE_TAP_MS && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < DOUBLE_TAP_SLOP;
      if (double) {
        lastTap = { t: -Infinity, x: 0, y: 0 };
        if (v.s > 1.05) animateTo({ s: 1, x: 0, y: 0 });
        else animateTo(zoomAt(p, readScale()));
        return;
      }
      lastTap = { t: e.timeStamp, x: p.x, y: p.y };
    }

    if (ended?.kind === "pinch" || v.s < 1 || v.s > maxScale()) {
      const s = Math.min(Math.max(v.s, 1), maxScale());
      animateTo(zoomAt(lastMid, s), 280);
      return;
    }
    const target = clamp(v);
    if (target.x !== v.x || target.y !== v.y) {
      animateTo(target, 300);
      return;
    }
    const vel = velocity();
    if (Math.hypot(vel.x, vel.y) > 0.05) glide(vel.x, vel.y);
    else idle();
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    stop();
    busy();
    o.onInteract();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * vh : e.deltaY;
    // Trackpad pinch arrives as ctrl+wheel with small deltas.
    const k = e.ctrlKey ? 0.01 : 0.0022;
    const s = Math.min(Math.max(v.s * Math.exp(-dy * k), 1), maxScale());
    // Mid-drag the rect from pointerdown still holds; otherwise measure afresh.
    if (!pointers.size) rect = null;
    render(clamp(zoomAt(local(e), s)));
    // A drag or pinch in progress carries on from the zoomed view, not its old start.
    if (pointers.size) begin();
    idle();
  }

  function layout() {
    const nvw = o.viewport.clientWidth;
    const nvh = o.viewport.clientHeight;
    if (!nvw || !nvh) return;
    // The SVG carries its own 6 mm margin, so phones can use the full width.
    const pad = nvw < 640 ? 2 : 24;
    const fit = Math.max(
      0.01,
      Math.min((nvw - 2 * pad) / o.drawing.width, (nvh - 2 * pad) / o.drawing.height),
    );
    const nw = o.drawing.width * fit;
    const nh = o.drawing.height * fit;
    // Keep whatever was at the centre of the viewport there, at the same zoom.
    const fx = w > 0 ? (vw / 2 - v.x) / (w * v.s) : 0.5;
    const fy = h > 0 ? (vh / 2 - v.y) / (h * v.s) : 0.5;
    vw = nvw;
    vh = nvh;
    w = nw;
    h = nh;
    o.content.style.width = `${w}px`;
    o.content.style.height = `${h}px`;
    lastState = "";
    render(clamp({ s: v.s, x: vw / 2 - fx * w * v.s, y: vh / 2 - fy * h * v.s }));
  }

  const vp = o.viewport;
  vp.addEventListener("pointerdown", onPointerDown);
  vp.addEventListener("pointermove", onPointerMove);
  vp.addEventListener("pointerup", onPointerUp);
  vp.addEventListener("pointercancel", onPointerUp);
  vp.addEventListener("wheel", onWheel, { passive: false });
  const ro = new ResizeObserver(layout);
  ro.observe(vp);
  layout();

  // Buttons and keys build on where a running animation is heading, so each
  // press moves a full step however fast they come.
  return {
    zoomBy(factor) {
      o.onInteract();
      const from = pending ?? v;
      const s = Math.min(Math.max(from.s * factor, 1), maxScale());
      animateTo(zoomAt({ x: vw / 2, y: vh / 2 }, s, from));
    },
    panBy(dx, dy) {
      o.onInteract();
      const from = pending ?? v;
      animateTo({ s: from.s, x: from.x + dx, y: from.y + dy }, 180);
    },
    reset(animate = true) {
      animateTo({ s: 1, x: 0, y: 0 }, animate ? ZOOM_MS : 0);
    },
    isZoomed: () => (pending ?? v).s > 1.001,
    destroy() {
      stop();
      window.clearTimeout(settleTimer);
      ro.disconnect();
      vp.removeEventListener("pointerdown", onPointerDown);
      vp.removeEventListener("pointermove", onPointerMove);
      vp.removeEventListener("pointerup", onPointerUp);
      vp.removeEventListener("pointercancel", onPointerUp);
      vp.removeEventListener("wheel", onWheel);
    },
  };
}
