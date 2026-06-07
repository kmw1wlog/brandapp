import { BranchBadge } from "@/components/branch/ui/BranchBadge";

export function NeedsManualCheckBadge({ note }: { note?: string | null }) {
  if (!note) return null;
  return <BranchBadge tone="warning">{note}</BranchBadge>;
}
