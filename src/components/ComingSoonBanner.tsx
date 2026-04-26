"use client";

import { ReactNode } from "react";

interface ComingSoonBannerProps {
  /** Short label shown left, e.g. "Coming Soon" */
  label?: string;
  /** Main message to the right of the label */
  message: ReactNode;
}

/**
 * Prominent gradient banner used on /observe and /request to set expectations
 * that the telescope is still being built. Designed to feel like anticipation
 * rather than apology — gradient bar + telescope icon + plain English status.
 */
export default function ComingSoonBanner({
  label = "Coming Soon",
  message,
}: ComingSoonBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      {/* Gradient backdrop — keyed to the site's navy/blue accent, no AI-blob feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,132,255,0.18) 0%, rgba(10,132,255,0.06) 35%, rgba(13,18,25,0) 75%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-5 sm:px-7 py-5 sm:py-6">
        {/* Icon + label */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/15 border border-[#0A84FF]/30 flex items-center justify-center text-[#9DC4FF]">
            {/* Telescope-on-tripod glyph */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 11l9-3 2 4.5L5 16z" />
              <path d="M14 12.5l4-1.4" />
              <path d="M9 14l3 7" />
              <path d="M12 14l-3 7" />
              <circle cx="19" cy="9" r="2" />
            </svg>
          </div>
          <span className="font-heading text-xs uppercase tracking-[0.2em] text-[#9DC4FF]">
            {label}
          </span>
        </div>

        {/* Message */}
        <p className="text-sm sm:text-[15px] leading-relaxed text-[rgba(240,240,250,0.85)]">
          {message}
        </p>
      </div>
    </div>
  );
}
