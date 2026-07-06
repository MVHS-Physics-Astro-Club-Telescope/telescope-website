"use client";

import { motion, MotionConfig } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** Chart annotation above the title — coordinates, catalog ids, dates */
  eyebrow?: string;
}

/**
 * Atlas-plate section heading: mono chart annotation, serif display title
 * with an engraved rule running to the margin, optional subtitle.
 */
export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
}: SectionHeadingProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14 sm:mb-16"
      >
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <div className="flex items-baseline gap-6">
          <h2 className="font-display text-4xl leading-tight text-starlight sm:text-5xl">
            {title}
          </h2>
          <div className="chart-rule mt-2 hidden flex-1 sm:block" aria-hidden="true" />
        </div>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-chart-bright/70 sm:text-lg">
            {subtitle}
          </p>
        )}
      </motion.div>
    </MotionConfig>
  );
}
