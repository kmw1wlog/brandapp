import { FinalReportSummary } from "@/components/branch/FinalReportSummary";
import { PageHeader } from "@/components/branch/Common";

export default function ReportPage() {
  return (
    <div className="grid gap-5">
      <PageHeader title="최종 창업 리포트 요약" subtitle="선택한 자가 브랜드안, 프랜차이즈 비교, 메뉴·원가, 공급처, 시공 요구사항서, 개점 타임테이블과 상담 대기 상태를 한 화면에 모았습니다." warning="표시 수치는 샘플 데이터 기반 추정이며 실제 계약·운영 결과를 보장하지 않습니다." />
      <FinalReportSummary />
    </div>
  );
}
