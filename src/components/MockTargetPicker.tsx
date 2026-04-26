"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchTargets, Target } from "@/data/targets";

/**
 * Preview of the eventual target-request form.
 * - Typeahead works (client-side filter against curated list)
 * - Selecting a target updates the preview card
 * - Submit button is permanently disabled (telescope under construction)
 *
 * Aim: visitors should feel the future product, not be confused.
 */
export default function MockTargetPicker() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Target | null>(null);
  const [email, setEmail] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const suggestions = searchTargets(query, 6);

  // Click-outside closes the listbox
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(t: Target) {
    setSelected(t);
    setQuery(t.name);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && suggestions[activeIndex]) {
        e.preventDefault();
        pick(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-6 sm:p-8 space-y-6">
      {/* Target picker */}
      <div ref={wrapperRef} className="relative">
        <label
          htmlFor="target-search"
          className="block text-xs font-heading uppercase tracking-[0.15em] text-[rgba(240,240,250,0.5)] mb-2"
        >
          Target
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(240,240,250,0.4)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            id="target-search"
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={
              open && suggestions[activeIndex]
                ? `${listboxId}-opt-${activeIndex}`
                : undefined
            }
            autoComplete="off"
            placeholder="e.g. Andromeda, M42, Saturn…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(0);
              if (!e.target.value) setSelected(null);
            }}
            onFocus={() => query && setOpen(true)}
            onKeyDown={onKeyDown}
            className="w-full pl-11 pr-4 py-3 rounded-full bg-[#121A25] border border-white/[0.08] text-[rgba(240,240,250,0.95)] placeholder:text-[rgba(240,240,250,0.35)] text-sm focus:outline-none focus:border-[#0A84FF]/50 focus:ring-2 focus:ring-[#0A84FF]/20 transition-colors"
          />
        </div>

        {/* Listbox */}
        {open && suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-2xl bg-[#0D1219] border border-white/[0.1] shadow-2xl py-1"
          >
            {suggestions.map((t, i) => (
              <li
                key={t.id}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  // mousedown so it fires before input blur
                  e.preventDefault();
                  pick(t);
                }}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer ${
                  i === activeIndex
                    ? "bg-white/[0.04] text-[rgba(240,240,250,0.95)]"
                    : "text-[rgba(240,240,250,0.75)]"
                }`}
              >
                <span className="text-sm">{t.name}</span>
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[rgba(240,240,250,0.4)]">
                  {t.type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Preview card */}
      {selected && (
        <div className="rounded-xl border border-white/[0.08] bg-[#121A25] p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
            <h4 className="font-heading text-lg font-semibold text-[rgba(240,240,250,0.95)]">
              {selected.name}
            </h4>
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[rgba(240,240,250,0.5)]">
              {selected.type}
            </span>
          </div>
          <p className="text-sm text-[rgba(240,240,250,0.7)] leading-relaxed mb-4">
            {selected.description}
          </p>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <Stat label="Magnitude" value={String(selected.magnitude)} />
            <Stat label="Best month" value={selected.bestMonth} />
            <Stat label="Next window" value="TBD · live data soon" muted />
          </dl>
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="target-email"
          className="block text-xs font-heading uppercase tracking-[0.15em] text-[rgba(240,240,250,0.5)] mb-2"
        >
          Where should we send the image?
        </label>
        <input
          id="target-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-full bg-[#121A25] border border-white/[0.08] text-[rgba(240,240,250,0.95)] placeholder:text-[rgba(240,240,250,0.35)] text-sm focus:outline-none focus:border-[#0A84FF]/50 focus:ring-2 focus:ring-[#0A84FF]/20 transition-colors"
        />
      </div>

      {/* Submit (disabled with explanation) */}
      <div className="pt-2">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Submissions open when telescope goes online"
          className="w-full sm:w-auto btn-titanium-light px-8 py-3 text-sm font-medium rounded-full opacity-60 cursor-not-allowed"
        >
          Submit request
        </button>
        <p className="mt-3 text-xs text-[rgba(240,240,250,0.5)]">
          Submissions open when the telescope goes online. Drop your email
          below and we&apos;ll let you know.
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[rgba(240,240,250,0.4)] mb-1">
        {label}
      </dt>
      <dd
        className={`text-sm ${
          muted
            ? "text-[rgba(240,240,250,0.55)] italic"
            : "text-[rgba(240,240,250,0.9)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
