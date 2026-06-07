import { OwnerDashboardPreview } from "@/components/branch/OwnerDashboardPreview";
import { PageHeader } from "@/components/branch/Common";
import { getDashboardCopy, getProfitSimulations } from "@/lib/branch/data";

export default function OwnerPreviewPage() {
  const copy = getDashboardCopy().screens.owner_preview;
  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <OwnerDashboardPreview simulation={getProfitSimulations()} />
    </div>
  );
}
