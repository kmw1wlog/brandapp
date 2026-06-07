import { ConstructionRequirementSheet } from "@/components/branch/ConstructionRequirementSheet";
import { EquipmentListCard } from "@/components/branch/EquipmentListCard";
import { PageHeader } from "@/components/branch/Common";
import { PartnerRequestPanel } from "@/components/branch/PartnerRequestPanel";
import { SignageDirectionCard } from "@/components/branch/SignageDirectionCard";
import { getConstructionRequirements, getDashboardCopy, getEquipmentList, getSignageRequirements } from "@/lib/branch/data";

export default function BuildPage() {
  const copy = getDashboardCopy().screens.build;
  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <ConstructionRequirementSheet requirements={getConstructionRequirements()} />
        <div className="grid gap-5">
          <EquipmentListCard items={getEquipmentList()} />
          <SignageDirectionCard signage={getSignageRequirements()} />
          <PartnerRequestPanel />
        </div>
      </div>
    </div>
  );
}
