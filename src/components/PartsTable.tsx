"use client";

import { useMemo, useState } from "react";
import {
  parts,
  categories,
  type Part,
  type PartCategory,
  type PartStatus,
} from "@/data/parts";

const statusColor: Record<PartStatus, string> = {
  Donated: "text-ok",
  Claimed: "text-ok",
  Ordered: "text-ink-2",
  Needed: "text-ink-3",
};

function Status({ part }: { part: Part }) {
  const text =
    part.status === "Donated" && part.donatedBy
      ? `Donated · ${part.donatedBy}`
      : part.status === "Claimed" && part.fab
        ? `In-house · ${part.fab}`
        : part.status;
  return <span className={`text-[0.8125rem] ${statusColor[part.status]}`}>{text}</span>;
}

function Name({ part }: { part: Part }) {
  if (!part.purchaseUrl) return <span className="text-ink">{part.name}</span>;
  return (
    <a href={part.purchaseUrl} target="_blank" rel="noopener noreferrer" className="link">
      {part.name}
    </a>
  );
}

export default function PartsTable() {
  const [active, setActive] = useState<"All" | PartCategory>("All");

  const grouped = useMemo(() => {
    const visible = active === "All" ? categories : [active];
    return visible
      .map((category) => ({ category, items: parts.filter((p) => p.category === category) }))
      .filter((g) => g.items.length > 0);
  }, [active]);

  return (
    <div>
      <div role="group" aria-label="Filter parts by category" className="flex flex-wrap gap-x-5 gap-y-2">
        {(["All", ...categories] as const).map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={isActive}
              className={`nav-link text-[0.9375rem] ${isActive ? "text-ink underline underline-offset-[6px] decoration-1" : ""}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-10 space-y-12">
        {grouped.map((g) => (
          <section key={g.category} aria-labelledby={`cat-${g.category}`}>
            <h2 id={`cat-${g.category}`} className="label mb-2">
              {g.category} · {g.items.length}
            </h2>
            <ul>
              {g.items.map((part) => (
                <li
                  key={part.name}
                  className="row grid gap-x-6 gap-y-1.5 py-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_5rem_minmax(0,1fr)] sm:items-baseline"
                >
                  <div className="flex items-start gap-3">
                    {part.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={part.image}
                        alt=""
                        loading="lazy"
                        width={36}
                        height={36}
                        className="mt-0.5 h-9 w-9 shrink-0 rounded-sm object-cover opacity-80"
                      />
                    )}
                    <div>
                      <p className="text-[0.9375rem]">
                        <Name part={part} />
                      </p>
                      {part.notes && (
                        <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-3">{part.notes}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-[0.875rem] text-ink-2">{part.specification}</p>
                  <p className="font-mono text-[0.8125rem] text-ink-2 tabular-nums sm:text-right">
                    {part.estimatedCost.startsWith("$")
                      ? `${part.quantity} × ${part.estimatedCost}`
                      : `${part.quantity} × —`}
                  </p>
                  <p className="sm:text-right">
                    <Status part={part} />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
