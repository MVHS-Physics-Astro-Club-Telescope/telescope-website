import type { Metadata } from "next";
import Link from "next/link";
import PartsTable from "@/components/PartsTable";
import SponsorButton from "@/components/SponsorButton";

export const metadata: Metadata = {
  title: "Parts List — MVHS Astronomy Telescope Project",
  description:
    "Complete bill of materials for our student-built autonomous telescope. See what we need and how you can help.",
};

export default function PartsPage() {
  return (
    <section className="relative min-h-screen bg-[#030712] pt-28 sm:pt-32 pb-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link
            href="/"
            className="hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-slate-300">Parts List</span>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Bill of Materials
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Every component needed to build our autonomous Dobsonian telescope.
            Interested in donating a part?{" "}
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com?subject=Part%20Donation%20Inquiry"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 hover:decoration-blue-300/50 transition-colors duration-200"
            >
              Contact us
            </a>
            .
          </p>
        </div>

        <PartsTable />

        {/* Bottom CTA */}
        <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-[#0a0f1a] border border-white/[0.08] text-center">
          <h3 className="text-xl font-semibold text-white mb-3">
            Want to help us get these parts?
          </h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Whether it&apos;s a financial contribution, an in-kind donation, or lending us
            workshop space, every bit helps bring this telescope to life.
          </p>
          <SponsorButton
            className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-medium bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer"
          >
            Become a Sponsor
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </SponsorButton>
        </div>
      </div>
    </section>
  );
}
