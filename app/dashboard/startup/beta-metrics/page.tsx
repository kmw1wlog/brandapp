import { BetaMetricsPanel } from "@/components/branch/BetaMetricsPanel";
import { PageHeader } from "@/components/branch/Common";

export default function BetaMetricsPage() {
  return (
    <div className="grid gap-5">
      <PageHeader title="오픈채팅 베타 전환 데이터" subtitle="직접 URL로 접근하는 내부 확인 화면입니다. localStorage에 저장된 이벤트, 상담 리드, 피드백을 확인합니다." />
      <BetaMetricsPanel />
    </div>
  );
}
