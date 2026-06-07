import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { dataStatusLabels, dataStatusTone } from "@/lib/branch/real-quality";

export function DataQualityBadge({ status }: { status: string }) {
  return <BranchBadge tone={dataStatusTone[status] ?? "default"}>{dataStatusLabels[status] ?? status}</BranchBadge>;
}
