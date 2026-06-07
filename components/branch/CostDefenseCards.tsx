"use client";

import { ShieldCheck } from "lucide-react";
import { calculateCostDefenseImpact } from "@/lib/branch/calculations";
import { trackEvent } from "@/lib/branch/events";
import { formatKRW } from "@/lib/branch/format";
import type { MenuCost } from "@/lib/branch/types";

const strategies = ["공급처 변경", "원산지 변경", "세트 구성", "공동구매 참여"];

export function CostDefenseCards({ menu }: { menu: MenuCost }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {strategies.map((strategy) => {
        const impact = calculateCostDefenseImpact(menu, strategy);
        return (
          <button key={strategy} onClick={() => trackEvent("cost_defense_save", { strategy })} className="rounded-lg border border-[#ddd2c0] bg-white p-4 text-left">
            <ShieldCheck size={18} className="text-[#164033]" />
            <p className="mt-2 font-black text-[#164033]">{strategy}</p>
            <p className="mt-1 text-sm text-[#655d52]">1인분 {formatKRW(impact.saving)} 절감 여지</p>
          </button>
        );
      })}
    </div>
  );
}
