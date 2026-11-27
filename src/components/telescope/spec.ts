/**
 * Story layout, in viewport heights: hero, mechanical, electrical, optics,
 * outro. The beats are taller than a screen so the camera has room to
 * travel between them. Both the DOM layout and the camera keys read this.
 * The instrument itself is the CAD model (model.ts).
 */
export const SCREENS = [1, 1.5, 1.7, 1.5, 1] as const;
export const STORY_HEIGHT = SCREENS.reduce((a, b) => a + b, 0);

/** Scroll progress (0..1) at which block i is centred in the viewport. */
export function beatProgress(i: number): number {
  let start = 0;
  for (let k = 0; k < i; k++) start += SCREENS[k];
  const centre = start + SCREENS[i] / 2 - 0.5;
  const span = STORY_HEIGHT - 1;
  return Math.min(Math.max(centre / span, 0), 1);
}
