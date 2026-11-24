"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  OPEN_SCHEMATICS_EVENT,
  hasSeenSchematics,
  rememberSchematicsSeen,
  urlWithoutSchematics,
  wantsSchematics,
} from "./announcement";

/*
 * Home-page announcement for the finished HAT schematics.
 *
 * This file is all the home page ships up front: a few timers and listeners.
 * The viewer (its code and the sheet SVGs) loads only when it is about to
 * open: once per visitor, after the page has loaded, gone idle and been on
 * screen for a beat (and never mid-scroll); or any time from `/#schematics`,
 * `/?schematics` or the footer link.
 */

const loadDialog = () => import("./SchematicsDialog");
const SchematicsDialog = dynamic(loadDialog, { ssr: false });

/** How long the home page shows on its own before the announcement. */
const FIRST_VISIT_DELAY_MS = 1600;
/** Don't open while someone is scrolling the story; wait for this much calm. */
const SCROLL_QUIET_MS = 700;

/** Survives client-side navigation, for visitors whose storage is blocked. */
let shownThisVisit = false;

export default function SchematicsIntro() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let opening = false;
    let lastScroll = -Infinity;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)));

    const show = async () => {
      if (opening || openRef.current) return;
      opening = true;
      try {
        const viewer = await loadDialog();
        // A sheet that fails to load shows its own retry inside the viewer.
        await viewer.preloadSheet(0);
      } catch (err) {
        // The chunk itself failed (offline, deploy swap): skip the popup this time.
        console.warn("The schematics viewer could not load.", err);
        return;
      } finally {
        opening = false;
      }
      if (cancelled) return;
      // Seen as soon as it opens, so a reload, a navigation or a second tab
      // before it is closed doesn't announce it again.
      shownThisVisit = true;
      rememberSchematicsSeen();
      openRef.current = true;
      setMounted(true);
      setOpen(true);
    };

    const onScroll = () => {
      lastScroll = performance.now();
    };
    const onHashChange = () => {
      if (wantsSchematics(window.location)) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener(OPEN_SCHEMATICS_EVENT, show);

    if (wantsSchematics(window.location)) {
      show();
    } else if (!shownThisVisit && !hasSeenSchematics()) {
      const loaded = () =>
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
      const idle = () =>
        new Promise<void>((resolve) =>
          "requestIdleCallback" in window
            ? window.requestIdleCallback(() => resolve(), { timeout: 2000 })
            : resolve(),
        );
      (async () => {
        await loaded();
        await idle();
        await wait(FIRST_VISIT_DELAY_MS);
        while (!cancelled && performance.now() - lastScroll < SCROLL_QUIET_MS) await wait(SCROLL_QUIET_MS);
        if (cancelled || shownThisVisit || hasSeenSchematics()) return;
        show();
      })();
    }

    return () => {
      cancelled = true;
      for (const t of timers) window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener(OPEN_SCHEMATICS_EVENT, show);
    };
  }, []);

  if (!mounted) return null;
  return (
    <SchematicsDialog
      open={open}
      onOpenChange={(next) => {
        if (next) return;
        openRef.current = false;
        setOpen(false);
        if (wantsSchematics(window.location)) {
          window.history.replaceState(window.history.state, "", urlWithoutSchematics(window.location));
        }
      }}
    />
  );
}
