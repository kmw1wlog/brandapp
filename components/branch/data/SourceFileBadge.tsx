import { BranchBadge } from "@/components/branch/ui/BranchBadge";

export function SourceFileBadge({ file }: { file: string }) {
  return <BranchBadge tone="info">{file}</BranchBadge>;
}
