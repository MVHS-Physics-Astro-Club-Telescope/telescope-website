"use client";

import Link from "next/link";
import StarField from "./StarField";

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030712]">
      {/* Starfield */}
      <StarField count={180} />

      {/* Gradient orb decorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 text-sm text-slate-300 fade-in-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Student-Built Autonomous Telescope
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 fade-in-up animation-delay-200">
          Building the Future
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">
            of Astronomy
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up animation-delay-400">
          A student-built autonomous telescope bringing the night sky
          to the Bay Area
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up animation-delay-600">
          <a
            href="#about"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-medium bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Learn More
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
          <Link
            href="/parts"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-slate-300 font-medium border border-white/10 rounded-xl hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            View Parts List
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce">
        <ChevronDown />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
    </section>
  );
}
