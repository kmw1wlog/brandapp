import { BranchBadge } from "@/components/branch/ui/BranchBadge";

export function OfficialSourceBadge({ minimal = false }: { minimal?: boolean }) {
  return <BranchBadge tone={minimal ? "info" : "success"}>{minimal ? "공식 링크 확인" : "공식 출처"}</BranchBadge>;
}
