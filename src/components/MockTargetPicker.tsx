"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command as CommandRoot,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Target, targets as ALL_TARGETS, tierOf } from "@/data/targets";

type ChipKey = "all" | "Moon" | "Planet" | "Galaxy" | "Nebula" | "Cluster";

const CHIPS: { key: ChipKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Moon", label: "Moon" },
  { key: "Planet", label: "Planets" },
  { key: "Galaxy", label: "Galaxies" },
  { key: "Nebula", label: "Nebulae" },
  { key: "Cluster", label: "Clusters" },
];

function matchesChip(t: Target, chip: ChipKey): boolean {
  if (chip === "all") return true;
  if (chip === "Cluster") return t.type === "Star Cluster";
  return t.type === chip;
}

/**
 * Preview of the request flow. A command palette (⌘K) over the curated
 * catalog, filter chips, an email field, and a submit button that stays
 * locked until the telescope is online.
 */
export default function MockTargetPicker() {
  const [open, setOpen] = useState(false);
  const [chip, setChip] = useState<ChipKey>("all");
  const [selected, setSelected] = useState<Target | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const previewId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function validateEmail(v: string) {
    if (!v) return "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "That doesn't look like a valid email.";
  }

  const { easy, challenging } = useMemo(() => {
    const filtered = ALL_TARGETS.filter((t) => matchesChip(t, chip));
    return {
      easy: filtered.filter((t) => tierOf(t) === "easy"),
      challenging: filtered.filter((t) => tierOf(t) === "challenging"),
    };
  }, [chip]);

  function pick(t: Target) {
    setSelected(t);
    setOpen(false);
  }

  function onChipKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = CHIPS.length - 1;
    let next = -1;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    setChip(CHIPS[next].key);
    chipRefs.current[next]?.focus();
  }

  return (
    <div className="space-y-8">
      {/* Filter */}
      <div>
        <label htmlFor="target-chips" className="label block">
          Filter
        </label>
        <div id="target-chips" role="radiogroup" className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {CHIPS.map((c, i) => {
            const active = chip === c.key;
            return (
              <button
                key={c.key}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onKeyDown={(e) => onChipKeyDown(e, i)}
                onClick={() => setChip(c.key)}
                className={cn(
                  "nav-link text-[0.9375rem]",
                  active && "text-ink underline decoration-1 underline-offset-[6px]",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trigger */}
      <div>
        <label htmlFor="target-search" className="label block">
          Target
        </label>
        <button
          id="target-search"
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="target-command-dialog"
          aria-keyshortcuts="Meta+K Control+K"
          className="field mt-3 flex items-center justify-between gap-3 text-left"
        >
          <span className={cn("truncate", selected ? "text-ink" : "text-ink-3")}>
            {selected ? selected.name : "Search targets: Andromeda, M42, Saturn…"}
          </span>
          <kbd className="hidden shrink-0 font-mono text-[0.75rem] text-ink-3 sm:inline">⌘K</kbd>
        </button>
      </div>

      {/* Preview */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            id={previewId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-line pt-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-2xl text-ink">{selected.name}</h3>
              <p className="text-[0.8125rem] text-ink-3">
                {tierOf(selected) === "easy" ? "Easy" : "Challenging"} · {selected.type}
              </p>
            </div>
            <p className="prose-tight mt-2 text-[0.9375rem]">{selected.description}</p>
            <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-2 text-[0.875rem]">
              <div>
                <dt className="label">Magnitude</dt>
                <dd className="mt-1 font-mono text-ink">{String(selected.magnitude)}</dd>
              </div>
              <div>
                <dt className="label">Best month</dt>
                <dd className="mt-1 font-mono text-ink">{selected.bestMonth}</dd>
              </div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <div>
        <label htmlFor="target-email" className="label block">
          Where should we send the image?
        </label>
        <input
          id="target-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(validateEmail(e.target.value));
          }}
          onBlur={(e) => setEmailError(validateEmail(e.target.value))}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "target-email-error" : undefined}
          className="field mt-3"
        />
        {emailError && (
          <p id="target-email-error" role="alert" className="mt-2 text-[0.8125rem] text-bad">
            {emailError}
          </p>
        )}
      </div>

      {/* Submit, locked */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <TooltipProvider delay={150}>
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-disabled="true"
                  aria-label="Submit request — submissions open at first light"
                  title="Submissions open when telescope goes online"
                  onClick={(e) => e.preventDefault()}
                  onFocus={() => setTooltipOpen(true)}
                  onBlur={() => setTooltipOpen(false)}
                  onMouseEnter={() => setTooltipOpen(true)}
                  onMouseLeave={() => setTooltipOpen(false)}
                  className="btn shrink-0"
                >
                  Submit request
                </button>
              }
            />
            <TooltipContent side="top" className="rounded-md border border-line bg-[#0a0a0a] px-3 py-1.5 text-[0.8125rem] text-ink">
              Locks open at first light
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-[0.875rem] text-ink-3">Submissions open when the telescope goes online.</p>
      </div>

      {/* Palette */}
      <AnimatePresence onExitComplete={() => triggerRef.current?.focus({ preventScroll: true })}>
        {open && (
          <motion.div
            id="target-command-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Search targets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]"
          >
            <button
              type="button"
              aria-label="Close target search"
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-default bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-[#0a0a0a] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
            >
              <CommandRoot
                loop
                className="rounded-xl bg-transparent"
                filter={(value, search) => {
                  if (!search) return 1;
                  return value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0;
                }}
              >
                <div className="flex items-center gap-3 border-b border-line px-4 pb-3 pt-4">
                  <CommandInput
                    autoFocus
                    placeholder="Type to search: Andromeda, M42, Saturn…"
                    className="flex-1 border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3 focus-visible:ring-0 [&_[data-slot=input-group]]:!h-auto [&_[data-slot=input-group]]:!border-0 [&_[data-slot=input-group]]:!bg-transparent [&_[data-slot=input-group]]:!shadow-none [&_[data-slot=input-group-addon]]:hidden"
                  />
                  <kbd className="hidden font-mono text-[0.75rem] text-ink-3 sm:inline">Esc</kbd>
                </div>

                <CommandList className="max-h-[60vh] py-2">
                  <CommandEmpty className="px-6 py-10 text-center">
                    <p className="text-[0.9375rem] text-ink">Nothing in the catalog matches that.</p>
                    <p className="mt-1 text-[0.8125rem] text-ink-3">Try a Messier number, a planet, or a common name.</p>
                  </CommandEmpty>

                  {easy.length > 0 && (
                    <CommandGroup heading="Easy" className="px-2 [&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
                      {easy.map((t) => (
                        <PaletteItem key={t.id} t={t} onPick={pick} />
                      ))}
                    </CommandGroup>
                  )}
                  {challenging.length > 0 && (
                    <CommandGroup heading="Challenging" className="px-2 [&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
                      {challenging.map((t) => (
                        <PaletteItem key={t.id} t={t} onPick={pick} />
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>

                <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2 text-[0.75rem] text-ink-3">
                  <span className="font-mono">↑↓ navigate · ↵ select</span>
                  <span className="font-mono">{easy.length + challenging.length} targets</span>
                </div>
              </CommandRoot>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PaletteItem({ t, onPick }: { t: Target; onPick: (t: Target) => void }) {
  return (
    <CommandItem
      value={[t.name, ...t.aliases].join(" ")}
      onSelect={() => onPick(t)}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[0.9375rem] text-ink-2",
        "data-selected:bg-white/8 data-[selected=true]:bg-white/8 aria-selected:bg-white/8",
        "data-selected:text-ink aria-selected:text-ink",
      )}
    >
      <div className="min-w-0 flex-1">
        <span className="truncate">{t.name}</span>
        <p className="truncate text-[0.75rem] text-ink-3">
          mag {t.magnitude} · best in {t.bestMonth}
        </p>
      </div>
      <span className="hidden text-[0.75rem] text-ink-3 sm:inline">{t.type}</span>
    </CommandItem>
  );
}
