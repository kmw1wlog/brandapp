import { BranchBadge } from "@/components/branch/ui/BranchBadge";

export function QuoteRequiredBadge({ required, label = "견적 필요" }: { required: boolean; label?: string }) {
  if (!required) return null;
  return <BranchBadge tone="warning">{label}</BranchBadge>;
}
