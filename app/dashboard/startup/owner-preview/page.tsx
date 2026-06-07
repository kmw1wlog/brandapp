import { OwnerDashboardPreview } from "@/components/branch/OwnerDashboardPreview";
import { PageHeader } from "@/components/branch/Common";
import { getDashboardCopy } from "@/lib/branch/data";
import { getMergedInfraData } from "@/lib/branch/infra/merge-infra-data";
import { getRealProfitSimulationsOrFallback, getRealReadiness } from "@/lib/branch/real-data";

export default function OwnerPreviewPage() {
  const copy = getDashboardCopy().screens.owner_preview;
  const infra = getMergedInfraData();
  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <OwnerDashboardPreview simulation={getRealProfitSimulationsOrFallback()} readiness={getRealReadiness()} infra={infra} />
    </div>
  );
}
