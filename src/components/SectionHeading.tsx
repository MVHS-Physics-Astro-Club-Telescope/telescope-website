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
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      <div className="mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500" />
      {subtitle && (
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
