import { formatKRW, formatScore } from "@/lib/branch/format";
import { calculateOwnBrandSummary } from "@/lib/branch/calculations";
import type { BrandOption } from "@/lib/branch/types";

export function BrandSummaryPanel({ brand, operatingType }: { brand: BrandOption; operatingType: string }) {
  const summary = calculateOwnBrandSummary(brand, operatingType);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label="초기비용" value={formatKRW(summary.initialCapital)} />
      <Metric label="월매출 추정" value={formatKRW(summary.monthlySales)} />
      <Metric label="월 순이익 추정" value={formatKRW(summary.monthlyProfit)} />
      <Metric label="손익분기" value={`${summary.breakevenMonths}개월`} />
      <Metric label="브랜드 자유도" value={formatScore(brand.brand_freedom_score)} />
      <Metric label="공급처 자유도" value={formatScore(brand.supplier_freedom_score)} />
      <Metric label="원가방어" value={formatScore(brand.cost_defense_score)} />
      <Metric label="오픈 난이도" value={formatScore(brand.opening_difficulty_score)} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#ddd2c0] bg-white p-4">
      <p className="text-xs font-bold text-[#7a7065]">{label}</p>
      <p className="mt-1 text-xl font-black text-[#164033]">{value}</p>
    </div>
  );
}
