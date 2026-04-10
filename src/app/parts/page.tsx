import type { Metadata } from "next";
import Link from "next/link";
import PartsTable from "@/components/PartsTable";
import SponsorButton from "@/components/SponsorButton";

export const metadata: Metadata = {
  title: "Parts List \u2014 MVHS Astronomy Telescope Project",
  description:
    "Complete bill of materials for our student-built autonomous telescope. See what we need and how you can help.",
};

export default function PartsPage() {
  return (
    <section className="relative min-h-screen bg-[#080B12] pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[rgba(240,240,250,0.4)] mb-8">
          <Link
            href="/"
            className="hover:text-[rgba(240,240,250,0.8)] transition-colors duration-200"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-[rgba(240,240,250,0.7)]">Parts List</span>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-heading text-3xl font-bold text-[rgba(240,240,250,1)] mb-4">
            Bill of Materials
          </h1>
          <p className="text-[rgba(240,240,250,0.6)] max-w-2xl">
            Every component needed to build our autonomous Dobsonian telescope.
            Interested in donating a part?{" "}
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com?subject=Part%20Donation%20Inquiry"
              className="text-[rgba(240,240,250,0.95)] underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-colors duration-200"
            >
              Contact us
            </a>
            .
          </p>
        </div>

        <PartsTable />

        {/* Bottom CTA — titanium card */}
        <div className="mt-16 p-8 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300 text-center">
          <h3 className="font-heading text-xl font-semibold text-[rgba(240,240,250,0.95)] mb-3">
            Want to help us get these parts?
          </h3>
          <p className="text-[rgba(240,240,250,0.6)] mb-6 max-w-lg mx-auto">
            Whether it&apos;s a financial contribution, an in-kind donation, or lending us
            workshop space, every bit helps bring this telescope to life.
          </p>
          <SponsorButton>
            Become a Sponsor
          </SponsorButton>
        </div>
      </div>
    </section>
  );
}
