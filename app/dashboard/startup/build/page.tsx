import { ConstructionRequirementSheet } from "@/components/branch/ConstructionRequirementSheet";
import { EquipmentListCard } from "@/components/branch/EquipmentListCard";
import { PageHeader } from "@/components/branch/Common";
import { PartnerRequestPanel } from "@/components/branch/PartnerRequestPanel";
import { SignageDirectionCard } from "@/components/branch/SignageDirectionCard";
import { BranchCard } from "@/components/branch/ui/BranchCard";
import { getConstructionRequirements, getDashboardCopy, getEquipmentList, getSignageRequirements } from "@/lib/branch/data";
import { getRealFeaturedFranchise } from "@/lib/branch/real-data";
import { formatKRW, formatRange } from "@/lib/branch/format";

export default function BuildPage() {
  const copy = getDashboardCopy().screens.build;
  const deop = getRealFeaturedFranchise();
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
    </div>
  );
}
