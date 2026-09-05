/**
 * Tonight over Mountain View.
 *
 * Server component. Pulls the astronomical forecast from 7Timer (free, no
 * key) for the observatory site and shows the four numbers an observer
 * cares about: cloud cover, seeing, moon, sunset. Degrades to the moon and
 * sunset (computed locally) if the forecast is unreachable.
 */
export const TONIGHT_LAT = 37.366;
export const TONIGHT_LON = -122.077;

interface SeventimerSeries {
  timepoint: number;
  cloudcover: number; // 1..9
  seeing: number; // 1..8
  transparency: number;
}
interface SeventimerPayload {
  init: string; // YYYYMMDDHH UTC
  dataseries: SeventimerSeries[];
}

interface Forecast {
  cloudPct: number;
  seeingArcsec: number;
  moonIllum: number;
  moonPhaseName: string;
  sunsetLocal: string;
  ok: boolean;
}

const cloudBucketMidPct: Record<number, number> = { 1: 3, 2: 12, 3: 25, 4: 37, 5: 50, 6: 62, 7: 75, 8: 87, 9: 97 };
const seeingArcsec: Record<number, number> = { 1: 0.5, 2: 0.75, 3: 1.0, 4: 1.25, 5: 1.75, 6: 2.5, 7: 3.5, 8: 5.0 };

function moonInfo(d: Date): { illum: number; phase: string } {
  const SYN = 29.530588853;
  const ref = Date.UTC(2000, 0, 6, 18, 14, 0) / 1000;
  const now = d.getTime() / 1000;
  let phase = ((now - ref) / 86400 / SYN) % 1;
  if (phase < 0) phase += 1;
  const illum = 0.5 * (1 - Math.cos(2 * Math.PI * phase));
  let name: string;
  if (phase < 0.03 || phase > 0.97) name = "New moon";
  else if (phase < 0.22) name = "Waxing crescent";
  else if (phase < 0.28) name = "First quarter";
  else if (phase < 0.47) name = "Waxing gibbous";
  else if (phase < 0.53) name = "Full moon";
  else if (phase < 0.72) name = "Waning gibbous";
  else if (phase < 0.78) name = "Last quarter";
  else name = "Waning crescent";
  return { illum, phase: name };
}

/** NOAA-style sunset, accurate to about a minute. */
function sunsetFor(date: Date, lat: number, lon: number): Date {
  const J2000 = 2451545;
  const days =
    Math.floor(
      (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(2000, 0, 1, 12, 0, 0)) /
        86400000,
    ) + 1;
  const n = days - lon / 360;
  const Jstar = 2451545 + n;
  const M = (357.5291 + 0.98560028 * (Jstar - J2000)) % 360;
  const Mrad = (M * Math.PI) / 180;
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = (lambda * Math.PI) / 180;
  const Jtransit = Jstar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);
  const delta = Math.asin(Math.sin(lambdaRad) * Math.sin((23.44 * Math.PI) / 180));
  const phi = (lat * Math.PI) / 180;
  const cosH =
    (Math.sin((-0.83 * Math.PI) / 180) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));
  if (cosH < -1 || cosH > 1) return new Date(NaN);
  const H = (Math.acos(cosH) * 180) / Math.PI;
  const Jset = Jtransit + H / 360;
  return new Date((Jset - 2440587.5) * 86400000);
}

function parseInit(init: string): Date {
  if (!init || init.length < 10) return new Date();
  return new Date(Date.UTC(+init.slice(0, 4), +init.slice(4, 6) - 1, +init.slice(6, 8), +init.slice(8, 10)));
}

async function fetchForecast(): Promise<Forecast> {
  const now = new Date();
  const moon = moonInfo(now);
  const sunset = sunsetFor(now, TONIGHT_LAT, TONIGHT_LON);
  const sunsetLocal = isNaN(sunset.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" }).format(sunset);

  try {
    const url = `https://www.7timer.info/bin/astro.php?lon=${TONIGHT_LON}&lat=${TONIGHT_LAT}&ac=0&unit=metric&output=json&tzshift=0`;
    const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`7Timer ${res.status}`);
    const data = (await res.json()) as SeventimerPayload;
    const init = parseInit(data.init);
    const target = new Date();
    target.setUTCHours(target.getUTCHours() + 4); // ~9 pm Pacific
    let best = data.dataseries[0];
    let bestDiff = Infinity;
    for (const s of data.dataseries) {
      const t = new Date(init.getTime() + s.timepoint * 3600 * 1000);
      const diff = Math.abs(t.getTime() - target.getTime());
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
    };
  } catch {
    return { cloudPct: -1, seeingArcsec: -1, moonIllum: moon.illum, moonPhaseName: moon.phase, sunsetLocal, ok: false };
  }
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" | "bad" }) {
  const color = tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : tone === "bad" ? "text-bad" : "text-ink";
  return (
    <div className="row flex items-baseline justify-between gap-6 py-4">
      <dt className="text-[0.9375rem] text-ink-2">{label}</dt>
      <dd className={`font-mono text-[0.9375rem] tabular-nums ${color}`}>{value}</dd>
    </div>
  );
}

export default async function TonightAtMV() {
  const f = await fetchForecast();
  const cloudTone = f.cloudPct < 0 ? undefined : f.cloudPct < 25 ? "ok" : f.cloudPct < 60 ? "warn" : "bad";
  const seeingTone = f.seeingArcsec < 0 ? undefined : f.seeingArcsec < 1.5 ? "ok" : f.seeingArcsec < 3 ? "warn" : "bad";

  return (
    <section aria-label="Tonight's sky conditions at MV">
      <dl>
        <Row label="Cloud cover" value={f.cloudPct >= 0 ? `${Math.round(f.cloudPct)}%` : "—"} tone={cloudTone} />
        <Row label="Seeing" value={f.seeingArcsec > 0 ? `${f.seeingArcsec.toFixed(1)}″` : "—"} tone={seeingTone} />
        <Row label={f.moonPhaseName} value={`${Math.round(f.moonIllum * 100)}% lit`} />
        <Row label="Sunset" value={f.sunsetLocal} />
      </dl>
      <p className="mt-3 text-[0.8125rem] text-ink-3">
        {f.ok ? "Forecast from 7Timer for 37.37° N, 122.08° W, refreshed every 30 minutes." : "Forecast unavailable right now; moon and sunset computed locally."}
      </p>
    </section>
  );
}

export function TonightAtMVSkeleton() {
  return (
    <div aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="row flex justify-between py-4">
          <span className="h-4 w-24 bg-white/10" />
          <span className="h-4 w-12 bg-white/10" />
        </div>
      ))}
    </div>
  );
}
