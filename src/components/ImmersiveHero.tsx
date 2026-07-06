"use client";

import StarField from "./StarField";

interface ImmersiveHeroProps {
  children: React.ReactNode;
  starCount?: number;
  shootingStars?: boolean;
  className?: string;
}

/**
 * Shared sub-page hero: a quiet corner of the atlas. Faint RA/Dec chart
 * grid, sparse twinkling field stars, and an engraved rule at the base.
 * Same props API as the previous version so all pages keep working.
 */
export default function ImmersiveHero({
  children,
  starCount = 70,
  shootingStars = false,
  className = "",
}: ImmersiveHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-void ${className}`}>
      {/* Chart graticule */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(143,165,201,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(143,165,201,0.07) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 20%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 20%, black, transparent 75%)",
        }}
      />

      {/* Field stars */}
      <StarField count={starCount} interactive shootingStars={shootingStars} />

      <div className="relative">{children}</div>

      {/* Engraved base rule */}
      <div className="chart-rule absolute inset-x-0 bottom-0" aria-hidden="true" />
    </section>
  );
}
