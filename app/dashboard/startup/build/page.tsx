import { ConstructionRequirementSheet } from "@/components/branch/ConstructionRequirementSheet";
import { InfraStatusBadge } from "@/components/branch/data/InfraStatusBadge";
import { OfficialSourceBadge } from "@/components/branch/data/OfficialSourceBadge";
import { QuoteRequiredBadge } from "@/components/branch/data/QuoteRequiredBadge";
import { EquipmentListCard } from "@/components/branch/EquipmentListCard";
import { InfraEquipmentLeadSection } from "@/components/branch/InfraEquipmentLeadSection";
import { PageHeader } from "@/components/branch/Common";
import { PartnerRequestPanel } from "@/components/branch/PartnerRequestPanel";
import { SignageDirectionCard } from "@/components/branch/SignageDirectionCard";
import { BranchCard } from "@/components/branch/ui/BranchCard";
import { getConstructionRequirements, getDashboardCopy, getEquipmentList, getSignageRequirements } from "@/lib/branch/data";
import { getMergedInfraData } from "@/lib/branch/infra/merge-infra-data";
import type { InfraCandidate } from "@/lib/branch/infra/infra-types";
import { getRealFeaturedFranchise } from "@/lib/branch/real-data";
import { formatKRW, formatRange } from "@/lib/branch/format";

export default function BuildPage() {
  const copy = getDashboardCopy().screens.build;
  const deop = getRealFeaturedFranchise();
  const infra = getMergedInfraData();
  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <ConstructionRequirementSheet requirements={getConstructionRequirements()} />
        <div className="grid gap-5">
          {deop ? (
            <BranchCard>
              <h3 className="text-lg font-black text-[color:var(--branch-primary)]">덮덮밥 15평 기준 참고 비용</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <p>창업비용 {formatRange(deop.startupCostMin, deop.startupCostMax)}</p>
                <p>인테리어 {formatKRW(deop.interiorCost)}</p>
                <p>주방설비 {formatKRW(deop.equipmentCost)}</p>
                <p>간판 {formatKRW(deop.signageCost)}</p>
              </div>
              <p className="mt-3 text-xs font-bold leading-5 text-[color:var(--branch-ink-muted)]">계약 전 본사 자료와 정보공개서 재확인 필요</p>
            </BranchCard>
          ) : null}
          <EquipmentListCard items={getEquipmentList()} />
          <SignageDirectionCard signage={getSignageRequirements()} />
          <PartnerRequestPanel />
        </div>
      </div>
      <p className="rounded-xl bg-[color:var(--branch-surface-muted)] p-4 text-sm font-bold leading-6 text-[color:var(--branch-ink-muted)]">
        공식 페이지와 공개 목록 기반 후보입니다. 실제 계약 전 업체 견적, 배송·설치비, 부가세, 인허가 조건을 재확인해야 합니다.
      </p>
      <section className="grid gap-5 xl:grid-cols-2">
        <CandidateCardSection title="1. 시공 상담 후보" items={infra.constructionAndConsultingCandidates} />
        <CandidateCardSection title="2. 주방설비 후보" items={infra.kitchenEquipmentCandidates} />
      </section>
      <InfraEquipmentLeadSection items={infra.equipmentProductLeads} />
      <CandidateCardSection title="3. 간판/인쇄 제작 후보" items={infra.signagePrintingCandidates} />
      <BranchCard>
        <h3 className="text-lg font-black text-[color:var(--branch-primary)]">4. 견적 전 반드시 확인할 것</h3>
        <ul className="mt-4 grid gap-2 text-sm font-bold text-[color:var(--branch-ink-muted)]">
          {[
            "공종별 견적 분리 여부",
            "철거·전기·급배수·덕트 포함 여부",
            "후드 외부 배출 가능 여부",
            "가스 또는 전기 증설 필요 여부",
            "주방설비 배송·설치비",
            "간판 신고·허가 포함 여부",
            "하자보수 기간",
            "부가세 포함 여부"
          ].map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </BranchCard>
    </div>
  );
}

function CandidateCardSection({ title, items }: { title: string; items: InfraCandidate[] }) {
  return (
    <BranchCard>
      <h3 className="text-lg font-black text-[color:var(--branch-primary)]">{title}</h3>
      <div className="mt-4 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-black text-[color:var(--branch-primary)]">{item.name}</h4>
                <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">{item.busanFit ?? "부산 적합도 추가 확인 필요"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <InfraStatusBadge status={item.verificationStatus} />
                <OfficialSourceBadge minimal={item.verificationStatus.includes("minimal")} />
                <QuoteRequiredBadge required={item.quoteRequired} />
              </div>
            </div>
            <p className="mt-3 text-xs font-bold text-[color:var(--branch-ink-muted)]">{item.useFor.join(" · ")}</p>
            {item.relevantTasks.length > 0 ? <p className="mt-2 text-xs font-bold text-[color:var(--branch-accent)]">{item.relevantTasks.join(" / ")}</p> : null}
            <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-xl bg-[color:var(--branch-primary)] px-4 py-2 text-sm font-black text-white">
              공식 페이지 열기
            </a>
          </article>
        ))}
      </div>
    </BranchCard>
  );
}
