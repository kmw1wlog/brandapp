import { BranchAlert } from "@/components/branch/ui/BranchAlert";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { BranchButton } from "@/components/branch/ui/BranchButton";
import { BranchCard } from "@/components/branch/ui/BranchCard";
import { BranchMetricCard } from "@/components/branch/ui/BranchMetricCard";
import { PageHeader } from "@/components/branch/Common";
import { calculateFranchiseSummary } from "@/lib/branch/calculations";
import { getDefaultBrand, getDefaultFranchise } from "@/lib/branch/data";
import { formatKRW, formatRange, formatScore } from "@/lib/branch/format";

export default function FranchisePage() {
  const franchise = getDefaultFranchise();
  const brand = getDefaultBrand();
  const summary = calculateFranchiseSummary(franchise);

  return (
    <div className="grid gap-5">
      <PageHeader
        title="프랜차이즈 상세 비교"
        subtitle="자가 브랜드안과 계약 전 확인해야 할 프랜차이즈 항목을 같은 기준으로 정리합니다."
        warning="샘플 비교값입니다. 실제 DB 수집 후 교체 예정이며, 계약 전에는 반드시 본사 자료와 정보공개서를 확인해야 합니다."
      />
      <BranchAlert>샘플 비교값 · 실제 DB 수집 후 교체 예정</BranchAlert>
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <BranchCard>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[color:var(--branch-ink-muted)]">프랜차이즈 비교안</p>
              <h2 className="mt-2 text-3xl font-black text-[color:var(--branch-primary)]">{franchise.brand_name}</h2>
              <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">{franchise.category}</p>
            </div>
            <BranchBadge tone="warning">샘플 비교값</BranchBadge>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <BranchMetricCard label="초기자본" value={formatRange(franchise.startup_cost_min, franchise.startup_cost_max)} />
            <BranchMetricCard label="예상 매출" value={formatKRW(summary.monthlySales)} />
            <BranchMetricCard label="점주 예상 순이익" value={formatRange(franchise.expected_monthly_profit_min, franchise.expected_monthly_profit_max)} />
            <BranchMetricCard label="인지도" value={formatScore(Math.round(franchise.confidence_score * 10))} helper="공개정보 신뢰도 기반 샘플" />
          </div>
          <p className="mt-4 rounded-xl bg-[color:var(--branch-surface-muted)] p-3 text-sm leading-6 text-[color:var(--branch-ink-muted)]">{franchise.data_note}</p>
        </BranchCard>
        <BranchCard>
          <h2 className="text-xl font-black text-[color:var(--branch-primary)]">계약 전 확인 항목</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <Row label="가맹비" value={formatKRW(franchise.franchise_fee)} />
            <Row label="교육비" value={formatKRW(franchise.education_fee)} />
            <Row label="인테리어" value={formatKRW(franchise.interior_cost)} />
            <Row label="기타비용" value={formatKRW(franchise.other_cost)} />
            <Row label="공급처 자유도" value="본사 지정 비중 확인 필요" />
            <Row label="메뉴 자유도" value="신메뉴·가격 변경 가능 범위 확인" />
            <Row label="본사 지원" value="오픈 전 교육, 슈퍼바이저 방문, 홍보 지원 조건 확인" />
          </dl>
          <div className="mt-5 rounded-xl border border-[color:var(--branch-border)] p-4">
            <p className="font-black text-[color:var(--branch-primary)]">자가 브랜드 비교 기준</p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--branch-ink-muted)]">{brand.name}는 공급처·메뉴·시공 요구사항을 직접 조정하는 안입니다. 프랜차이즈가 더 적합할 수 있으므로, 이 화면은 상담 질문을 준비하는 용도로만 사용합니다.</p>
          </div>
        </BranchCard>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {["정보공개서의 최근 3년 폐점률 확인", "가맹점 평균 매출 산정 기준 확인", "필수 구매 품목과 가격 조정 조건 확인"].map((item) => (
          <BranchCard key={item} className="text-sm font-bold leading-6 text-[color:var(--branch-ink-muted)]">{item}</BranchCard>
        ))}
      </section>
      <div className="flex flex-wrap gap-3">
        <BranchButton href="/dashboard/startup/cost">메뉴·원가 비교로 이동</BranchButton>
        <BranchButton href="/dashboard/startup/consultation?category=창업%20컨설턴트" variant="secondary">계약 전 질문 상담</BranchButton>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[color:var(--branch-border)] pb-2">
      <dt className="text-[color:var(--branch-ink-muted)]">{label}</dt>
      <dd className="font-black text-[color:var(--branch-ink)]">{value}</dd>
    </div>
  );
}
