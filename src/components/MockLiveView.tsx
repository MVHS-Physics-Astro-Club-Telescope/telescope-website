"use client";

import Image from "next/image";

/**
 * Decorative 16:9 placeholder mocking what the live-view player will look like.
 * Shows a sample astrophotography image (Pillars of Creation, public domain
 * NASA/ESA/STScI) overlaid with dimmed telemetry chrome to make clear the
 * telescope is not currently online.
 */
export default function MockLiveView() {
  return (
    <figure className="relative">
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.1] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] bg-black">
        {/* Sample image */}
        <Image
          src="/observe/preview-hero.jpg"
          alt="Sample preview: NASA's Hubble Space Telescope view of the Pillars of Creation in the Eagle Nebula"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover opacity-90"
        />

        {/* Vignette + scan-line atmosphere (kept very subtle) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* "OFFLINE" pill — top left */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-[#FF9F0A]/80" aria-hidden="true" />
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[rgba(240,240,250,0.7)]">
            Offline · Awaiting First Light
          </span>
        </div>

        {/* Target label — top right */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/[0.08]">
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[rgba(240,240,250,0.55)]">
            Target: Eagle Nebula (M16) · sample
          </span>
        </div>

        {/* Status bar — bottom */}
        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-black/55 backdrop-blur-md border border-white/[0.08] px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono uppercase tracking-[0.15em] text-[rgba(240,240,250,0.55)]">
            <Telemetry label="UTC" value="—:—:—" dim />
            <Telemetry label="RA" value="18h 18m" dim />
            <Telemetry label="Dec" value="−13° 49′" dim />
            <Telemetry label="Exposure" value="0 / 0 s" dim />
            <Telemetry label="Tracking" value="Idle" dim />
          </div>
          {/* Exposure progress bar (empty) */}
          <div className="mt-3 h-1 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div className="h-full w-[3%] bg-[#0A84FF]/40" />
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-xs text-[rgba(240,240,250,0.6)] text-center leading-relaxed">
        Sample preview — actual live view goes here. Image: Pillars of Creation
        (NASA, ESA, Hubble Heritage Team), public domain.
      </figcaption>
    </figure>
  );
}

function Telemetry({
  label,
  value,
  dim,
}: {
  label: string;
  value: string;
  dim?: boolean;
}) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-[rgba(240,240,250,0.4)]">{label}</span>
      <span
        className={
          dim
            ? "text-[rgba(240,240,250,0.6)]"
            : "text-[rgba(240,240,250,0.95)]"
        }
      >
        {value}
      </span>
    </span>
  );
}
