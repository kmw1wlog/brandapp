import type { BrandOption } from "@/lib/branch/types";
import { calculateOwnBrandSummary } from "@/lib/branch/calculations";
import { formatKRW } from "@/lib/branch/format";
import { BrandVisualBoard } from "./BrandVisualBoard";
import { ActionLink } from "./Common";

export function OwnBrandCard({ brand, operatingType, onDetail }: { brand: BrandOption; operatingType: string; onDetail: () => void }) {
  const summary = calculateOwnBrandSummary(brand, operatingType);
  return (
    <section className="rounded-lg bg-[#164033] p-5 text-white">
      <p className="text-sm font-bold text-[#e2b15f]">내 브랜드 완성본</p>
      <h3 className="mt-2 text-3xl font-black">{brand.name}</h3>
      <p className="mt-1 text-lg font-semibold">{brand.slogan}</p>
      <p className="mt-3 text-sm leading-6 text-white/78">{brand.concept}</p>
      <div className="mt-5"><BrandVisualBoard brand={brand} /></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric label="예상 초기자본" value={formatKRW(summary.initialCapital)} />
        <Metric label="예상 월매출" value={formatKRW(summary.monthlySales)} />
        <Metric label="예상 순이익" value={formatKRW(summary.monthlyProfit)} />
        <Metric label="손익분기점" value={`${summary.breakevenMonths}개월`} />
      </div>
      <div className="mt-5">
        <ActionLink href="/dashboard/startup/brand" onClick={onDetail}>이 브랜드 자세히 보기</ActionLink>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/10 p-3"><p className="text-xs text-white/65">{label}</p><p className="mt-1 text-lg font-black">{value}</p></div>;
}
