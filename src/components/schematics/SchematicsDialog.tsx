"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { SCHEMATIC_SHEETS, SCHEMATICS_COMMIT, SCHEMATICS_REPO, type SchematicSheet } from "@/data/schematics";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import SheetViewer, { ZOOM_STEP, type ViewerHandle } from "./SheetViewer";
import { loadSheet, useSheet } from "./sheet-store";

const SHEETS = SCHEMATIC_SHEETS;
const LAST = SHEETS.length - 1;
const KEY_PAN = 120;

/** Start fetching a sheet before the viewer opens (the intro waits on sheet 0). */
export function preloadSheet(index: number): Promise<void> {
  return loadSheet(SHEETS[index].src);
}

function SheetPanel({
  sheet,
  active,
  reducedMotion,
  tabId,
  panelId,
  viewerRef,
}: {
  sheet: SchematicSheet;
  active: boolean;
  reducedMotion: boolean;
  tabId: string;
  panelId: string;
  viewerRef: React.Ref<ViewerHandle>;
}) {
  const load = useSheet(sheet.src);
  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      data-active={active}
      inert={!active}
      className="schem-panel absolute inset-0"
    >
      {load.status === "ready" ? (
        <SheetViewer
          ref={active ? viewerRef : undefined}
          sheet={sheet}
          markup={load.markup}
          active={active}
          reducedMotion={reducedMotion}
        />
      ) : load.status === "error" ? (
        <div className="grid h-full place-items-center px-6 text-center">
          <div>
            <p className="text-[0.9375rem] text-ink-2">The {sheet.title.toLowerCase()} sheet didn&rsquo;t load.</p>
            <button
              type="button"
              onClick={() => loadSheet(sheet.src)}
              className="mt-4 inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-[0.9375rem] text-ink transition-[border-color,transform] duration-150 hover:border-ink active:scale-[0.97]"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <p className="grid h-full place-items-center text-[0.875rem] text-ink/55">Loading the sheet</p>
      )}
    </div>
  );
}

export default function SchematicsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  // Base UI only plays the enter transition when the root mounts closed and
  // then opens, so arm it one frame after mount.
  const [armed, setArmed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const popupRef = useRef<HTMLDivElement>(null);
  const viewer = useRef<ViewerHandle>(null);
  // State, not a ref: the popup mounts a commit after `open` flips, and the
  // indicator has to be placed once the tab row actually exists.
  const [tabsEl, setTabsEl] = useState<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const baseId = useId();
  const tabId = (i: number) => `${baseId}-tab-${SHEETS[i].slug}`;
  const panelId = (i: number) => `${baseId}-panel-${SHEETS[i].slug}`;
  const sheet = SHEETS[index];

  useEffect(() => {
    const id = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // The open sheet first, then its neighbours so the next flip is instant.
  useEffect(() => {
    let cancelled = false;
    loadSheet(SHEETS[index].src).then(() => {
      if (cancelled) return;
      for (const i of [index + 1, index - 1]) if (i >= 0 && i <= LAST) loadSheet(SHEETS[i].src);
    });
    return () => {
      cancelled = true;
    };
  }, [index]);

  // The lit segment of the hairline over the active tab; on a narrow screen,
  // keep that tab scrolled into view and fade whichever edge has more tabs.
  useLayoutEffect(() => {
    const scroller = tabsEl;
    if (!scroller) return;
    const fade = () => {
      const more = scroller.scrollWidth - scroller.clientWidth;
      const start = scroller.scrollLeft > 2;
      const end = scroller.scrollLeft < more - 2;
      scroller.dataset.fade = start && end ? "both" : start ? "start" : end ? "end" : "none";
    };
    const place = (behavior: ScrollBehavior) => {
      const tab = tabRefs.current[index];
      const bar = indicatorRef.current;
      if (!tab || !bar) return;
      bar.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth})`;
      const left = tab.offsetLeft - 24;
      const right = tab.offsetLeft + tab.offsetWidth + 24 - scroller.clientWidth;
      if (scroller.scrollLeft > left) scroller.scrollTo({ left, behavior });
      else if (scroller.scrollLeft < right) scroller.scrollTo({ left: right, behavior });
      fade();
    };
    place(reducedMotion ? "auto" : "smooth");
    const ro = new ResizeObserver(() => place("auto"));
    ro.observe(scroller);
    scroller.addEventListener("scroll", fade, { passive: true });
    return () => {
      ro.disconnect();
      scroller.removeEventListener("scroll", fade);
    };
  }, [tabsEl, index, reducedMotion]);

  const go = (i: number) => setIndex(Math.min(Math.max(i, 0), LAST));

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const n = SHEETS.length;
    const next =
      e.key === "ArrowRight" ? (i + 1) % n
      : e.key === "ArrowLeft" ? (i - 1 + n) % n
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : null;
    if (next === null) return;
    e.preventDefault();
    e.stopPropagation();
    setIndex(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const v = viewer.current;
    switch (e.key) {
      case "+":
      case "=":
        v?.zoomBy(ZOOM_STEP);
        break;
      case "-":
      case "_":
        v?.zoomBy(1 / ZOOM_STEP);
        break;
      case "0":
        v?.reset();
        break;
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown": {
        if (v?.isZoomed()) {
          const dx = e.key === "ArrowLeft" ? KEY_PAN : e.key === "ArrowRight" ? -KEY_PAN : 0;
          const dy = e.key === "ArrowUp" ? KEY_PAN : e.key === "ArrowDown" ? -KEY_PAN : 0;
          v.panBy(dx, dy);
        } else if (e.key === "ArrowLeft") go(index - 1);
        else if (e.key === "ArrowRight") go(index + 1);
        else return;
        break;
      }
      default:
        return;
    }
    e.preventDefault();
  }

  return (
    <Dialog.Root
      open={open && armed}
      onOpenChange={(next) => onOpenChange(next)}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setIndex(0);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="schem-backdrop fixed inset-0 z-[60] bg-black/80" />
        <Dialog.Viewport className="fixed inset-0 z-[61] flex items-center justify-center sm:p-8">
          <Dialog.Popup
            ref={popupRef}
            initialFocus={popupRef}
            onKeyDown={onKeyDown}
            data-commit={SCHEMATICS_COMMIT}
            className="schem-popup relative flex h-dvh w-full flex-col overflow-hidden bg-black text-ink outline-none sm:h-[min(880px,calc(100dvh-4rem))] sm:max-w-[1280px] sm:rounded-[10px] sm:border sm:border-line"
          >
            <header className="flex items-start justify-between gap-5 px-5 pt-5 sm:px-8 sm:pt-7">
              <div>
                <Dialog.Title className="font-display text-[2rem] text-balance text-ink sm:text-[2.75rem]">
                  Our schematics are done.
                </Dialog.Title>
                <Dialog.Description className="mt-2 max-w-[36rem] text-[0.9375rem] leading-relaxed text-pretty text-ink-2 sm:mt-3 sm:text-base">
                  They cover every wire from the Raspberry Pi to the motors and the battery.
                </Dialog.Description>
                <p className="sr-only">
                  Plus and minus zoom the sheet, zero fits it, and the arrow keys move a zoomed sheet or
                  change sheets.
                </p>
              </div>
              <Dialog.Close
                aria-label="Close"
                className="-mt-0.5 -mr-1 grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink-2 transition-[color,border-color,transform] duration-150 ease-out hover:border-ink hover:text-ink focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-ink active:scale-[0.94] sm:mt-1 sm:mr-0"
              >
                <X className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
              </Dialog.Close>
            </header>

            <div className="schem-stage relative mt-4 min-h-0 flex-1 border-y border-line sm:mt-6">
              <div aria-hidden="true" className="schem-glow pointer-events-none absolute inset-0" />
              <div className="schem-sheets absolute inset-0">
                {SHEETS.map((s, i) => (
                  <SheetPanel
                    key={s.slug}
                    sheet={s}
                    active={i === index}
                    reducedMotion={reducedMotion}
                    tabId={tabId(i)}
                    panelId={panelId(i)}
                    viewerRef={viewer}
                  />
                ))}
              </div>
            </div>

            <footer className="px-5 pb-5 sm:px-8 sm:pb-7">
              <div className="flex items-start gap-3">
                <div
                  ref={setTabsEl}
                  className="schem-tabs relative -mt-px -ml-5 min-w-0 flex-1 overflow-x-auto pl-5 [scrollbar-width:none] sm:-ml-0 sm:pl-0 [&::-webkit-scrollbar]:hidden"
                >
                  <div role="tablist" aria-label="Schematic sheets" className="relative inline-flex gap-5 sm:gap-7">
                    <span
                      ref={indicatorRef}
                      aria-hidden="true"
                      className="absolute top-0 left-0 h-px w-px origin-left bg-glow transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    />
                    {SHEETS.map((s, i) => (
                      <button
                        key={s.slug}
                        ref={(el) => {
                          tabRefs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={tabId(i)}
                        aria-selected={i === index}
                        aria-controls={panelId(i)}
                        tabIndex={i === index ? 0 : -1}
                        onClick={() => setIndex(i)}
                        onKeyDown={(e) => onTabKeyDown(e, i)}
                        className="shrink-0 pt-3.5 pb-1.5 text-[0.9375rem] whitespace-nowrap text-ink/55 transition-colors duration-200 hover:text-ink/80 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ink aria-selected:text-ink"
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 pt-2">
                  <button
                    type="button"
                    aria-label="Previous sheet"
                    disabled={index === 0}
                    onClick={() => go(index - 1)}
                    className="grid size-9 place-items-center rounded-full border border-line-strong text-ink-2 transition-[color,border-color,transform] duration-150 ease-out hover:border-ink hover:text-ink focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.94] disabled:border-line disabled:text-ink-3/60 disabled:active:scale-100"
                  >
                    <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next sheet"
                    disabled={index === LAST}
                    onClick={() => go(index + 1)}
                    className="grid size-9 place-items-center rounded-full border border-line-strong text-ink-2 transition-[color,border-color,transform] duration-150 ease-out hover:border-ink hover:text-ink focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.94] disabled:border-line disabled:text-ink-3/60 disabled:active:scale-100"
                  >
                    <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-4 sm:mt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <p key={sheet.slug} className="schem-caption max-w-[40rem] text-[0.9375rem] leading-relaxed text-pretty text-ink-2">
                  {sheet.caption}
                </p>
                <a
                  href={SCHEMATICS_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full border border-line-strong pr-3.5 pl-4 text-[0.9375rem] text-ink transition-[border-color,transform] duration-150 ease-out hover:border-ink focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-ink active:scale-[0.97] sm:self-auto"
                >
                  See it on GitHub
                  <ArrowUpRight className="size-4 text-ink-2" strokeWidth={1.5} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
