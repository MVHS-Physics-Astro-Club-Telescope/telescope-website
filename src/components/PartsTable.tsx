"use client";

import { useState, useMemo } from "react";
import {
  parts,
  categories,
  getBudgetRange,
  getStatusCounts,
  type PartCategory,
  type PartStatus,
} from "@/data/parts";

function StatusBadge({ status }: { status: PartStatus }) {
  const colorMap: Record<PartStatus, { dot: string; text: string }> = {
    Donated: { dot: "bg-[#30D158]", text: "text-[#30D158]" },
    Needed: { dot: "bg-[#FF9F0A]", text: "text-[#FF9F0A]" },
    Ordered: { dot: "bg-[#0A84FF]", text: "text-[#0A84FF]" },
    Claimed: { dot: "bg-[#0A84FF]", text: "text-[#0A84FF]" },
  };

  const colors = colorMap[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      <span className={colors.text}>{status}</span>
    </span>
  );
}

export default function PartsTable() {
  const [activeCategory, setActiveCategory] = useState<"All" | PartCategory>("All");
  const budget = useMemo(() => getBudgetRange(), []);
  const statusCounts = useMemo(() => getStatusCounts(), []);

  const filteredParts = useMemo(() => {
    if (activeCategory === "All") return parts;
    return parts.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const totalParts = parts.length;

  return (
    <div>
      {/* Budget Summary Cards — titanium card pattern */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300">
          <p className="text-sm text-[rgba(240,240,250,0.4)] mb-1">Total Parts</p>
          <p className="text-2xl font-heading font-bold text-[rgba(240,240,250,1)]">{totalParts}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300">
          <p className="text-sm text-[rgba(240,240,250,0.4)] mb-1">Estimated Budget</p>
          <p className="text-2xl font-heading font-bold text-[rgba(240,240,250,1)]">
            ${budget.low.toLocaleString()}&ndash;${budget.high.toLocaleString()}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300">
          <p className="text-sm text-[rgba(240,240,250,0.4)] mb-1">Donated</p>
          <p className="text-2xl font-heading font-bold">
            <span className="text-[#30D158]">{statusCounts.Donated}</span>
            <span className="text-sm text-[rgba(240,240,250,0.4)] ml-1">/ {totalParts}</span>
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300">
          <p className="text-sm text-[rgba(240,240,250,0.4)] mb-1">Still Needed</p>
          <p className="text-2xl font-heading font-bold">
            <span className="text-[#FF9F0A]">{statusCounts.Needed}</span>
            <span className="text-sm text-[rgba(240,240,250,0.4)] ml-1">/ {totalParts}</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("All")}
          style={
            activeCategory === "All"
              ? {
                  background: 'linear-gradient(180deg, #e8e8ed 0%, #d1d1d6 50%, #BAB9B3 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }
              : undefined
          }
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
            activeCategory === "All"
              ? "text-[#1a1a1f]"
              : "bg-[#121A25] text-[rgba(240,240,250,0.6)] hover:bg-[#1A2333] hover:text-[rgba(240,240,250,0.9)] border border-white/[0.06]"
          }`}
        >
          All ({totalParts})
        </button>
        {categories.map((cat) => {
          const count = parts.filter((p) => p.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(180deg, #e8e8ed 0%, #d1d1d6 50%, #c7c7cc 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }
                  : undefined
              }
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                isActive
                  ? "text-[#1a1a1f]"
                  : "bg-[#121A25] text-[rgba(240,240,250,0.6)] hover:bg-[#1A2333] hover:text-[rgba(240,240,250,0.9)] border border-white/[0.06]"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Part
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Specification
              </th>
              <th className="text-center px-6 py-4 text-xs font-medium uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Qty
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Category
              </th>
              <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Est. Cost
              </th>
              <th className="text-center px-6 py-4 text-xs font-medium uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Donated By
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredParts.map((part) => (
              <tr
                key={part.name}
                className="group hover:bg-white/[0.02] transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-[rgba(240,240,250,0.95)]">
                    {part.name}
                  </div>
                  {part.notes && (
                    <div className="text-xs text-[rgba(240,240,250,0.4)] mt-0.5">
                      {part.notes}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-[rgba(240,240,250,0.6)]">
                  {part.specification}
                </td>
                <td className="px-6 py-4 text-sm text-[rgba(240,240,250,0.6)] text-center">
                  {part.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-[rgba(240,240,250,0.6)]">
                  {part.category}
                </td>
                <td className="px-6 py-4 text-sm text-[rgba(240,240,250,0.6)] text-right">
                  {part.estimatedCost}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={part.status} />
                </td>
                <td className="px-6 py-4 text-sm text-[rgba(240,240,250,0.6)]">
                  {part.donatedBy ? (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5 text-[#30D158] shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {part.donatedBy}
                    </span>
                  ) : (
                    "\u2014"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards — titanium card pattern */}
      <div className="md:hidden space-y-3">
        {filteredParts.map((part) => (
          <div
            key={part.name}
            className="p-4 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[rgba(240,240,250,0.95)]">
                  {part.name}
                </h3>
                <p className="text-xs text-[rgba(240,240,250,0.4)] mt-0.5">{part.category}</p>
              </div>
              <StatusBadge status={part.status} />
            </div>
            <p className="text-xs text-[rgba(240,240,250,0.6)] mb-2">
              {part.specification}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[rgba(240,240,250,0.4)]">
                Qty: <span className="text-[rgba(240,240,250,0.6)]">{part.quantity}</span>
              </span>
              <span className="text-[rgba(240,240,250,0.7)] font-medium">
                {part.estimatedCost}
              </span>
            </div>
            {part.donatedBy && (
              <div className="flex items-center gap-1.5 text-xs text-[rgba(240,240,250,0.6)] mt-2 pt-2 border-t border-white/[0.04]">
                <svg
                  className="w-3 h-3 text-[#30D158] shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Donated by {part.donatedBy}
              </div>
            )}
            {part.notes && (
              <p className={`text-xs text-[rgba(240,240,250,0.4)] mt-2 ${!part.donatedBy ? "pt-2 border-t border-white/[0.04]" : ""}`}>
                {part.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
