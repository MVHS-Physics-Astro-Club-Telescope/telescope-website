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

const statusStyles: Record<PartStatus, { bg: string; text: string; dot: string }> = {
  Donated: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  Ordered: {
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  Needed: {
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  Claimed: {
    bg: "bg-violet-500/10 border-violet-500/20",
    text: "text-violet-400",
    dot: "bg-violet-400",
  },
};

function StatusBadge({ status }: { status: PartStatus }) {
  const style = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
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
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
          <p className="text-sm text-slate-500 mb-1">Total Parts</p>
          <p className="text-2xl font-bold text-white font-mono">{totalParts}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
          <p className="text-sm text-slate-500 mb-1">Estimated Budget</p>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 font-mono">
            ${budget.low.toLocaleString()}\u2013${budget.high.toLocaleString()}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
          <p className="text-sm text-slate-500 mb-1">Donated</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            {statusCounts.Donated}
            <span className="text-sm text-slate-600 ml-1">/ {totalParts}</span>
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
          <p className="text-sm text-slate-500 mb-1">Still Needed</p>
          <p className="text-2xl font-bold text-amber-400 font-mono">
            {statusCounts.Needed}
            <span className="text-sm text-slate-600 ml-1">/ {totalParts}</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeCategory === "All"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
          }`}
        >
          All ({totalParts})
        </button>
        {categories.map((cat) => {
          const count = parts.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Part
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Specification
              </th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Est. Cost
              </th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
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
                  <div className="text-sm font-medium text-white">
                    {part.name}
                  </div>
                  {part.notes && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      {part.notes}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                  {part.specification}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 text-center font-mono">
                  {part.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {part.category}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300 text-right font-mono">
                  {part.estimatedCost}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={part.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredParts.map((part) => (
          <div
            key={part.name}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {part.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{part.category}</p>
              </div>
              <StatusBadge status={part.status} />
            </div>
            <p className="text-xs text-slate-400 font-mono mb-2">
              {part.specification}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Qty: <span className="text-slate-300 font-mono">{part.quantity}</span>
              </span>
              <span className="text-slate-300 font-mono font-medium">
                {part.estimatedCost}
              </span>
            </div>
            {part.notes && (
              <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-white/5">
                {part.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
