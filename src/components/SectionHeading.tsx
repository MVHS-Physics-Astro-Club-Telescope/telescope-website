"use client";

import { useInView } from "@/hooks/useInView";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`text-center mb-16 transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6" />
      <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[rgba(240,240,250,1)]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[rgba(240,240,250,0.6)] text-lg mt-4 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
