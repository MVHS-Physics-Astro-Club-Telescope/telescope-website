import { Cloud, Moon, Sunset, Eye, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * "Tonight at MVHS" widget.
 *
 * Server component — fetches forecast from 7Timer (free, no key) for the
 * MVHS observatory site (lat 37.366, lon −122.077) and surfaces the four
 * numbers a sponsor or visitor cares about: cloud cover, seeing, moon
 * illumination, and sunset time. Falls back gracefully if the API is down.
 */
export const TONIGHT_LAT = 37.366;
export const TONIGHT_LON = -122.077;

interface SeventimerSeries {
  timepoint: number; // hours from init
  cloudcover: number; // 1..9 (1 = 0–6%, 9 = 94–100%)
  seeing: number; // 1..8 (1 best)
  transparency: number; // 1..8
  prec_type?: string;
  rh2m?: number | string;
}
interface SeventimerPayload {
  init: string; // YYYYMMDDHH UTC
  dataseries: SeventimerSeries[];
}

interface Forecast {
  cloudPct: number;
  seeingArcsec: number;
  moonIllum: number; // 0..1
  moonPhaseName: string;
  sunsetLocal: string;
  ok: boolean;
  fetchedAt: string;
}

const cloudBucketMidPct: Record<number, number> = {
  1: 3,
  2: 12,
  3: 25,
  4: 37,
  5: 50,
  6: 62,
  7: 75,
  8: 87,
  9: 97,
};

const seeingArcsec: Record<number, number> = {
  1: 0.5,
  2: 0.75,
  3: 1.0,
  4: 1.25,
  5: 1.75,
  6: 2.5,
  7: 3.5,
  8: 5.0,
};

/** Compute moon illumination fraction for a given JS Date (approx, ±~1%). */
function moonInfo(d: Date): { illum: number; phase: string } {
  // Synodic month length in days
  const SYN = 29.530588853;
  // Reference new moon: 2000-01-06 18:14 UTC
  const ref = Date.UTC(2000, 0, 6, 18, 14, 0) / 1000;
  const now = d.getTime() / 1000;
  let phase = ((now - ref) / 86400 / SYN) % 1;
  if (phase < 0) phase += 1;
  const illum = 0.5 * (1 - Math.cos(2 * Math.PI * phase));
  let phaseName: string;
  if (phase < 0.03 || phase > 0.97) phaseName = "New moon";
  else if (phase < 0.22) phaseName = "Waxing crescent";
  else if (phase < 0.28) phaseName = "First quarter";
  else if (phase < 0.47) phaseName = "Waxing gibbous";
  else if (phase < 0.53) phaseName = "Full moon";
  else if (phase < 0.72) phaseName = "Waning gibbous";
  else if (phase < 0.78) phaseName = "Last quarter";
  else phaseName = "Waning crescent";
  return { illum, phase: phaseName };
}

/** Minimal sunset calculator (NOAA-ish, accurate to ~1 minute). */
function sunsetFor(date: Date, lat: number, lon: number): Date {
  const J2000 = 2451545;
  const days =
    Math.floor(
      (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
        Date.UTC(2000, 0, 1, 12, 0, 0)) /
        86400000,
    ) + 1;
  const n = days - lon / 360;
  const Jstar = 2451545 + n;
  const M = (357.5291 + 0.98560028 * (Jstar - J2000)) % 360;
  const Mrad = (M * Math.PI) / 180;
  const C =
    1.9148 * Math.sin(Mrad) +
    0.02 * Math.sin(2 * Mrad) +
    0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = (lambda * Math.PI) / 180;
  const Jtransit =
    Jstar +
    0.0053 * Math.sin(Mrad) -
    0.0069 * Math.sin(2 * lambdaRad);
  const delta = Math.asin(Math.sin(lambdaRad) * Math.sin((23.44 * Math.PI) / 180));
  const phi = (lat * Math.PI) / 180;
  const cosH =
    (Math.sin((-0.83 * Math.PI) / 180) - Math.sin(phi) * Math.sin(delta)) /
    (Math.cos(phi) * Math.cos(delta));
  if (cosH < -1 || cosH > 1) return new Date(NaN);
  const H = (Math.acos(cosH) * 180) / Math.PI;
  const Jset = Jtransit + H / 360;
  const ms = (Jset - 2440587.5) * 86400000;
  return new Date(ms);
}

async function fetchForecast(): Promise<Forecast> {
  const now = new Date();
  const moon = moonInfo(now);
  const sunset = sunsetFor(now, TONIGHT_LAT, TONIGHT_LON);
  const sunsetLocal = isNaN(sunset.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "2-digit",
      }).format(sunset);

  try {
    const url = `https://www.7timer.info/bin/astro.php?lon=${TONIGHT_LON}&lat=${TONIGHT_LAT}&ac=0&unit=metric&output=json&tzshift=0`;
    const res = await fetch(url, {
      // Cache 30 minutes — forecast doesn't change faster than that anyway,
      // and we don't want every page load slamming 7Timer.
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`7Timer ${res.status}`);
    const data = (await res.json()) as SeventimerPayload;

    // Pick the timepoint nearest to "tonight @ 22:00 local" — 7Timer steps
    // every 3h. We have init (YYYYMMDDHH UTC) and timepoints in hours.
    const init = parseInit(data.init);
    const targetUTC = new Date();
    targetUTC.setUTCHours(targetUTC.getUTCHours() + 4); // ~9pm Pacific = ~04 UTC next day; close enough for 3h-step lookup
    let best = data.dataseries[0];
    let bestDiff = Infinity;
    for (const s of data.dataseries) {
      const t = new Date(init.getTime() + s.timepoint * 3600 * 1000);
      const diff = Math.abs(t.getTime() - targetUTC.getTime());
      if (diff < bestDiff) {
        bestDiff = diff;
        best = s;
      }
    }
    return {
      cloudPct: cloudBucketMidPct[best.cloudcover] ?? 50,
      seeingArcsec: seeingArcsec[best.seeing] ?? 2.0,
      moonIllum: moon.illum,
      moonPhaseName: moon.phase,
      sunsetLocal,
      ok: true,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return {
      cloudPct: -1,
      seeingArcsec: -1,
      moonIllum: moon.illum,
      moonPhaseName: moon.phase,
      sunsetLocal,
      ok: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

function parseInit(init: string): Date {
  // "2026042518" -> 2026-04-25T18:00:00Z
  if (!init || init.length < 10) return new Date();
  const y = Number(init.slice(0, 4));
  const m = Number(init.slice(4, 6)) - 1;
  const d = Number(init.slice(6, 8));
  const h = Number(init.slice(8, 10));
  return new Date(Date.UTC(y, m, d, h));
}

export default async function TonightAtMVHS() {
  const f = await fetchForecast();

  return (
    <section
      aria-label="Tonight's sky conditions at MVHS"
      className="relative overflow-hidden rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-6 sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[rgba(240,240,250,0.5)]">
            Tonight at MVHS · 37.37°N
          </p>
          <h2 className="font-heading text-xl sm:text-[22px] font-semibold text-[rgba(240,240,250,0.97)] mt-1">
            What the sky looks like right now
          </h2>
        </div>
        {!f.ok && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-[#FF9F0A]/35 bg-[#FF9F0A]/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-[#ffc266]"
            title="Forecast service unreachable — partial data shown"
          >
            <AlertCircle className="h-3 w-3" />
            Partial
          </span>
        )}
      </div>

      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile
          icon={<Cloud className="h-4 w-4" />}
          label="Cloud cover"
          value={
            f.cloudPct >= 0 ? `${Math.round(f.cloudPct)}%` : "—"
          }
          accent={
            f.cloudPct < 0
              ? undefined
              : f.cloudPct < 25
                ? "good"
                : f.cloudPct < 60
                  ? "okay"
                  : "bad"
          }
        />
        <Tile
          icon={<Eye className="h-4 w-4" />}
          label="Seeing"
          value={
            f.seeingArcsec > 0 ? `${f.seeingArcsec.toFixed(1)}″` : "—"
          }
          accent={
            f.seeingArcsec < 0
              ? undefined
              : f.seeingArcsec < 1.5
                ? "good"
                : f.seeingArcsec < 3
                  ? "okay"
                  : "bad"
          }
        />
        <Tile
          icon={<Moon className="h-4 w-4" />}
          label={f.moonPhaseName}
          value={`${Math.round(f.moonIllum * 100)}% lit`}
        />
        <Tile
          icon={<Sunset className="h-4 w-4" />}
          label="Sunset"
          value={f.sunsetLocal}
        />
      </dl>

      <p className="mt-5 text-[11px] text-[rgba(240,240,250,0.65)] leading-relaxed">
        Live forecast from 7Timer · Mountain View, CA. Updates every 30
        minutes. Once the telescope is online, this widget will also show
        whether tonight&apos;s queue is currently capturing.
      </p>
    </section>
  );
}

/**
 * `Tile` wraps a `<dt>` label and `<dd>` value inside a grouping `<div>`
 * (allowed under HTML5 `<dl>` content model — a `div` may group a
 * dt/dd pair). This gives screen readers a proper term-description
 * association (WCAG 1.3.1) while keeping the original card visual.
 */
function Tile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "good" | "okay" | "bad";
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#121A25] px-4 py-3.5">
      <dt className="flex items-center gap-2 mb-1.5 text-[rgba(240,240,250,0.55)]">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md",
            accent === "good" && "bg-[#30D158]/12 text-[#7ee79b]",
            accent === "okay" && "bg-[#FF9F0A]/12 text-[#ffc266]",
            accent === "bad" && "bg-[#FF453A]/12 text-[#ff8478]",
            !accent && "bg-white/[0.04] text-[rgba(240,240,250,0.6)]",
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] truncate">
          {label}
        </span>
      </dt>
      <dd className="font-heading text-[18px] sm:text-[19px] font-semibold tabular-nums text-[rgba(240,240,250,0.97)]">
        {value}
      </dd>
    </div>
  );
}

export function TonightAtMVHSSkeleton() {
  return (
    <section className="rounded-2xl bg-[#0D1219] border border-white/[0.08] p-6 sm:p-7">
      <Skeleton className="h-3 w-40 mb-2 rounded-full" />
      <Skeleton className="h-6 w-72 mb-5 rounded-md" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.06] bg-[#121A25] px-4 py-3.5"
          >
            <Skeleton className="h-4 w-20 mb-2 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
