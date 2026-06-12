"use client";

import { MotionConfig, motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li";
}

/**
 * Scroll-reveal wrapper. Fades in and rises as the element enters the
 * viewport. Motion respects prefers-reduced-motion via MotionConfig.
 *
 * Easing: [0.16, 1, 0.3, 1] — matches the site's established motion
 * philosophy (tasteful, almost-imperceptible).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: RevealProps) {
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <MotionConfig reducedMotion="user">
      <Component
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </Component>
    </MotionConfig>
  );
}
