import Link from "next/link";
import type { ComponentType } from "react";
import { Activity, BarChart3, CloudSun, ExternalLink, Map, MapPinned, Megaphone, Navigation, Search, Store, TrendingUp, Truck, Users } from "lucide-react";
import { Badge, PageHeader } from "@/components/branch/Common";
import { getFoodCountsBySido, getFoodIndustryCodes, getLocationProfiles, getLocationReport, getSbiz365Services, getSdsc2Endpoints, getStoreCountsBySido, type LocationProfile, type Sbiz365Service } from "@/lib/branch/location-data";

const serviceIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  sns: Megaphone,
  theme: Map,
  weather: CloudSun,
  sales_trend: TrendingUp,
  store_status: Store,
  business_age: Users,
  map: MapPinned,
  detail: BarChart3,
  delivery: Truck,
  tour: Navigation,
  simple: Search
};

export default function StartupLocationPage() {
  const report = getLocationReport();
  const profiles = getLocationProfiles();
  const selectedProfile = profiles[0];
  const services = getSbiz365Services();
  const endpoints = getSdsc2Endpoints();
  const storeCounts = getStoreCountsBySido();
  const foodCounts = getFoodCountsBySido();
  const foodCodes = getFoodIndustryCodes();

  return (
    <div className="grid gap-5" data-testid="location-page">
      <PageHeader
        title="입지 분석"
        subtitle="소진공 상가 상권정보 원천 파일을 전국 단위로 집계하고, 사용자가 입력한 좌표·반경·업종 기준으로 캐시되는 입지 프로파일을 보여줍니다."
        warning="소상공인365 11개 화면은 체험용 UI 패널과 공식 URL 연결을 병행합니다. 실제 운영에서는 좌표 입력 시 on-demand 조회 후 같은 cacheKey로 저장합니다."
      />

      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="전국 상가 업소" value={formatNumber(report.totalStores)} />
        <Metric label="음식점업 업소" value={formatNumber(report.foodServiceStores)} />
        <Metric label="지역 CSV" value={`${report.storeCsvEntryCount}개`} />
        <Metric label="업종코드" value={`${report.industryCodeCount}개`} />
      </section>

      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#164033]">on-demand 입지 프로파일 캐시</h3>
            <p className="mt-1 text-sm font-bold text-[#655d52]">저장 단위: {report.cacheKeyRule}</p>
          </div>
          <Badge tone="success">소진공 2026.03 기준</Badge>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <ProfilePanel profile={selectedProfile} />
          <div className="grid gap-3">
            <SignalBox title="유리 신호" items={selectedProfile.advantageSignals} tone="success" />
            <SignalBox title="주의 신호" items={selectedProfile.cautionSignals} tone="warning" />
            <div className="rounded-lg border border-[#ddd2c0] p-4">
              <p className="text-sm font-black text-[#164033]">시뮬레이터 연결값</p>
              <div className="mt-3 grid gap-2 text-sm font-bold text-[#574d42]">
                <Row label="매출 추이 지수" value={`${selectedProfile.salesTrend.estimatedTrendIndex}`} />
                <Row label="배달 적합도" value={selectedProfile.deliveryAnalysis.estimatedDeliveryFit} />
                <Row label="배달 경쟁" value={selectedProfile.deliveryAnalysis.deliveryCompetitionLevel} />
                <Row label="업력 안정성" value={selectedProfile.businessAgeDistribution.inferredStability} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#164033]">소상공인365 분석 모듈 11개</h3>
            <p className="mt-1 text-sm font-bold text-[#655d52]">공식 UI URL과 체험용 분석 카드가 같은 데이터 프로파일을 참조합니다.</p>
          </div>
          <Badge>2026-09-30까지 사용</Badge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} profile={selectedProfile} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-[#ddd2c0] bg-white p-5">
          <h3 className="text-xl font-black text-[#164033]">시도별 상가 집계</h3>
          <div className="mt-4 grid gap-2">
            {storeCounts.slice(0, 17).map((row) => {
              const food = foodCounts.find((item) => item.sidoName === row.sidoName)?.count ?? 0;
              return <DensityBar key={row.sidoName} label={row.sidoName} value={row.count} subValue={food} max={Math.max(...storeCounts.map((item) => item.count))} />;
            })}
          </div>
        </div>
        <div className="rounded-lg border border-[#ddd2c0] bg-white p-5">
          <h3 className="text-xl font-black text-[#164033]">상가 상권정보 REST API 19개</h3>
          <p className="mt-1 text-sm font-bold text-[#655d52]">입지 프로파일 생성에 쓰는 원천 endpoint 목록입니다.</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {endpoints.map((endpoint) => (
              <div key={endpoint.id} className="rounded-lg border border-[#eee4d7] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-[#164033]">{endpoint.name}</p>
                    <p className="mt-1 text-xs font-bold text-[#8a8176]">{endpoint.path}</p>
                  </div>
                  <Activity size={16} className="mt-1 text-[#b8642f]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <h3 className="text-xl font-black text-[#164033]">요식업 업종코드 샘플</h3>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {foodCodes.slice(0, 18).map((code) => (
            <div key={code.smallCode} className="rounded-lg border border-[#eee4d7] p-3">
              <p className="text-sm font-black text-[#164033]">{code.smallName}</p>
              <p className="mt-1 text-xs font-bold text-[#8a8176]">{code.middleName} · {code.smallCode}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#ddd2c0] bg-white p-4">
      <p className="text-xs font-black text-[#8a8176]">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#164033]">{value}</p>
    </div>
  );
}

function ProfilePanel({ profile }: { profile: LocationProfile }) {
  return (
    <div className="rounded-lg border border-[#ddd2c0] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#b8642f]">{profile.request.category.smallCode}</p>
          <h4 className="mt-1 text-2xl font-black text-[#164033]">{profile.request.label}</h4>
          <p className="mt-1 text-sm font-bold text-[#655d52]">{profile.administrativeDistrict}</p>
        </div>
        <Badge>{profile.request.radiusMeters}m</Badge>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="반경 전체 업소" value={formatNumber(profile.metrics.totalStoresInRadius)} />
        <Metric label="음식점업" value={formatNumber(profile.metrics.sameLargeStoresInRadius)} />
        <Metric label="동일 소분류" value={formatNumber(profile.metrics.sameSmallStoresInRadius)} />
      </div>
      <div className="mt-4 rounded-lg bg-[#f7f1e8] p-3 text-xs font-bold text-[#574d42]">
        cacheKey: {profile.cacheKey}
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {profile.topSmallCategories.slice(0, 8).map((item) => (
          <Row key={item.name} label={item.name} value={`${item.count}개`} />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ service, profile }: { service: Sbiz365Service; profile: LocationProfile }) {
  const Icon = serviceIcons[service.id] ?? BarChart3;
  const value = serviceValue(service.id, profile);
  return (
    <div className="rounded-lg border border-[#ddd2c0] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="rounded-lg bg-[#164033] p-2 text-white"><Icon size={18} /></span>
          <div>
            <p className="font-black text-[#164033]">{service.name}</p>
            <p className="mt-1 text-xs font-bold text-[#8a8176]">/{service.route}</p>
          </div>
        </div>
        <Link href={service.url} target="_blank" className="rounded-lg border border-[#ddd2c0] p-2 text-[#574d42]" aria-label={`${service.name} 공식 화면 열기`}>
          <ExternalLink size={16} />
        </Link>
      </div>
      <p className="mt-4 text-2xl font-black text-[#b8642f]">{value}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#574d42]">{service.appUsage}</p>
    </div>
  );
}

function SignalBox({ title, items, tone }: { title: string; items: string[]; tone: "success" | "warning" }) {
  const className = tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900";
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <p className="font-black">{title}</p>
      <div className="mt-3 grid gap-2 text-sm font-bold">
        {items.map((item) => <p key={item}>{item}</p>)}
      </div>
    </div>
  );
}

function DensityBar({ label, value, subValue, max }: { label: string; value: number; subValue: number; max: number }) {
  return (
    <div>
      <div className="flex justify-between gap-3 text-sm font-bold text-[#574d42]">
        <span>{label}</span>
        <span>{formatNumber(value)} · 음식 {formatNumber(subValue)}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-[#eee4d7]">
        <div className="h-2 rounded-full bg-[#164033]" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#eee4d7] px-3 py-2 text-sm font-bold">
      <span className="text-[#655d52]">{label}</span>
      <span className="text-[#164033]">{value}</span>
    </div>
  );
}

function serviceValue(serviceId: string, profile: LocationProfile) {
  const values: Record<string, string> = {
    sns: profile.snsKeywords.keywords.join(" · "),
    theme: `${profile.metrics.totalStoreDensityPerKm2}/km²`,
    weather: profile.cautionSignals.length > 1 ? "주의" : "양호",
    sales_trend: `${profile.salesTrend.estimatedTrendIndex}`,
    store_status: `${profile.metrics.sameSmallStoresInRadius}개`,
    business_age: profile.businessAgeDistribution.inferredStability,
    map: profile.administrativeDistrict,
    detail: `${profile.advantageSignals.length}/${profile.cautionSignals.length}`,
    delivery: profile.deliveryAnalysis.estimatedDeliveryFit,
    tour: "학기 시즌 확인",
    simple: `${profile.metrics.sameSmallStoreDensityPerKm2}/km²`
  };
  return values[serviceId] ?? "연동 예정";
}

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}
