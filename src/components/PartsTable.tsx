"use client";

import { useState, useMemo } from "react";
import {
  parts,
  categories,
  getBudgetRange,
  getStatusCounts,
  type Part,
  type PartCategory,
  type PartStatus,
} from "@/data/parts";

const statusStyles: Record<PartStatus, string> = {
  Donated: "border-brass/50 text-brass",
  Needed: "border-chart/40 text-chart",
  Ordered: "border-chart-bright/60 text-chart-bright",
  Claimed: "border-oiii/50 text-oiii",
};

function StatusChip({ status }: { status: PartStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="h-3 w-3 opacity-50"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function PartName({ part }: { part: Part }) {
  if (!part.purchaseUrl) return <>{part.name}</>;
  return (
    <a
      href={part.purchaseUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-chart-bright underline decoration-chart/30 underline-offset-2 transition-colors duration-200 hover:text-brass-bright hover:decoration-brass/60"
    >
      {part.name}
      <ExternalIcon />
    </a>
  );
}

export default function PartsTable() {
  const [activeCategory, setActiveCategory] = useState<"All" | PartCategory>("All");
  const budget = useMemo(() => getBudgetRange(), []);
  const statusCounts = useMemo(() => getStatusCounts(), []);

  const grouped = useMemo(() => {
    const visible = activeCategory === "All" ? categories : [activeCategory];
    return visible
      .map((category) => ({
        category,
        items: parts.filter((p) => p.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeCategory]);

  const totalParts = parts.length;
  const lineNo = (part: Part) => String(parts.indexOf(part) + 1).padStart(2, "0");

  return (
    <div>
      <h2 className="sr-only">Parts list</h2>

      {/* Advisory */}
      <div className="card-atlas mb-10 border-l-2 border-l-brass/60 p-5">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-brass">
          Advisory · Confirm before purchasing
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-chart-bright/70">
          Product links are provided as reference only. Before purchasing any
          part, please contact us at{" "}
          <a
            href="mailto:mvhsphysicsastroclub@gmail.com"
            className="text-starlight underline decoration-chart/30 underline-offset-2 transition-colors duration-200 hover:decoration-brass/60"
          >
            mvhsphysicsastroclub@gmail.com
          </a>{" "}
          to confirm specifications and compatibility with our build. Prices
          and availability may change.
        </p>
      </div>

      {/* Manifest ledger */}
      <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-chart/15 py-8 lg:grid-cols-4">
        <div>
          <div className="font-mono text-2xl text-starlight tabular-nums sm:text-3xl">
            {totalParts}
          </div>
          <div className="eyebrow mt-1.5 !text-[0.625rem]">Line items</div>
        </div>
        <div>
          <div className="font-mono text-2xl text-starlight tabular-nums sm:text-3xl">
            ${budget.low.toLocaleString()}&ndash;{budget.high.toLocaleString()}
          </div>
          <div className="eyebrow mt-1.5 !text-[0.625rem]">Estimated budget</div>
        </div>
        <div>
          <div className="font-mono text-2xl tabular-nums sm:text-3xl">
            <span className="text-brass">{statusCounts.Donated}</span>
            <span className="text-sm text-chart-bright/50"> / {totalParts}</span>
          </div>
          <div className="eyebrow mt-1.5 !text-[0.625rem]">Donated</div>
        </div>
        <div>
          <div className="font-mono text-2xl tabular-nums sm:text-3xl">
            <span className="text-chart-bright">{statusCounts.Needed}</span>
            <span className="text-sm text-chart-bright/50"> / {totalParts}</span>
          </div>
          <div className="eyebrow mt-1.5 !text-[0.625rem]">Still needed</div>
        </div>
      </div>

      {/* Category filter */}
      <div
        role="group"
        aria-label="Filter parts by category"
        className="mb-10 flex flex-wrap gap-2"
      >
        {(["All", ...categories] as const).map((cat) => {
          const count =
            cat === "All"
              ? totalParts
              : parts.filter((p) => p.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={isActive}
              className={`rounded-[3px] border px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-bright/80 ${
                isActive
                  ? "border-brass/60 bg-raised text-brass-bright"
                  : "border-chart/15 bg-panel/60 text-chart-bright/60 hover:border-chart/35 hover:text-chart-bright"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Desktop manifest table */}
      <div className="card-atlas hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-chart/15">
                <th className="px-4 py-3.5 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.18em] text-chart/80">
                  No.
                </th>
                <th className="px-4 py-3.5 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.18em] text-chart/80">
                  Part
                </th>
                <th className="px-4 py-3.5 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.18em] text-chart/80">
                  Specification
                </th>
                <th className="px-4 py-3.5 text-center font-mono text-[0.625rem] font-normal uppercase tracking-[0.18em] text-chart/80">
                  Qty
                </th>
                <th className="px-4 py-3.5 text-right font-mono text-[0.625rem] font-normal uppercase tracking-[0.18em] text-chart/80">
                  Est. cost
                </th>
                <th className="px-4 py-3.5 text-center font-mono text-[0.625rem] font-normal uppercase tracking-[0.18em] text-chart/80">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.18em] text-chart/80">
                  Donated by
                </th>
              </tr>
            </thead>
            {grouped.map((group) => (
              <tbody key={group.category}>
                <tr className="border-b border-chart/12 bg-deep">
                  <td colSpan={7} className="px-4 py-2.5">
                    <span className="eyebrow !text-[0.625rem]">
                      {group.category} · {group.items.length}{" "}
                      {group.items.length === 1 ? "item" : "items"}
                    </span>
                  </td>
                </tr>
                {group.items.map((part) => (
                  <tr
                    key={part.name}
                    className="border-b border-chart/8 transition-colors duration-150 hover:bg-raised"
                  >
                    <td className="px-4 py-4 align-top font-mono text-xs text-chart/60 tabular-nums">
                      {lineNo(part)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm text-starlight">
                        <PartName part={part} />
                      </div>
                      {part.notes && (
                        <div className="mt-1 text-xs leading-relaxed text-chart-bright/50">
                          {part.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top text-sm leading-relaxed text-chart-bright/70">
                      {part.specification}
                    </td>
                    <td className="px-4 py-4 text-center align-top font-mono text-xs text-chart-bright/85 tabular-nums">
                      {part.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right align-top font-mono text-xs text-chart-bright/85 tabular-nums">
                      {part.estimatedCost}
                    </td>
                    <td className="px-4 py-4 text-center align-top">
                      <StatusChip status={part.status} />
                    </td>
                    <td className="px-4 py-4 align-top">
                      {part.donatedBy ? (
                        <span className="font-mono text-xs text-brass/90">
                          {part.donatedBy}
                        </span>
                      ) : (
                        <span className="text-sm text-chart/40">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>

      {/* Mobile manifest cards */}
      <div className="space-y-8 md:hidden">
        {grouped.map((group) => (
          <div key={group.category}>
            <p className="eyebrow mb-3 !text-[0.625rem]">
              {group.category} · {group.items.length}{" "}
              {group.items.length === 1 ? "item" : "items"}
            </p>
            <div className="space-y-3">
              {group.items.map((part) => (
                <article key={part.name} className="card-atlas p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium text-starlight">
                      <span className="mr-2 font-mono text-[0.625rem] text-chart/50 tabular-nums">
                        {lineNo(part)}
                      </span>
                      <PartName part={part} />
                    </h3>
                    <StatusChip status={part.status} />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-chart-bright/65">
                    {part.specification}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-chart/10 pt-3 font-mono text-xs">
                    <span className="text-chart/70">QTY {part.quantity}</span>
                    <span className="text-chart-bright/85 tabular-nums">
                      {part.estimatedCost}
                    </span>
                  </div>
                  {part.donatedBy && (
                    <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brass/90">
                      Donated by {part.donatedBy}
                    </p>
                  )}
                  {part.notes && (
                    <p className="mt-2 text-xs leading-relaxed text-chart-bright/50">
                      {part.notes}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
