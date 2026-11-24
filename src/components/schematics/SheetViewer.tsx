"use client";

import { memo, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { Minus, Plus, Scan } from "lucide-react";
import type { SchematicSheet } from "@/data/schematics";
import { createPanZoom, type PanZoom, type PanZoomState } from "./panzoom";

export const ZOOM_STEP = 1.6;

export type ViewerHandle = {
  zoomBy(factor: number): void;
  panBy(dx: number, dy: number): void;
  reset(): void;
  isZoomed(): boolean;
};

/** The inlined drawing. Memoised so zoom-readout renders never touch it. */
const Drawing = memo(function Drawing({ markup, label }: { markup: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
});

function ZoomButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full text-ink-2 transition-[color,transform] duration-150 ease-out hover:text-ink focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.94] disabled:text-ink-3/60 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}

export default function SheetViewer({
  sheet,
  markup,
  active,
  reducedMotion,
  ref,
}: {
  sheet: SchematicSheet;
  markup: string;
  active: boolean;
  reducedMotion: boolean;
  ref?: Ref<ViewerHandle>;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const engine = useRef<PanZoom | null>(null);
  const reduced = useRef(reducedMotion);
  const [zoom, setZoom] = useState<PanZoomState>({ scale: 1, atFit: true, atMax: false });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    reduced.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    const pz = createPanZoom({
      viewport,
      content,
      drawing: { width: sheet.width, height: sheet.height },
      reducedMotion: () => reduced.current,
      onChange: setZoom,
      onInteract: () => setTouched(true),
    });
    engine.current = pz;
    return () => {
      pz.destroy();
      engine.current = null;
    };
  }, [sheet.width, sheet.height]);

  // A sheet you leave goes back to fit once it has faded out.
  useEffect(() => {
    if (active) return;
    const id = window.setTimeout(() => engine.current?.reset(false), 320);
    return () => window.clearTimeout(id);
  }, [active]);

  useImperativeHandle(
    ref,
    () => ({
      zoomBy: (factor) => engine.current?.zoomBy(factor),
      panBy: (dx, dy) => engine.current?.panBy(dx, dy),
      reset: () => engine.current?.reset(true),
      isZoomed: () => engine.current?.isZoomed() ?? false,
    }),
    [],
  );

  return (
    <>
      <div
        ref={viewportRef}
        data-zoomed={!zoom.atFit}
        className="schem-viewport absolute inset-0 cursor-zoom-in touch-none overflow-hidden select-none data-[zoomed=true]:cursor-grab data-[zoomed=true]:active:cursor-grabbing"
      >
        <div ref={contentRef} className="absolute top-0 left-0 origin-top-left">
          <Drawing markup={markup} label={`${sheet.title} schematic. ${sheet.caption}`} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 sm:inset-x-5 sm:bottom-4">
        <p
          aria-hidden="true"
          className={`pb-2 text-[0.8125rem] text-ink/55 transition-opacity duration-500 ${touched ? "opacity-0" : "opacity-100"}`}
        >
          <span className="pointer-coarse:hidden">Scroll to zoom, drag to move.</span>
          <span className="hidden pointer-coarse:inline">Pinch to zoom, drag to move.</span>
        </p>
        <div className="pointer-events-auto flex shrink-0 items-center rounded-full border border-line-strong bg-black px-0.5">
          <ZoomButton
            label="Zoom out"
            disabled={zoom.atFit}
            onClick={() => engine.current?.zoomBy(1 / ZOOM_STEP)}
          >
            <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </ZoomButton>
          <span className="w-12 text-center font-mono text-[0.75rem] tabular-nums text-ink-2">
            {Math.round(zoom.scale * 100)}%
          </span>
          <ZoomButton label="Zoom in" disabled={zoom.atMax} onClick={() => engine.current?.zoomBy(ZOOM_STEP)}>
            <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </ZoomButton>
          <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-line-strong" />
          <ZoomButton label="Fit the sheet" disabled={zoom.atFit} onClick={() => engine.current?.reset(true)}>
            <Scan className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </ZoomButton>
        </div>
      </div>
    </>
  );
}
