"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/branch/Common";
import { DataSourceNote } from "@/components/branch/data/DataSourceNote";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { BranchButton } from "@/components/branch/ui/BranchButton";
import { BranchCard } from "@/components/branch/ui/BranchCard";
import { buildExperienceSimulation, type ExperienceSimulation } from "@/lib/branch/experience-data";
import { formatKRW } from "@/lib/branch/format";
import { getRealFranchiseBrands, getRealFranchiseQuality, getResolvedFranchiseExamples } from "@/lib/branch/real-data";
import { readStartupInput } from "@/lib/branch/storage/startup-flow-storage";

export default function FranchisePage() {
  const [simulation, setSimulation] = useState<ExperienceSimulation>(() => buildExperienceSimulation(readStartupInput()));

  useEffect(() => {
    setSimulation(buildExperienceSimulation(readStartupInput()));
  }, []);

  const examples = getResolvedFranchiseExamples(simulation.category.category_id);
  const quality = getRealFranchiseQuality() as { warningNotes?: string[] };
  const legacyBrands = getRealFranchiseBrands();
  const benchmark = simulation.benchmark;

  return (
    <div className="grid gap-5">
      <PageHeader
        title="프랜차이즈 비교"
        subtitle="개별 브랜드 카탈로그가 아니라, 현재 업종 평균과 자가 브랜드안을 먼저 비교합니다."
        warning="브랜드별 상세 매출과 수익은 다음 수집 단계에서 보강합니다. 현재 예시 브랜드는 공개 페이지 URL 확인용입니다."
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <BranchCard>
          <p className="text-xs font-black uppercase text-[#b8642f]">업종 평균 우선</p>
          <h2 className="mt-2 text-3xl font-black text-[color:var(--branch-primary)]">{simulation.category.display_name}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-[color:var(--branch-ink-muted)]">
            공정위 가맹정보 기준 {benchmark.source_year}년 표본 {benchmark.sample_size}개로 만든 업종 평균입니다.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric label="월매출 중앙값" value={formatKRW(benchmark.monthly_sales_krw.median)} />
            <Metric label="창업비용 중앙값" value={formatKRW(benchmark.startup_cost_krw.median)} />
            <Metric label="가맹점 수 중앙값" value={`${benchmark.store_count.median?.toLocaleString("ko-KR") ?? "확인 필요"}개`} />
            <Metric label="폐점 유사율" value={`${Math.round(benchmark.open_close.closure_like_rate_by_store * 100)}%`} />
          </div>
        </BranchCard>

        <BranchCard>
          <p className="text-xs font-black uppercase text-[#b8642f]">내 브랜드안</p>
          <h2 className="mt-2 text-3xl font-black text-[color:var(--branch-primary)]">{simulation.virtualBrand.name}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-[color:var(--branch-ink-muted)]">{simulation.virtualBrand.tagline}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric label="예상 월매출" value={formatKRW(simulation.results.monthlySales)} />
            <Metric label="예상 점주 수익" value={formatKRW(simulation.results.estimatedOwnerProfit)} />
            <Metric label="일 주문" value={`${simulation.results.adjustedDailyOrders}건`} />
            <Metric label="입지 점수" value={`${Math.round(simulation.results.locationScore * 100)}점`} />
          </div>
        </BranchCard>
      </section>

      <details className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)]" data-testid="resolved-brand-examples">
        <summary className="cursor-pointer text-lg font-black text-[color:var(--branch-primary)]">예시 브랜드 4개 보기</summary>
        <p className="mt-3 text-sm font-bold text-[color:var(--branch-ink-muted)]">
          이 목록은 업종 평균의 근거를 보조하는 URL 목록입니다. 상세 매출/수익은 추후 브랜드별 수집값으로 교체합니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {examples.map((brand) => (
            <a key={`${brand.source_category_id}-${brand.brand_name}`} href={brand.resolved_url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[color:var(--branch-border)] p-4">
              <p className="font-black text-[color:var(--branch-primary)]">{brand.brand_name}</p>
              <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">{brand.source_category_name}</p>
            </a>
          ))}
        </div>
      </details>

      <details className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)]">
        <summary className="cursor-pointer text-lg font-black text-[color:var(--branch-primary)]">기존 고기덮밥 수집 상세 보관함</summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {legacyBrands.slice(0, 7).map((brand) => (
            <div key={brand.id} className="rounded-xl border border-[color:var(--branch-border)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-black text-[color:var(--branch-primary)]">{brand.name}</p>
                <BranchBadge tone={brand.confidenceScore < 0.8 ? "warning" : "success"}>{brand.confidenceScore < 0.8 ? "추가 수집" : "공개정보"}</BranchBadge>
              </div>
              <p className="mt-2 text-sm text-[color:var(--branch-ink-muted)]">{formatKRW(brand.monthlyAverageSales)} · {formatKRW(brand.startupCostMin)}</p>
            </div>
          ))}
        </div>
      </details>

      <DataSourceNote>{quality.warningNotes?.join(" / ") ?? "브랜드 상세값은 출처와 누락 상태를 함께 표시합니다."}</DataSourceNote>
      <div className="flex flex-wrap gap-3">
        <BranchButton href="/dashboard/startup/cost">원가 비교 보기</BranchButton>
        <BranchButton href="/dashboard/startup/consultation?category=창업%20컨설턴트" variant="secondary">계약 전 질문 상담</BranchButton>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--branch-border)] p-3">
      <p className="text-xs font-bold text-[color:var(--branch-ink-muted)]">{label}</p>
      <p className="mt-1 font-black text-[color:var(--branch-primary)]">{value}</p>
    </div>
  );
}
