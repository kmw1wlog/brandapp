"use client";

import type { FinanceScenarioKey } from "@/lib/branch/finance/finance-types";

const tabs: Array<{ key: FinanceScenarioKey; label: string }> = [
  { key: "conservative", label: "보수적" },
  { key: "base", label: "기준" },
  { key: "optimistic", label: "낙관적" }
];

export function ScenarioTabs({ value, onChange }: { value: FinanceScenarioKey; onChange: (value: FinanceScenarioKey) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button key={tab.key} type="button" onClick={() => onChange(tab.key)} className={`rounded-lg px-4 py-2 text-sm font-black ${value === tab.key ? "bg-[#164033] text-white" : "bg-white text-[#574d42] border border-[#ddd2c0]"}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
