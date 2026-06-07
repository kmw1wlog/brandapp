import { Suspense } from "react";
import { ConsultationCTA } from "@/components/branch/ConsultationCTA";
import { ConsultationLeadForm } from "@/components/branch/ConsultationLeadForm";
import { InfraStatusBadge } from "@/components/branch/data/InfraStatusBadge";
import { OfficialSourceBadge } from "@/components/branch/data/OfficialSourceBadge";
import { QuoteRequiredBadge } from "@/components/branch/data/QuoteRequiredBadge";
import { ConsultationQuestionPanel } from "@/components/branch/ConsultationQuestionPanel";
import { BranchButton } from "@/components/branch/ui/BranchButton";
import { PageHeader } from "@/components/branch/Common";
import { getConsultationQuestions, getDashboardCopy } from "@/lib/branch/data";
import { getMergedInfraData } from "@/lib/branch/infra/merge-infra-data";
import type { InfraCandidate } from "@/lib/branch/infra/infra-types";

export default function ConsultationPage() {
  const copy = getDashboardCopy().screens.consultation;
  const infra = getMergedInfraData();
  const sections = [
    {
      title: "시공사 상담",
      candidates: infra.constructionAndConsultingCandidates.filter((item) => ["큐플레이스", "숨고"].includes(item.name))
    },
    {
      title: "홍보/디자인 상담",
      candidates: infra.constructionAndConsultingCandidates.filter((item) => ["크몽", "숨고"].includes(item.name))
    },
    {
      title: "POS/결제 상담",
      candidates: infra.posPaymentDeliveryCandidates.filter((item) => ["토스플레이스", "스마트로", "포스뱅크"].includes(item.name))
    },
    {
      title: "배달 상담",
      candidates: infra.posPaymentDeliveryCandidates.filter((item) => ["바로고", "배민외식업광장", "쿠팡이츠 사장님 포털"].includes(item.name))
    },
    {
      title: "인허가 상담",
      candidates: infra.permitLawRefs.filter((item) => ["한국외식업중앙회", "e보건소", "정부24", "국세청 홈택스"].includes(item.name))
    }
  ];
  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <p className="rounded-xl bg-[color:var(--branch-surface-muted)] p-4 text-sm font-bold leading-6 text-[color:var(--branch-ink-muted)]">
        공식 페이지와 공개 목록 기반 후보입니다. 실제 계약 전 업체 견적, 배송·설치비, 부가세, 인허가 조건을 재확인해야 합니다.
      </p>
      <ConsultationCTA />
      <section className="grid gap-5">
        {sections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)]">
            <h2 className="text-xl font-black text-[color:var(--branch-primary)]">{section.title}</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {section.candidates.map((candidate) => <ConsultationCandidateCard key={candidate.id} candidate={candidate} />)}
            </div>
          </article>
        ))}
      </section>
      <Suspense fallback={<div className="rounded-lg bg-white p-5">상담 폼을 준비 중입니다.</div>}>
        <ConsultationLeadForm />
      </Suspense>
      <div id="consultation-questions">
        <ConsultationQuestionPanel categories={getConsultationQuestions()} />
      </div>
      <div className="flex flex-wrap gap-3">
        <BranchButton href="/dashboard/startup/consultation/rfp">원클릭 RFP 만들기</BranchButton>
        <BranchButton href="/dashboard/startup/consultation/status" variant="secondary">상담 현황 보기</BranchButton>
      </div>
    </div>
  );
}

function ConsultationCandidateCard({ candidate }: { candidate: InfraCandidate }) {
  return (
    <div className="rounded-2xl border border-[color:var(--branch-border)] bg-[color:var(--branch-surface-muted)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[color:var(--branch-primary)]">{candidate.name}</h3>
          <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">{candidate.category}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <InfraStatusBadge status={candidate.verificationStatus} />
          <OfficialSourceBadge minimal={candidate.verificationStatus.includes("minimal")} />
          <QuoteRequiredBadge required={candidate.quoteRequired} />
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-[color:var(--branch-ink-muted)]">{candidate.busanFit ?? "부산 적합도 상담 필요"}</p>
      <p className="mt-2 text-xs font-bold text-[color:var(--branch-ink-muted)]">{candidate.useFor.join(" · ")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={candidate.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-xl bg-[color:var(--branch-primary)] px-4 py-2 text-sm font-black text-white">
          공식 페이지 열기
        </a>
        <a href="#consultation-questions" className="inline-flex rounded-xl border border-[color:var(--branch-border)] bg-white px-4 py-2 text-sm font-black text-[color:var(--branch-primary)]">
          상담 질문 템플릿 보기
        </a>
        <a href="/dashboard/startup/timetable" className="inline-flex rounded-xl border border-[color:var(--branch-border)] bg-white px-4 py-2 text-sm font-black text-[color:var(--branch-primary)]">
          내 타임테이블에 추가
        </a>
      </div>
    </div>
  );
}
