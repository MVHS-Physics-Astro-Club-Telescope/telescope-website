/**
 * The schematics announcement: when it counts as seen, and how to link to it.
 * Plain module (no React) so the e2e tests can import the same key.
 */

/** Bump the version suffix and every visitor sees the next announcement once. */
export const SCHEMATICS_SEEN_KEY = "mv-astronomy:announcement:schematics-v1";

/** `/#schematics` or `/?schematics` opens the viewer on the home page. */
export const SCHEMATICS_HASH = "#schematics";
export const SCHEMATICS_PARAM = "schematics";

/** Dispatched on window to open the viewer without a navigation. */
export const OPEN_SCHEMATICS_EVENT = "mv:open-schematics";

export function wantsSchematics(loc: Pick<Location, "hash" | "search">): boolean {
  return loc.hash === SCHEMATICS_HASH || new URLSearchParams(loc.search).has(SCHEMATICS_PARAM);
}

/** The current URL with the deep link taken off, so a reload doesn't reopen it. */
export function urlWithoutSchematics(loc: Pick<Location, "pathname" | "hash" | "search">): string {
  const params = new URLSearchParams(loc.search);
  params.delete(SCHEMATICS_PARAM);
  const search = params.toString();
  const hash = loc.hash === SCHEMATICS_HASH ? "" : loc.hash;
  return `${loc.pathname}${search ? `?${search}` : ""}${hash}`;
}

/*
 * Storage can be missing or throw (private windows, blocked site data). Then
 * the announcement simply counts as unseen; the in-memory flag in
 * SchematicsIntro still stops it repeating within the visit.
 */
export function hasSeenSchematics(): boolean {
  try {
    return window.localStorage.getItem(SCHEMATICS_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberSchematicsSeen(): void {
  try {
    window.localStorage.setItem(SCHEMATICS_SEEN_KEY, "1");
  } catch {
    // Not persisted; see the note above.
  }
}
