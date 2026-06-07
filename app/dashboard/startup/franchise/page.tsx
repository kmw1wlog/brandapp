import { PageHeader } from "@/components/branch/Common";
import { DataQualityBadge } from "@/components/branch/data/DataQualityBadge";
import { DataSourceNote } from "@/components/branch/data/DataSourceNote";
import { SourceFileBadge } from "@/components/branch/data/SourceFileBadge";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { BranchButton } from "@/components/branch/ui/BranchButton";
import { BranchCard } from "@/components/branch/ui/BranchCard";
import { getRealFranchiseBrands, getRealFranchiseCohorts, getRealFranchiseQuality } from "@/lib/branch/real-data";
import { formatKRW, formatRange } from "@/lib/branch/format";

export default function FranchisePage() {
  const brands = getRealFranchiseBrands();
  const cohorts = getRealFranchiseCohorts();
  const quality = getRealFranchiseQuality() as { warningNotes?: string[] };
  const direct = brands.filter((brand) => brand.comparisonGroup === "direct");
  const adjacent = brands.filter((brand) => brand.comparisonGroup === "adjacent");
  const reference = brands.filter((brand) => brand.comparisonGroup === "reference");
  const deop = direct.find((brand) => brand.name === "덮덮밥");

  return (
    <div className="grid gap-5">
      <PageHeader
        title="프랜차이즈 상세 비교"
        subtitle="고기덮밥 직접 비교군과 덮덮밥 대표 사례를 공개정보 기준으로 정리했습니다."
        warning="이 수치는 매출·이익을 보증하지 않으며, null 값은 아직 추가 수집이 필요한 항목입니다."
      />
      <DataSourceNote>고기덮밥 프랜차이즈 직접 비교군 · 7개 브랜드 공개정보 기반</DataSourceNote>

      <section className="grid gap-3">
        <h2 className="text-2xl font-black text-[color:var(--branch-primary)]">직접 비교군 7개</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {direct.map((brand) => (
            <BranchCard key={brand.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black text-[color:var(--branch-primary)]">{brand.name}</h3>
                  <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">{brand.mainMenu.length > 0 ? brand.mainMenu.join(", ") : "정량 메뉴 수집 전"}</p>
                </div>
                <DataQualityBadge status={brand.dataStatus} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Metric label="월평균 매출" value={brand.monthlyAverageSalesText ?? formatKRW(brand.monthlyAverageSales)} />
                <Metric label="가맹점 수" value={brand.franchiseStoreCount?.toLocaleString("ko-KR") ?? "추가 수집 필요"} />
                <Metric label="직영점 수" value={brand.companyStoreCount?.toLocaleString("ko-KR") ?? "추가 수집 필요"} />
                <Metric label="예상 창업비용" value={formatRange(brand.startupCostMin, brand.startupCostMax)} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <SourceFileBadge file={brand.sourceFile} />
                {brand.warningNotes.map((note) => <BranchBadge key={note} tone="warning">{note}</BranchBadge>)}
              </div>
            </BranchCard>
          ))}
        </div>
      </section>

      {deop ? (
        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <BranchCard>
            <h2 className="text-2xl font-black text-[color:var(--branch-primary)]">덮덮밥 대표 사례</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Metric label="월평균 매출" value={deop.monthlyAverageSalesText ?? formatKRW(deop.monthlyAverageSales)} />
              <Metric label="매장 수" value={deop.storeCountTotal?.toLocaleString("ko-KR") ?? "확인 필요"} />
              <Metric label="창업비용 15평 기준" value={formatRange(deop.startupCostMin, deop.startupCostMax)} />
              <Metric label="매장 개설비" value={formatKRW(deop.startupCostMin)} />
              <Metric label="실내공사·인테리어" value={formatKRW(deop.interiorCost)} />
              <Metric label="간판" value={formatKRW(deop.signageCost)} />
              <Metric label="주방설비" value={formatKRW(deop.equipmentCost)} />
              <Metric label="초도비용" value={formatKRW(deop.initialGoodsCost)} />
            </div>
          </BranchCard>
          <BranchCard>
            <h2 className="text-xl font-black text-[color:var(--branch-primary)]">주의 문구</h2>
            <div className="mt-4 grid gap-2">
              {deop.warningNotes.map((note) => <DataSourceNote key={note}>{note}</DataSourceNote>)}
            </div>
          </BranchCard>
        </section>
      ) : null}

      <details className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)]">
        <summary className="cursor-pointer text-lg font-black text-[color:var(--branch-primary)]">돈까스 비교군</summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {adjacent.map((brand) => (
            <BranchCard key={brand.id} className="p-4">
              <p className="font-black text-[color:var(--branch-primary)]">{brand.name}</p>
              <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">접힌 참고 비교군</p>
            </BranchCard>
          ))}
        </div>
      </details>

      <details className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)]">
        <summary className="cursor-pointer text-lg font-black text-[color:var(--branch-primary)]">삼겹살 참고군</summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {reference.map((brand) => (
            <BranchCard key={brand.id} className="p-4">
              <p className="font-black text-[color:var(--branch-primary)]">{brand.name}</p>
              <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">{formatKRW(brand.monthlyAverageSales)} · {brand.mainMenu.join(", ")}</p>
            </BranchCard>
          ))}
        </div>
      </details>

      <DataSourceNote>{quality.warningNotes?.join(" / ") ?? "추가 수집 필요 항목은 null과 경고 배지로 노출됩니다."}</DataSourceNote>
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
