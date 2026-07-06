import type { Metadata } from "next";
import Link from "next/link";
import ImmersiveHero from "@/components/ImmersiveHero";
import OpticalBench from "@/components/OpticalBench";
import PartsTable from "@/components/PartsTable";
import Reveal from "@/components/Reveal";
import SponsorButton from "@/components/SponsorButton";
import { parts, getBudgetRange } from "@/data/parts";

export const metadata: Metadata = {
  title: "Parts List — MVHS Astronomy Telescope Project",
  description:
    "Complete bill of materials for our student-built autonomous telescope. See what we need and how you can help.",
};

export default function PartsPage() {
  const budget = getBudgetRange();
  const lineItems = parts.length;

  return (
    <>
      {/* Hero */}
      <ImmersiveHero starCount={50} className="pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-10 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chart/70"
          >
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-brass-bright"
            >
              Home
            </Link>
            <span aria-hidden="true" className="mx-2 text-chart/40">
              /
            </span>
            <span aria-current="page" className="text-chart-bright/85">
              Parts List
            </span>
          </nav>

          {/* Page header */}
          <p className="eyebrow mb-4">
            Procurement manifest · {lineItems} line items
          </p>
          <h1 className="font-display text-4xl leading-tight text-starlight sm:text-5xl lg:text-6xl">
            Bill of <em>materials</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-chart-bright/70 sm:text-lg">
            Every component needed to build our autonomous Dobsonian telescope.
            Interested in donating a part?{" "}
            <a
              href="mailto:mvhsphysicsastroclub@gmail.com?subject=Part%20Donation%20Inquiry"
              className="text-starlight underline decoration-chart/30 underline-offset-4 transition-colors duration-200 hover:decoration-brass/60"
            >
              Contact us
            </a>
            .
          </p>
          <p className="mt-6 font-mono text-sm tracking-[0.08em] text-brass-bright tabular-nums">
            EST. BUDGET ${budget.low.toLocaleString()}&ndash;$
            {budget.high.toLocaleString()}
          </p>
        </div>
      </ImmersiveHero>

      <section className="relative bg-void pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Optical bench diagram — visualizes what the parts build */}
          <div className="py-10 sm:py-12">
            <OpticalBench />
          </div>

          <PartsTable />

          {/* Bottom CTA */}
          <Reveal>
            <div className="card-atlas tick-corners tick-corners-brass mt-16 p-8 text-center sm:p-10">
              <h2 className="font-display text-2xl text-starlight sm:text-3xl">
                Want to help us get these parts?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-chart-bright/70 sm:text-base">
                Whether it&apos;s a financial contribution, an in-kind donation,
                or lending us workshop space, every bit helps bring this
                telescope to life.
              </p>
              <div className="mt-7">
                <SponsorButton className="btn-brass px-8 py-3 text-sm">
                  Become a Sponsor
                </SponsorButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
