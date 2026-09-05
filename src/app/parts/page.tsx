import type { Metadata } from "next";
import PartsTable from "@/components/PartsTable";
import { parts, getBudgetRange, getStatusCounts } from "@/data/parts";

export const metadata: Metadata = {
  title: "Parts",
  description:
    "The full bill of materials for the MV Astronomy telescope: every part, what it costs, and what is still needed.",
};

export default function PartsPage() {
  const budget = getBudgetRange();
  const counts = getStatusCounts();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <p className="label">Parts</p>
      <h1 className="font-display mt-3 max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
        Every part, bolt for bolt.
      </h1>
      <p className="prose-tight mt-5 text-lg">
        The complete bill of materials. Links are for reference; if you want to
        donate a part, <a href="mailto:mvhsphysicsastroclub@gmail.com?subject=Part%20donation" className="link">email us first</a> so
        we can confirm the spec.
      </p>

      <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <dt className="label">Line items</dt>
          <dd className="font-display mt-2 text-3xl text-ink tabular-nums">{parts.length}</dd>
        </div>
        <div>
          <dt className="label">Budget</dt>
          <dd className="font-display mt-2 text-3xl text-ink tabular-nums">
            ${budget.low.toLocaleString()}&ndash;{budget.high.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="label">Donated</dt>
          <dd className="font-display mt-2 text-3xl text-ink tabular-nums">{counts.Donated}</dd>
        </div>
        <div>
          <dt className="label">Still needed</dt>
          <dd className="font-display mt-2 text-3xl text-ink tabular-nums">{counts.Needed}</dd>
        </div>
      </dl>

      <div className="mt-16">
        <PartsTable />
      </div>
    </div>
  );
}
