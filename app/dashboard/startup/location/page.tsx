import { Badge, PageHeader } from "@/components/branch/Common";
import { LinkedLocationWorkspace } from "@/components/branch/LinkedLocationWorkspace";
import {
  getCategoryRadiusRules,
  getExperienceCategories,
  getFinanceLocationAdjustments,
  getFoodCountsBySido,
  getLocationCandidateRankings,
  getLocationReport,
  getSbiz365ModuleCache,
  getSbiz365ResponseBlueprints,
  getSbiz365Services,
  getStoreCountsBySido
} from "@/lib/branch/location-data";

export default function StartupLocationPage() {
  const report = getLocationReport();
  const categories = getExperienceCategories();
  const radiusRules = getCategoryRadiusRules();
  const services = getSbiz365Services();
  const blueprints = getSbiz365ResponseBlueprints();
  const moduleCache = getSbiz365ModuleCache();
  const rankings = getLocationCandidateRankings();
  const financeAdjustments = getFinanceLocationAdjustments();
  const storeCounts = getStoreCountsBySido();
  const foodCounts = getFoodCountsBySido();

  return (
    <div className="grid gap-5" data-testid="location-page">
      <PageHeader
        title="입지 분석"
        subtitle="소상공인365 공식 화면을 앱 안에 직접 연결하고, 같은 좌표·업종 기준으로 생성한 정규화 캐시를 예비점주용 후보 입지 비교와 손익 시뮬레이터 입력값으로 함께 제공합니다."
        warning="이번 화면은 실제 SBIZ365 iframe과 actual cache를 같이 사용합니다. 후보 입지 점수와 보정값은 2026-06-08 수집분을 기반으로 생성되었습니다."
      />

      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="실제 연동 모듈" value={`${services.length}개`} />
        <Metric label="정규화 캐시" value={`${moduleCache.length}건`} />
        <Metric label="후보 입지 랭킹" value={`${rankings.length}건`} />
        <Metric label="업종 반경 룰" value={`${radiusRules.length}개`} />
      </section>

      <LinkedLocationWorkspace
        categories={categories}
        radiusRules={radiusRules}
        services={services}
        blueprints={blueprints}
        rankings={rankings}
        moduleCache={moduleCache}
        financeAdjustments={financeAdjustments}
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[28px] border border-[#ddd2c0] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-[#164033]">전국 상가 집계</h3>
              <p className="mt-1 text-sm font-bold text-[#655d52]">소진공 상가(상권)정보 원천 파일 집계 결과입니다.</p>
            </div>
            <Badge tone="success">CSV + 업종코드 연동</Badge>
          </div>
          <div className="mt-4 grid gap-2">
            {storeCounts.slice(0, 12).map((row) => {
              const foodCount = foodCounts.find((item) => item.sidoName === row.sidoName)?.count ?? 0;
              return (
                <DensityBar
                  key={row.sidoName}
                  label={row.sidoName}
                  total={row.count}
                  food={foodCount}
                  max={Math.max(...storeCounts.map((item) => item.count))}
                />
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#ddd2c0] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-[#164033]">원천 데이터 규모</h3>
              <p className="mt-1 text-sm font-bold text-[#655d52]">입지 체험용 DB가 실제로 읽고 있는 총량입니다.</p>
            </div>
            <Badge>{report.cacheKeyRule}</Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Metric label="전국 상가 업소" value={formatNumber(report.totalStores)} />
            <Metric label="음식점업 업소" value={formatNumber(report.foodServiceStores)} />
            <Metric label="지역 CSV" value={`${report.storeCsvEntryCount}개`} />
            <Metric label="업종코드" value={`${report.industryCodeCount}개`} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#ddd2c0] bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8176]">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#164033]">{value}</p>
    </div>
  );
}

function DensityBar({ label, total, food, max }: { label: string; total: number; food: number; max: number }) {
  return (
    <div>
      <div className="flex justify-between gap-3 text-sm font-bold text-[#574d42]">
        <span>{label}</span>
        <span>{formatNumber(total)} · 음식 {formatNumber(food)}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-[#eee4d7]">
        <div className="h-2 rounded-full bg-[#164033]" style={{ width: `${Math.max(5, (total / max) * 100)}%` }} />
      </div>
    </div>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}
