import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { getInfraStatusLabel } from "@/lib/branch/infra/infra-quality";

export function InfraStatusBadge({ status }: { status: string }) {
  const tone = status.includes("verified") ? "success" : status.includes("minimal") ? "info" : "warning";
  return <BranchBadge tone={tone}>{getInfraStatusLabel(status)}</BranchBadge>;
}
