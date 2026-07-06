"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import AtlasChart from "@/components/AtlasChart";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stats = [
  { label: "Aperture", value: "254 mm" },
  { label: "Focal ratio", value: "f/4.48" },
  { label: "Mount", value: "Alt-az GoTo" },
  { label: "First light", value: "Aug 2026" },
];

export default function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative min-h-svh overflow-hidden">
        {/* The chart IS the hero — interactive everywhere */}
        <AtlasChart className="absolute inset-0" />

        {/* Bottom fade into the page */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />

        <div className="pointer-events-none relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 sm:pb-20 lg:px-8">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="eyebrow mb-5"
            >
              MVHS Physics &amp; Astronomy Club · 37.3894° N, 122.0819° W
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease }}
              className="font-display text-[13vw] leading-[0.95] sm:text-7xl lg:text-8xl"
            >
              Point it at <em className="text-brass-bright">anything.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease }}
              className="mt-6 max-w-xl text-base leading-relaxed text-chart-bright/80 sm:text-lg"
            >
              Seven students at Mountain View High School are building a
              10-inch telescope that aims itself. At first light, anyone can
              request a target — the telescope finds it, photographs it, and
              sends the image back.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.72, ease }}
              className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4"
            >
              <Link href="/#support" className="btn-brass px-7 py-3 text-sm">
                Back the build
              </Link>
              <Link href="/request" className="btn-line px-7 py-3 text-sm">
                Request a target
              </Link>
            </motion.div>
          </div>

          {/* Instrument data strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0, ease }}
            className="mt-14 grid grid-cols-2 gap-y-5 border-t border-chart/15 pt-5 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="pr-6">
                <dt className="eyebrow !text-[0.625rem]">{s.label}</dt>
                <dd className="mt-1 font-mono text-sm text-starlight/90">
                  {s.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Hint that the chart is live */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6, ease }}
          className="pointer-events-none absolute right-8 top-24 hidden font-mono text-[0.625rem] uppercase tracking-[0.22em] text-chart/60 lg:block"
        >
          Live chart — click a target to slew
        </motion.p>
      </section>
    </MotionConfig>
  );
}
