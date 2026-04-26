"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
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
 * Distinctive "Coming Soon" banner. Animated telescope icon, status pill
 * with a soft-pulsing dot ("In Progress"), headline + sub-copy. Tuned
 * to the navy / titanium identity — no purple radial gradients.
 */
export default function ComingSoonBanner({
  label = "Coming Soon",
  status = "In Progress",
  headline,
  message,
}: ComingSoonBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1219] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      {/* Subtle directional gradient — keyed to navy/blue, not pink-purple AI slop */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,132,255,0.14) 0%, rgba(10,132,255,0.05) 35%, rgba(13,18,25,0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 px-5 sm:px-7 py-5 sm:py-6">
        {/* Animated icon block */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-11 h-11 rounded-xl bg-[#0A84FF]/12 border border-[#0A84FF]/30 flex items-center justify-center text-[#9DC4FF]"
          >
            {/* Soft halo behind icon */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl bg-[#0A84FF]/15"
              animate={{ opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <Telescope className="relative h-5 w-5" aria-hidden="true" />
          </motion.div>

          <div className="flex flex-col">
            <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-[#9DC4FF]/80">
              {label}
            </span>
            {/* Status pill: "In Progress" + soft-pulse dot */}
            <span className="mt-1 inline-flex items-center gap-1.5 self-start">
              <span
                aria-hidden="true"
                className="pulse-dot relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0A84FF] shadow-[0_0_6px_rgba(10,132,255,0.7)]"
              />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[rgba(240,240,250,0.65)]">
                {status}
              </span>
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 sm:border-l sm:border-white/[0.06] sm:pl-6">
          {headline && (
            <h3 className="font-heading text-[15px] sm:text-base font-semibold text-[rgba(240,240,250,0.97)] mb-1.5">
              {headline}
            </h3>
          )}
          <p className="text-sm sm:text-[15px] leading-relaxed text-[rgba(240,240,250,0.78)]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
