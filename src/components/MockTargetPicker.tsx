"use client";

import { useEffect, useMemo, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command as CommandRoot,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Globe,
  Moon,
  Search,
  Sparkles,
  Stars,
  Telescope,
  Lock,
  ChevronRight,
  Star,
  Orbit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Target,
  TargetType,
  targets as ALL_TARGETS,
  tierOf,
} from "@/data/targets";

type ChipKey = "all" | "Moon" | "Planet" | "Galaxy" | "Nebula" | "Cluster";

const CHIPS: { key: ChipKey; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { key: "Moon", label: "Moon", icon: <Moon className="h-3.5 w-3.5" /> },
  { key: "Planet", label: "Planets", icon: <Globe className="h-3.5 w-3.5" /> },
  { key: "Galaxy", label: "Galaxies", icon: <Orbit className="h-3.5 w-3.5" /> },
  { key: "Nebula", label: "Nebulae", icon: <Sparkles className="h-3.5 w-3.5" /> },
  {
    key: "Cluster",
    label: "Clusters",
    icon: <Stars className="h-3.5 w-3.5" />,
  },
];

function iconFor(type: TargetType) {
  switch (type) {
    case "Moon":
      return <Moon className="h-4 w-4" />;
    case "Planet":
      return <Globe className="h-4 w-4" />;
    case "Galaxy":
      return <Orbit className="h-4 w-4" />;
    case "Nebula":
      return <Sparkles className="h-4 w-4" />;
    case "Star Cluster":
      return <Stars className="h-4 w-4" />;
    case "Double Star":
      return <Star className="h-4 w-4" />;
    default:
      return <Telescope className="h-4 w-4" />;
  }
}

function matchesChip(t: Target, chip: ChipKey): boolean {
  if (chip === "all") return true;
  if (chip === "Cluster") return t.type === "Star Cluster";
  return t.type === chip;
}

/**
 * Target picker rebuilt as a command-palette pattern (cmdk).
 * - Trigger button opens a popover-style command. ⌘K / Ctrl-K from anywhere
 *   on the page also opens it.
 * - Filter chips above the trigger narrow the catalog (Moon / Planets /
 *   Galaxies / Nebulae / Clusters).
 * - Inside the palette, results are grouped into "Easy targets" and
 *   "Challenging targets" by magnitude. Each item carries a Lucide icon
 *   matching its object type.
 * - Selecting a target populates an inline preview card with badges for
 *   tier and type, plus magnitude / best month.
 * - Submit is permanently disabled (telescope under construction); the
 *   button surfaces a tooltip explaining why.
 *
 * Accessibility: cmdk handles roving tabindex, listbox role, and search
 * filtering. The trigger button is a real button with aria-keyshortcuts,
 * and the dialog announces the kbd legend in plain text inside the panel.
 */
export default function MockTargetPicker() {
  const [open, setOpen] = useState(false);
  const [chip, setChip] = useState<ChipKey>("all");
  const [selected, setSelected] = useState<Target | null>(null);
  const [email, setEmail] = useState("");

  const previewId = useId();

  // ⌘K / Ctrl-K to open the palette from anywhere on the page; Escape closes.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setOpen((v) => (v ? false : v));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Filtered + grouped catalog for the palette
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

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-6 sm:p-8 space-y-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Filter chips */}
      <div>
        <Label
          htmlFor="target-chips"
          className="block text-[11px] font-heading uppercase tracking-[0.18em] text-[rgba(240,240,250,0.5)] mb-3"
        >
          Filter
        </Label>
        <div
          id="target-chips"
          role="radiogroup"
          aria-label="Filter targets by type"
          className="flex flex-wrap gap-2"
        >
          {CHIPS.map((c) => {
            const active = chip === c.key;
            return (
              <button
                key={c.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setChip(c.key)}
                className={cn(
                  "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/40",
                  active
                    ? "border-[#0A84FF]/40 bg-[#0A84FF]/15 text-[#9DC4FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "border-white/[0.08] bg-[#121A25] text-[rgba(240,240,250,0.7)] hover:border-white/[0.16] hover:text-[rgba(240,240,250,0.95)] hover:-translate-y-px",
                )}
              >
                <span
                  className={cn(
                    "transition-colors",
                    active ? "text-[#9DC4FF]" : "text-[rgba(240,240,250,0.5)] group-hover:text-[rgba(240,240,250,0.85)]",
                  )}
                >
                  {c.icon}
                </span>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target picker trigger */}
      <div>
        <Label
          htmlFor="target-search"
          className="block text-[11px] font-heading uppercase tracking-[0.18em] text-[rgba(240,240,250,0.5)] mb-2"
        >
          Target
        </Label>

        <button
          id="target-search"
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="target-command-dialog"
          aria-keyshortcuts="Meta+K Control+K"
          className="group relative flex w-full items-center gap-3 px-4 py-3 rounded-full bg-[#121A25] border border-white/[0.08] text-left text-sm text-[rgba(240,240,250,0.55)] hover:border-white/[0.16] hover:bg-[#16202C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/40 focus-visible:border-[#0A84FF]/50 transition-colors"
        >
          <Search className="h-4 w-4 text-[rgba(240,240,250,0.4)] shrink-0" />
          <span className="flex-1 truncate">
            {selected
              ? selected.name
              : "Search targets — Andromeda, M42, Saturn…"}
          </span>
          <kbd className="hidden sm:inline-flex h-6 items-center gap-0.5 rounded-md border border-white/[0.1] bg-black/30 px-1.5 font-mono text-[10px] font-medium text-[rgba(240,240,250,0.6)]">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Preview card */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            id={previewId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#121A25] p-5"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/25 text-[#9DC4FF]">
                  {iconFor(selected.type)}
                </span>
                <h3 className="font-heading text-lg font-semibold text-[rgba(240,240,250,0.97)] truncate">
                  {selected.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 rounded-full border px-2 py-0 text-[10px] font-medium uppercase tracking-[0.12em]",
                    tierOf(selected) === "easy"
                      ? "border-[#30D158]/30 bg-[#30D158]/10 text-[#7ee79b]"
                      : "border-[#FF9F0A]/35 bg-[#FF9F0A]/10 text-[#ffc266]",
                  )}
                >
                  {tierOf(selected) === "easy" ? "Easy" : "Challenging"}
                </Badge>
                <Badge
                  variant="outline"
                  className="h-5 rounded-full border-white/[0.12] bg-white/[0.04] px-2 py-0 text-[10px] font-medium uppercase tracking-[0.12em] text-[rgba(240,240,250,0.7)]"
                >
                  {selected.type}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-[rgba(240,240,250,0.72)] leading-relaxed mb-4">
              {selected.description}
            </p>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <Stat label="Magnitude" value={String(selected.magnitude)} />
              <Stat label="Best month" value={selected.bestMonth} />
              <Stat label="Next window" value="TBD · live data soon" muted />
            </dl>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <div>
        <Label
          htmlFor="target-email"
          className="block text-[11px] font-heading uppercase tracking-[0.18em] text-[rgba(240,240,250,0.5)] mb-2"
        >
          Where should we send the image?
        </Label>
        <Input
          id="target-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 px-4 rounded-full bg-[#121A25] border border-white/[0.08] text-[15px] text-[rgba(240,240,250,0.95)] placeholder:text-[rgba(240,240,250,0.35)] focus-visible:border-[#0A84FF]/50 focus-visible:ring-2 focus-visible:ring-[#0A84FF]/20"
        />
      </div>

      {/* Submit (disabled with explanation) */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
        <TooltipProvider delay={150}>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Submissions open when telescope goes online"
                  className="btn-titanium-light inline-flex items-center justify-center gap-2 px-7 h-11 text-sm font-medium rounded-full opacity-70 cursor-not-allowed shrink-0"
                >
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Submit request
                </button>
              }
            />
            <TooltipContent
              side="top"
              className="border-white/[0.1] bg-[#121A25] text-[rgba(240,240,250,0.9)]"
            >
              Locks open at first light · August 2026
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-[rgba(240,240,250,0.55)] leading-relaxed">
          Submissions open when the telescope goes online. Drop your email
          below and we&apos;ll let you know.
        </p>
      </div>

      {/* Command palette dialog (cmdk inline overlay) */}
      <AnimatePresence>
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
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close target search"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-default"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#0D1219] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              <CommandRoot
                loop
                className="bg-transparent rounded-2xl"
                // Use our own filter that also matches aliases
                filter={(value, search) => {
                  if (!search) return 1;
                  const q = search.trim().toLowerCase();
                  if (value.toLowerCase().includes(q)) return 1;
                  return 0;
                }}
              >
                <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/[0.06]">
                  <Search className="h-4 w-4 text-[rgba(240,240,250,0.4)] shrink-0" />
                  <CommandInput
                    autoFocus
                    placeholder="Type to search — Andromeda, M42, Saturn…"
                    className="flex-1 bg-transparent border-0 outline-none text-[15px] text-[rgba(240,240,250,0.95)] placeholder:text-[rgba(240,240,250,0.35)] focus-visible:ring-0 [&_[data-slot=input-group]]:!border-0 [&_[data-slot=input-group]]:!bg-transparent [&_[data-slot=input-group]]:!shadow-none [&_[data-slot=input-group]]:!h-auto [&_[data-slot=input-group-addon]]:hidden"
                  />
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-0.5 rounded-md border border-white/[0.1] bg-black/30 px-1.5 font-mono text-[10px] font-medium text-[rgba(240,240,250,0.55)]">
                    Esc
                  </kbd>
                </div>

                <CommandList className="max-h-[60vh] py-2">
                  <CommandEmpty className="px-6 py-10 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] text-[rgba(240,240,250,0.55)]">
                      <Telescope className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-[rgba(240,240,250,0.85)] font-medium">
                      Nothing in the catalog matches that.
                    </p>
                    <p className="mt-1 text-xs text-[rgba(240,240,250,0.55)]">
                      Try a Messier number (e.g. M42), a planet, or a common name.
                    </p>
                  </CommandEmpty>

                  {easy.length > 0 && (
                    <CommandGroup
                      heading="Easy targets · naked-eye class"
                      className="px-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-[rgba(240,240,250,0.5)]"
                    >
                      {easy.map((t) => (
                        <PaletteItem key={t.id} t={t} onPick={pick} />
                      ))}
                    </CommandGroup>
                  )}

                  {challenging.length > 0 && (
                    <CommandGroup
                      heading="Challenging targets · stacked exposures"
                      className="px-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-[rgba(240,240,250,0.5)]"
                    >
                      {challenging.map((t) => (
                        <PaletteItem key={t.id} t={t} onPick={pick} />
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>

                <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-2 text-[11px] text-[rgba(240,240,250,0.5)]">
                  <div className="flex items-center gap-2 font-mono">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    <span>navigate</span>
                    <span className="text-[rgba(240,240,250,0.25)]">·</span>
                    <Kbd>↵</Kbd>
                    <span>select</span>
                  </div>
                  <span className="font-mono">
                    {(easy.length + challenging.length).toString().padStart(2, "0")}
                    {" "}
                    targets
                  </span>
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
      // cmdk's `value` is what gets matched. Combine name + aliases so the
      // typeahead finds "andromeda" inside "m31" entry.
      value={[t.name, ...t.aliases].join(" ")}
      onSelect={() => onPick(t)}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
        "data-selected:bg-white/[0.05] data-[selected=true]:bg-white/[0.05] aria-selected:bg-white/[0.05]",
        "text-[rgba(240,240,250,0.85)] data-selected:text-white aria-selected:text-white",
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#121A25] border border-white/[0.06] text-[rgba(240,240,250,0.7)] group-data-selected:text-[#9DC4FF] group-aria-selected:text-[#9DC4FF]">
        {iconFor(t.type)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{t.name}</span>
        </div>
        <p className="text-[11px] text-[rgba(240,240,250,0.5)] truncate">
          mag {t.magnitude} · best in {t.bestMonth}
        </p>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[rgba(240,240,250,0.4)] hidden sm:inline">
        {t.type}
      </span>
      <ChevronRight className="h-4 w-4 text-[rgba(240,240,250,0.3)] opacity-0 -translate-x-1 transition-all group-aria-selected:opacity-100 group-aria-selected:translate-x-0 group-data-selected:opacity-100 group-data-selected:translate-x-0" />
    </CommandItem>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-white/[0.1] bg-black/30 px-1 text-[10px] text-[rgba(240,240,250,0.7)]">
      {children}
    </kbd>
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
        className={cn(
          "text-sm",
          muted
            ? "text-[rgba(240,240,250,0.55)] italic"
            : "text-[rgba(240,240,250,0.9)]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
