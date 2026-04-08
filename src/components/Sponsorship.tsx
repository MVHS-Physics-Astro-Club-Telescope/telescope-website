"use client";

import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

const benefits = [
  "Logo on the telescope and at every public star party",
  "Named acknowledgment on our website and social media",
  "Private star party session for your team or family",
  "Quarterly progress updates with photos and data",
  "Tax-deductible donation through our school district",
];

export default function Sponsorship() {
  const { ref, isInView } = useInView();

  return (
    <section id="support" className="relative py-24 sm:py-32 bg-[#030712]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Support Our Mission" subtitle="Help us bring the night sky to the Bay Area community." />

        <div
          ref={ref}
          className={`relative p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Every Dollar Counts
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Estimated Budget:{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">$850\u2013$1,300</span>
              </h3>

              <p className="text-slate-400 leading-relaxed mb-8">
                We&apos;re building this telescope with donated materials wherever possible and keeping costs minimal. Your sponsorship \u2014 whether $10 or $100 \u2014 directly funds the optics, electronics, and materials that make this project possible.
              </p>

              <a
                href="mailto:mvhsphysicsastroclub@gmail.com?subject=Telescope%20Sponsorship%20Inquiry"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-medium bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5"
              >
                Become a Sponsor
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Sponsor Benefits</h4>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
                    style={{ transitionDelay: `${300 + i * 100}ms` }}
                  >
                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
