import { SlidersHorizontal } from "lucide-react";
import { formatKRW } from "@/lib/branch/format";
import type { BranchScenario } from "@/lib/branch/types";

export function InputSummaryBar({ scenario }: { scenario: BranchScenario }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#ddd2c0] bg-white px-4 py-3">
      <div className="flex flex-wrap gap-2 text-sm font-bold text-[#164033]">
        <span>자본 {formatKRW(scenario.capital)}</span>
        <span>지역 {scenario.region.display_name}</span>
        <span>업종 {scenario.category}</span>
        <span>운영형태 둘 다 보기</span>
      </div>
      <button className="inline-flex items-center gap-2 rounded-md border border-[#cbbda8] px-3 py-2 text-sm font-bold text-[#574d42]">
        <SlidersHorizontal size={16} />
        입력 변경
      </button>
    </div>
  );
}
