import type { FranchiseBenchmark } from "@/lib/branch/types";
import { calculateFranchiseSummary } from "@/lib/branch/calculations";
import { formatKRW, formatRange } from "@/lib/branch/format";
import { ActionLink, Badge } from "./Common";

export function FranchiseCompareCard({ franchise, onDetail }: { franchise: FranchiseBenchmark; onDetail: () => void }) {
  const summary = calculateFranchiseSummary(franchise);
  return (
    <section className="rounded-lg border border-[#d8d0c4] bg-[#f3eee6] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#7b6f62]">프랜차이즈 비교안</p>
          <h3 className="mt-2 text-2xl font-black text-[#2c2924]">{franchise.brand_name}</h3>
          <p className="mt-1 text-sm text-[#655d52]">{franchise.category}</p>
        </div>
        <Badge tone={franchise.confidence_score < 0.8 ? "warning" : "success"}>{franchise.confidence_score < 0.8 ? "재확인 필요" : "공개정보 기반"}</Badge>
      </div>
      <dl className="mt-5 grid gap-3 text-sm">
        <Row label="예상 초기자본" value={summary.startupCost ? formatKRW(summary.startupCost) : formatRange(franchise.startup_cost_min, franchise.startup_cost_max)} />
        <Row label="가맹비" value={formatKRW(franchise.franchise_fee)} />
        <Row label="교육비" value={formatKRW(franchise.education_fee)} />
        <Row label="인테리어비" value={formatKRW(franchise.interior_cost)} />
        <Row label="기타비용" value={formatKRW(franchise.other_cost)} />
        <Row label="월매출" value={formatKRW(summary.monthlySales)} />
        <Row label="점주 순이익" value={formatKRW(summary.monthlyProfit)} />
      </dl>
      <p className="mt-4 rounded-lg bg-white p-3 text-xs leading-5 text-[#655d52]">{franchise.data_note}</p>
      <p className="mt-3 text-xs font-semibold text-[#655d52]">프랜차이즈가 더 나을 수도 있습니다. 본 화면은 계약 전 비교 질문을 만들기 위한 참고 자료입니다.</p>
      <div className="mt-5">
        <ActionLink href="/dashboard/startup/cost" onClick={onDetail}>프랜차이즈 자세히 보기</ActionLink>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3 border-b border-[#ddd2c0] pb-2"><dt className="text-[#655d52]">{label}</dt><dd className="font-black text-[#2c2924]">{value}</dd></div>;
}
