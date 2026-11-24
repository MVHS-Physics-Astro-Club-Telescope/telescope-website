import exported from "./schematics-export.json";

/**
 * The four HAT schematic sheets shown in the home-page viewer. The drawings
 * and their sizes come from `npm run export:schematics` (see
 * scripts/export-schematics.mjs); the words are written here.
 */
export type SchematicSheet = {
  slug: string;
  title: string;
  caption: string;
  /** Themed SVG under /public. */
  src: string;
  /** Drawing size in mm, after cropping to the line-work. */
  width: number;
  height: number;
};

const COPY: Record<string, { title: string; caption: string }> = {
  overview: {
    title: "Overview",
    caption: "How the three sheets connect.",
  },
  "pi-header": {
    title: "Pi header",
    caption: "The Raspberry Pi’s 40 pins and what each one does.",
  },
  "hat-signals": {
    title: "HAT signals",
    caption:
      "The board that plugs onto the Pi: a 74ACT244 buffer that drives the motor drivers, plus the limit switch and encoder sockets.",
  },
  power: {
    title: "Power and drivers",
    caption:
      "The wiring off the board: battery, fuses, kill switch, the Pegasus power box, the 24 V supply and both motor drivers.",
  },
};

export const SCHEMATICS_REPO = exported.repo;
export const SCHEMATICS_COMMIT = exported.commit;

export const SCHEMATIC_SHEETS: SchematicSheet[] = exported.sheets.map((sheet) => {
  const copy = COPY[sheet.slug];
  if (!copy) throw new Error(`No title or caption for exported sheet "${sheet.slug}"`);
  return { ...sheet, ...copy };
});
