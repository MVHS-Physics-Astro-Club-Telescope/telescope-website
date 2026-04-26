"use client";

import { useState, ReactNode } from "react";

export interface FAQItem {
  question: string;
  answer: ReactNode;
}

interface FAQProps {
  items: FAQItem[];
  /** Stable id prefix so multiple FAQs on a page don't collide */
  idPrefix?: string;
}

/**
 * Accessible disclosure-style FAQ. Each item is a <button> with
 * aria-expanded controlling a region — keyboard and screen reader friendly.
 * Multiple items can be open at once (closer to user mental model).
 */
export default function FAQ({ items, idPrefix = "faq" }: FAQProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="divide-y divide-white/[0.06] rounded-2xl bg-[#0D1219] border border-white/[0.08]">
      {items.map((item, i) => {
        const isOpen = openIndices.has(i);
        const buttonId = `${idPrefix}-q-${i}`;
        const panelId = `${idPrefix}-a-${i}`;
        return (
          <div key={i}>
            <button
              id={buttonId}
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/40 transition-colors"
            >
              <span className="font-heading text-base font-medium text-[rgba(240,240,250,0.95)]">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className={`shrink-0 w-7 h-7 rounded-full border border-white/[0.1] bg-[#121A25] flex items-center justify-center text-[rgba(240,240,250,0.6)] transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-6 text-sm text-[rgba(240,240,250,0.7)] leading-relaxed"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
