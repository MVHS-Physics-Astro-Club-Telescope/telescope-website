"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * 16:9 placeholder mocking what the live-view player will eventually look
 * like. NASA/ESA Pillars of Creation acts as the sample frame; everything
 * else (offline pill, status bar, looping exposure progress) is the
 * telemetry chrome that will drive off real data once the telescope is
 * online.
 *
 * Motion philosophy: tasteful, almost-imperceptible. Soft pulse on the
 * offline dot, slow looping exposure progress. No bouncing, no sliding,
 * no flashy reveals.
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

        {/* Vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* OFFLINE pill — top left, soft-pulsing dot */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/[0.08]"
        >
          <span className="relative inline-flex h-2 w-2 items-center justify-center">
            <motion.span
              aria-hidden="true"
              className="absolute inline-flex h-full w-full rounded-full bg-[#FF9F0A]/50"
              animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span
              aria-hidden="true"
              className="relative inline-flex h-2 w-2 rounded-full bg-[#FF9F0A]/95"
            />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[rgba(240,240,250,0.7)]">
            Offline · Awaiting First Light
          </span>
        </motion.div>

        {/* Target label — top right */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/[0.08]"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[rgba(240,240,250,0.55)]">
            Target: Eagle Nebula (M16) · sample
          </span>
        </motion.div>

        {/* Status bar — bottom */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-4 bottom-4 rounded-xl bg-black/55 backdrop-blur-md border border-white/[0.08] px-4 py-3"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono uppercase tracking-[0.15em] text-[rgba(240,240,250,0.55)]">
            <Telemetry label="UTC" value="—:—:—" />
            <Telemetry label="RA" value="18h 18m" />
            <Telemetry label="Dec" value="−13° 49′" />
            <Telemetry label="Exposure" value="0 / 0 s" />
            <Telemetry label="Tracking" value="Idle" />
          </div>
          {/* Looping exposure progress bar — pure CSS so it keeps animating
              even when the tab is backgrounded throttled. */}
          <div className="mt-3 h-1 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div
              aria-hidden="true"
              className="exposure-loop h-full bg-gradient-to-r from-[#0A84FF]/70 via-[#9DC4FF]/80 to-[#0A84FF]/70"
            />
          </div>
        </motion.div>
      </div>

      <figcaption className="mt-3 text-xs text-[rgba(240,240,250,0.6)] text-center leading-relaxed">
        Sample preview — actual live view goes here. Image: Pillars of Creation
        (NASA, ESA, Hubble Heritage Team), public domain.
      </figcaption>
    </figure>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-[rgba(240,240,250,0.4)]">{label}</span>
      <span className="text-[rgba(240,240,250,0.6)]">{value}</span>
    </span>
  );
}
