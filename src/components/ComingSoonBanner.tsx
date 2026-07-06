"use client";

import { ReactNode } from "react";
import { motion, MotionConfig } from "framer-motion";
import { Telescope } from "lucide-react";

interface ComingSoonBannerProps {
  /** Short label shown left, e.g. "In Progress" */
  label?: string;
  /** Status text in the pill (defaults to "In progress") */
  status?: string;
  /** Headline above the long-form message */
  headline?: ReactNode;
  /** Long-form message body */
  message: ReactNode;
}

/**
 * Atlas-plate "Coming Soon" banner: an engraved status panel with brass
 * corner ticks, a mono status readout with a soft-pulsing warn dot, and a
 * serif headline. role="status" + aria-live are pinned by the e2e suite.
 */
export default function ComingSoonBanner({
  label = "Coming Soon",
  status = "In Progress",
  headline,
  message,
}: ComingSoonBannerProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="card-atlas tick-corners tick-corners-brass relative overflow-hidden"
      >
        <div className="relative flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-7 sm:py-6">
          {/* Instrument mark + status readout */}
          <div className="flex shrink-0 items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-brass/35 bg-brass/10 text-brass-bright">
              <Telescope className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-brass-bright/90">
                {label}
              </span>
              <span className="mt-1.5 inline-flex items-center gap-1.5 self-start">
                <span
                  aria-hidden="true"
                  className="pulse-dot inline-flex h-1.5 w-1.5 rounded-full bg-brass"
                />
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chart-bright/70">
                  {status}
                </span>
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 sm:border-l sm:border-chart/12 sm:pl-6">
            {headline && (
              <h2 className="mb-1.5 font-display text-lg text-starlight sm:text-xl">
                {headline}
              </h2>
            )}
            <p className="text-sm leading-relaxed text-chart-bright/75 sm:text-[15px]">
              {message}
            </p>
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
