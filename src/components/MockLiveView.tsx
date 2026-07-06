"use client";

import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";

/**
 * 16:9 placeholder mocking what the live-view player will eventually look
 * like, drawn as an atlas instrument panel: hairline chart borders, mono
 * telemetry readouts, and an H-alpha status marker. NASA/ESA Pillars of
 * Creation acts as the sample frame; everything else is the chrome that
 * will drive off real data once the telescope is online.
 *
 * Motion philosophy: tasteful, almost-imperceptible. Soft pulse on the
 * offline dot, slow looping exposure progress. No bouncing, no sliding.
 */
export default function MockLiveView() {
  return (
    <MotionConfig reducedMotion="user">
      <figure className="relative">
        <div className="tick-corners relative aspect-video overflow-hidden rounded-md border border-chart/20 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
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
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* OFFLINE marker — top left, soft-pulsing H-alpha dot */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-4 top-4 flex items-center gap-2 rounded-sm border border-halpha/35 bg-void/75 px-3 py-1.5"
          >
            <span
              aria-hidden="true"
              className="pulse-dot inline-flex h-2 w-2 rounded-full bg-halpha"
            />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-starlight/75">
              Offline · Awaiting First Light
            </span>
          </motion.div>

          {/* Target label — top right */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-4 top-4 rounded-sm border border-chart/20 bg-void/75 px-3 py-1.5"
          >
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chart-bright/60">
              Target: Eagle Nebula (M16) · sample
            </span>
          </motion.div>

          {/* Status bar — bottom */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-4 bottom-4 rounded-sm border border-chart/20 bg-void/80 px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-chart-bright/60">
              <Telemetry label="UTC" value="—:—:—" />
              <Telemetry label="RA" value="18h 18m" />
              <Telemetry label="Dec" value="−13° 49′" />
              <Telemetry label="Exposure" value="0 / 0 s" />
              <Telemetry label="Tracking" value="Idle" />
            </div>
            {/* Looping exposure progress bar — pure CSS so it keeps animating
                even when the tab is backgrounded throttled. */}
            <div className="mt-3 h-px w-full overflow-hidden bg-chart/15">
              <div
                aria-hidden="true"
                className="exposure-loop h-full bg-brass/80"
              />
            </div>
          </motion.div>
        </div>

        <figcaption className="mt-3 text-center font-mono text-xs leading-relaxed text-chart-bright/55">
          Sample preview — actual live view goes here. Image: Pillars of Creation
          (NASA, ESA, Hubble Heritage Team), public domain.
        </figcaption>
      </figure>
    </MotionConfig>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-chart/70">{label}</span>
      <span className="text-starlight/70">{value}</span>
    </span>
  );
}
