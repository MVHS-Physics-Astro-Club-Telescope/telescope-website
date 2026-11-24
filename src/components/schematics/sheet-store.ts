"use client";

import { useSyncExternalStore } from "react";

/**
 * Fetches each themed sheet SVG once and keeps its markup for the visit, so
 * reopening the viewer or flipping back to a sheet is instant. The markup is
 * our own committed asset from /public; it is inlined (not an <img>) so it
 * can never be picked as the page's Largest Contentful Paint.
 */
export type SheetLoad =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; markup: string }
  | { status: "error"; message: string };

const IDLE: SheetLoad = { status: "idle" };
const LOADING: SheetLoad = { status: "loading" };

const states = new Map<string, SheetLoad>();
const inflight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

function set(src: string, state: SheetLoad) {
  states.set(src, state);
  for (const listener of listeners) listener();
}

/** Resolves once the sheet is ready or has failed; failures land in the state. */
export function loadSheet(src: string): Promise<void> {
  if (states.get(src)?.status === "ready") return Promise.resolve();
  const pending = inflight.get(src);
  if (pending) return pending;
  set(src, LOADING);
  const request = fetch(src)
    .then(async (res) => {
      if (!res.ok) throw new Error(`${src} answered ${res.status}`);
      const markup = await res.text();
      if (!markup.trimStart().startsWith("<svg")) throw new Error(`${src} is not an SVG`);
      set(src, { status: "ready", markup });
    })
    .catch((err: unknown) => {
      set(src, { status: "error", message: err instanceof Error ? err.message : String(err) });
    })
    .finally(() => {
      inflight.delete(src);
    });
  inflight.set(src, request);
  return request;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSheet(src: string): SheetLoad {
  return useSyncExternalStore(
    subscribe,
    () => states.get(src) ?? IDLE,
    () => IDLE,
  );
}
