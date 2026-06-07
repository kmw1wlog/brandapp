import { calculateThreeMonthComparison } from "@/lib/branch/calculations";
import { formatKRW } from "@/lib/branch/format";
import type { ProfitSimulation } from "@/lib/branch/types";

export function ProfitSimulationChart({ simulation }: { simulation: ProfitSimulation }) {
  const rows = calculateThreeMonthComparison(simulation);
  const max = Math.max(...rows.flatMap((row) => [row.franchise_sales, row.own_brand_sales]));
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-xl font-black text-[#164033]">3개월 비교 그래프</h3>
      <p className="mt-1 text-sm text-[#8a5a13]">{simulation.disclaimer}</p>
      <div className="mt-5 grid gap-4">
        {rows.map((row) => (
          <div key={row.month}>
            <p className="mb-2 text-sm font-black">{row.month}개월차</p>
            <Bar label="프랜차이즈 매출" value={row.franchise_sales} max={max} color="bg-[#9a9185]" />
            <Bar label="프랜차이즈 점주 순이익" value={row.franchise_owner_profit} max={max} color="bg-[#c5b9a8]" />
            <Bar label="자가 브랜드 매출" value={row.own_brand_sales} max={max} color="bg-[#164033]" />
            <Bar label="자가 브랜드 점주 순이익" value={row.own_brand_owner_profit} max={max} color="bg-[#b8642f]" />
            <p className="mt-2 text-xs text-[#655d52]">{row.notes}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="mb-2 grid grid-cols-[150px_1fr_90px] items-center gap-2 text-xs">
      <span className="font-semibold text-[#655d52]">{label}</span>
      <div className="h-3 rounded-full bg-[#eee5d7]"><div className={`h-3 rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} /></div>
      <span className="text-right font-bold">{formatKRW(value)}</span>
    </div>
  );
}
