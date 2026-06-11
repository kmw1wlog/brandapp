import type { FranchiseBenchmarkSummary, FranchiseBrand } from "@/lib/branch/real-types";
import { formatKRW, formatRange } from "@/lib/branch/format";
import { ActionLink, Badge } from "./Common";
import { DataQualityBadge } from "./data/DataQualityBadge";

export function FranchiseCompareCard({ franchise, summary, onDetail }: { franchise: FranchiseBrand; summary: FranchiseBenchmarkSummary; onDetail: () => void }) {
  return (
    <section className="rounded-lg border border-[#d8d0c4] bg-[#f3eee6] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#7b6f62]">{summary.label}</p>
          <h3 className="mt-2 text-2xl font-black text-[#2c2924]">{franchise.name}</h3>
          <p className="mt-1 text-sm text-[#655d52]">{summary.sublabel}</p>
        </div>
        <Badge tone={franchise.confidenceScore < 0.8 ? "warning" : "success"}>{franchise.confidenceScore < 0.8 ? "재확인 필요" : "공개정보 기반"}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <DataQualityBadge status={franchise.dataStatus} />
        {summary.missingCounts.monthlyAverageSales ? <Badge tone="warning">누락 {summary.missingCounts.monthlyAverageSales}건</Badge> : null}
      </div>
      <dl className="mt-5 grid gap-3 text-sm">
        <Row label="예상 초기자본" value={summary.startupCostMedian ? formatKRW(summary.startupCostMedian) : formatRange(franchise.startupCostMin, franchise.startupCostMax)} />
        <Row label="가맹비" value={formatKRW(franchise.franchiseFee)} />
        <Row label="교육비" value={formatKRW(franchise.educationFee)} />
        <Row label="인테리어비" value={formatKRW(franchise.interiorCost)} />
        <Row label="기타비용" value={formatKRW(franchise.otherCost)} />
        <Row label="월매출" value={formatKRW(summary.monthlySalesMedian ?? franchise.monthlyAverageSales)} />
        <Row label="점주 순이익" value={formatKRW(summary.ownerProfitMedian ?? franchise.ownerProfit)} />
      </dl>
      <p className="mt-4 rounded-lg bg-white p-3 text-xs leading-5 text-[#655d52]">덮덮밥 수익 예시는 브랜드 직접 입력 참고 수치이며, 실제 수익은 상권·임대료·인건비·운영 방식에 따라 달라질 수 있습니다.</p>
      <p className="mt-3 text-xs font-semibold text-[#655d52]">프랜차이즈가 더 나을 수도 있습니다. 본 화면은 계약 전 비교 질문을 만들기 위한 참고 자료입니다.</p>
      <div className="mt-5">
        <ActionLink href="/dashboard/startup/franchise" onClick={onDetail}>프랜차이즈 자세히 보기</ActionLink>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3 border-b border-[#ddd2c0] pb-2"><dt className="text-[#655d52]">{label}</dt><dd className="font-black text-[#2c2924]">{value}</dd></div>;
}
