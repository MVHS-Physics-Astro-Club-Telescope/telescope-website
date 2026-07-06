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
  const [emailError, setEmailError] = useState<string>("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const previewId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Focus restoration happens in onExitComplete on the dialog's
  // AnimatePresence — after the exit animation fully unmounts the dialog —
  // so nothing inside the dialog can steal focus back mid-teardown.
  function closeAndRestoreFocus() {
    setOpen(false);
  }

  // ⌘K / Ctrl-K to open the palette from anywhere on the page; Escape closes.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function validateEmail(v: string) {
    if (!v) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return "That doesn't look like a valid email.";
    }
    return "";
  }

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
    closeAndRestoreFocus();
  }

  function onChipKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
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
    const target = CHIPS[next];
    setChip(target.key);
    chipRefs.current[next]?.focus();
  }

  return (
    <div className="card-atlas tick-corners relative overflow-hidden p-6 sm:p-8 space-y-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Filter chips */}
      <div>
        <Label
          htmlFor="target-chips"
          className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chart/85 mb-3"
        >
          Filter
        </Label>
        <div
          id="target-chips"
          role="radiogroup"
          className="flex flex-wrap gap-2"
        >
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
                  "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border font-mono text-xs uppercase tracking-[0.08em] transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/50",
                  active
                    ? "border-brass/50 bg-brass/10 text-brass-bright"
                    : "border-chart/15 bg-deep text-chart-bright/70 hover:border-chart/35 hover:text-starlight/95 hover:-translate-y-px",
                )}
              >
                <span
                  className={cn(
                    "transition-colors",
                    active ? "text-brass-bright" : "text-chart/70 group-hover:text-chart-bright/85",
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
          className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chart/85 mb-2"
        >
          Target
        </Label>

        <button
          id="target-search"
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="target-command-dialog"
          aria-keyshortcuts="Meta+K Control+K"
          className="group relative flex w-full items-center gap-3 px-4 py-3 rounded-sm bg-deep border border-chart/15 text-left text-sm text-chart-bright/60 hover:border-chart/35 hover:bg-raised/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/50 focus-visible:border-brass/50 transition-colors"
        >
          <Search className="h-4 w-4 text-chart/70 shrink-0" />
          <span className="flex-1 truncate">
            {selected
              ? selected.name
              : "Search targets — Andromeda, M42, Saturn…"}
          </span>
          <kbd className="hidden sm:inline-flex h-6 items-center gap-0.5 rounded-sm border border-chart/20 bg-void px-1.5 font-mono text-[10px] font-medium text-chart-bright/65">
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
            className="relative overflow-hidden rounded-sm border border-chart/12 bg-deep p-5"
          >
            <div
              aria-hidden="true"
              className="chart-rule pointer-events-none absolute inset-x-0 top-0"
            />
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brass/10 border border-brass/30 text-brass-bright">
                  {iconFor(selected.type)}
                </span>
                <h3 className="font-display text-lg text-starlight truncate">
                  {selected.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 rounded-sm border px-2 py-0 font-mono text-[10px] uppercase tracking-[0.12em]",
                    tierOf(selected) === "easy"
                      ? "border-oiii/35 bg-oiii/10 text-oiii"
                      : "border-brass/40 bg-brass/10 text-brass-bright",
                  )}
                >
                  {tierOf(selected) === "easy" ? "Easy" : "Challenging"}
                </Badge>
                <Badge
                  variant="outline"
                  className="h-5 rounded-sm border-chart/20 bg-chart/8 px-2 py-0 font-mono text-[10px] uppercase tracking-[0.12em] text-chart-bright/75"
                >
                  {selected.type}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-chart-bright/70 leading-relaxed mb-4">
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
          className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chart/85 mb-2"
        >
          Where should we send the image?
        </Label>
        <Input
          id="target-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Clear stale errors as the user fixes the value.
            if (emailError) setEmailError(validateEmail(e.target.value));
          }}
          onBlur={(e) => setEmailError(validateEmail(e.target.value))}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "target-email-error" : undefined}
          className="h-12 px-4 rounded-sm bg-deep border border-chart/15 text-[15px] text-starlight/95 placeholder:text-chart-bright/35 focus-visible:border-brass/50 focus-visible:ring-2 focus-visible:ring-brass/25"
        />
        {emailError && (
          <p
            id="target-email-error"
            role="alert"
            className="mt-1.5 text-xs text-halpha"
          >
            {emailError}
          </p>
        )}
      </div>

      {/* Submit (disabled with explanation) */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
        <TooltipProvider delay={150}>
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  // Use aria-disabled (not the native `disabled` attribute)
                  // so the button remains in the focus order and can show
                  // its tooltip on keyboard focus (WCAG 1.4.13). We
                  // suppress activation in onClick instead.
                  aria-disabled="true"
                  aria-label="Submit request — submissions open at first light, August 2026"
                  title="Submissions open when telescope goes online"
                  onClick={(e) => e.preventDefault()}
                  onFocus={() => setTooltipOpen(true)}
                  onBlur={() => setTooltipOpen(false)}
                  onMouseEnter={() => setTooltipOpen(true)}
                  onMouseLeave={() => setTooltipOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-7 h-11 shrink-0 rounded-sm border border-chart/15 bg-raised/70 text-sm font-medium text-starlight/45 cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/80"
                >
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Submit request
                </button>
              }
            />
            <TooltipContent
              side="top"
              className="rounded-sm border-chart/20 bg-panel font-mono text-xs text-starlight/90"
            >
              Locks open at first light · August 2026
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-chart-bright/60 leading-relaxed">
          Submissions open when the telescope goes online. Drop your email
          below and we&apos;ll let you know.
        </p>
      </div>

      {/* Command palette dialog (cmdk inline overlay) */}
      <AnimatePresence
        onExitComplete={() => triggerRef.current?.focus({ preventScroll: true })}
      >
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
              onClick={closeAndRestoreFocus}
              className="absolute inset-0 bg-void/80 cursor-default"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="tick-corners relative w-full max-w-xl rounded-md border border-chart/20 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              <CommandRoot
                loop
                className="bg-transparent rounded-md"
                // Use our own filter that also matches aliases
                filter={(value, search) => {
                  if (!search) return 1;
                  const q = search.trim().toLowerCase();
                  if (value.toLowerCase().includes(q)) return 1;
                  return 0;
                }}
              >
                <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-chart/12">
                  <Search className="h-4 w-4 text-chart/70 shrink-0" />
                  <CommandInput
                    autoFocus
                    placeholder="Type to search — Andromeda, M42, Saturn…"
                    className="flex-1 bg-transparent border-0 outline-none text-[15px] text-starlight/95 placeholder:text-chart-bright/35 focus-visible:ring-0 [&_[data-slot=input-group]]:!border-0 [&_[data-slot=input-group]]:!bg-transparent [&_[data-slot=input-group]]:!shadow-none [&_[data-slot=input-group]]:!h-auto [&_[data-slot=input-group-addon]]:hidden"
                  />
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-0.5 rounded-sm border border-chart/20 bg-void px-1.5 font-mono text-[10px] font-medium text-chart-bright/60">
                    Esc
                  </kbd>
                </div>

                <CommandList className="max-h-[60vh] py-2">
                  <CommandEmpty className="px-6 py-10 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-chart/8 border border-chart/15 text-chart-bright/60">
                      <Telescope className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-starlight/85 font-medium">
                      Nothing in the catalog matches that.
                    </p>
                    <p className="mt-1 text-xs text-chart-bright/60">
                      Try a Messier number (e.g. M42), a planet, or a common name.
                    </p>
                  </CommandEmpty>

                  {easy.length > 0 && (
                    <CommandGroup
                      heading="Easy targets · naked-eye class"
                      className="px-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-chart/85"
                    >
                      {easy.map((t) => (
                        <PaletteItem key={t.id} t={t} onPick={pick} />
                      ))}
                    </CommandGroup>
                  )}

                  {challenging.length > 0 && (
                    <CommandGroup
                      heading="Challenging targets · stacked exposures"
                      className="px-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-chart/85"
                    >
                      {challenging.map((t) => (
                        <PaletteItem key={t.id} t={t} onPick={pick} />
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>

                <div className="flex items-center justify-between gap-3 border-t border-chart/12 px-4 py-2 text-[11px] text-chart-bright/55">
                  <div className="flex items-center gap-2 font-mono">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    <span>navigate</span>
                    <span className="text-chart/40">·</span>
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
        "group flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-sm",
        "data-selected:bg-raised/70 data-[selected=true]:bg-raised/70 aria-selected:bg-raised/70",
        "text-starlight/85 data-selected:text-starlight aria-selected:text-starlight",
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-deep border border-chart/12 text-chart-bright/70 group-data-selected:text-brass-bright group-aria-selected:text-brass-bright">
        {iconFor(t.type)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{t.name}</span>
        </div>
        <p className="text-[11px] text-chart-bright/55 truncate">
          mag {t.magnitude} · best in {t.bestMonth}
        </p>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-chart/70 hidden sm:inline">
        {t.type}
      </span>
      <ChevronRight className="h-4 w-4 text-brass/60 opacity-0 -translate-x-1 transition-all group-aria-selected:opacity-100 group-aria-selected:translate-x-0 group-data-selected:opacity-100 group-data-selected:translate-x-0" />
    </CommandItem>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-sm border border-chart/20 bg-void px-1 text-[10px] text-chart-bright/70">
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
      <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-chart/70 mb-1">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm font-mono",
          muted ? "text-chart-bright/55 italic" : "text-starlight/90",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
