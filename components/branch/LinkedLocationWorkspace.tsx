"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { Activity, BarChart3, CloudSun, Map, MapPinned, Megaphone, Navigation, Search, Store, TrendingUp, Truck, Users } from "lucide-react";
import { Badge } from "@/components/branch/Common";
import { KakaoLocationMap } from "@/components/branch/KakaoLocationMap";
import type {
  CategoryRadiusRule,
  ExperienceCategory,
  FinanceLocationAdjustment,
  LocationCandidateRanking,
  Sbiz365ModuleCacheRecord,
  Sbiz365ResponseBlueprint,
  Sbiz365Service
} from "@/lib/branch/location-data";

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

type Props = {
  categories: ExperienceCategory[];
  radiusRules: CategoryRadiusRule[];
  services: Sbiz365Service[];
  blueprints: Sbiz365ResponseBlueprint[];
  rankings: LocationCandidateRanking[];
  moduleCache: Sbiz365ModuleCacheRecord[];
  financeAdjustments: FinanceLocationAdjustment[];
};

export function LinkedLocationWorkspace({
  categories,
  radiusRules,
  services,
  blueprints,
  rankings,
  moduleCache,
  financeAdjustments
}: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.category_id ?? "");
  const [selectedServiceId, setSelectedServiceId] = useState("simple");
  const rankedCandidates = useMemo(
    () => rankings.filter((item) => item.category_id === selectedCategoryId).sort((a, b) => b.headline_score - a.headline_score),
    [rankings, selectedCategoryId]
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState(rankedCandidates[0]?.candidate_id ?? "");

  useEffect(() => {
    setSelectedCandidateId(rankedCandidates[0]?.candidate_id ?? "");
  }, [selectedCategoryId, rankedCandidates]);

  const selectedCategory = categories.find((item) => item.category_id === selectedCategoryId) ?? categories[0];
  const selectedRule = radiusRules.find((item) => item.category_id === selectedCategoryId) ?? radiusRules[0];
  const selectedCandidate = rankedCandidates.find((item) => item.candidate_id === selectedCandidateId) ?? rankedCandidates[0];
  const currentModuleRecords = useMemo(
    () =>
      moduleCache.filter(
        (item) => item.categoryId === selectedCategoryId && item.candidateId === selectedCandidate?.candidate_id
      ),
    [moduleCache, selectedCategoryId, selectedCandidate]
  );
  const currentRecordByModule = Object.fromEntries(currentModuleRecords.map((item) => [item.moduleId, item]));
  const activeBlueprint = blueprints.find((item) => item.module_id === selectedServiceId);
  const activeService = services.find((item) => item.id === selectedServiceId) ?? services[0];
  const activeIframeUrl = resolveIframeUrl(
    currentRecordByModule[selectedServiceId],
    activeBlueprint,
    selectedCandidate
  );
  const activeAdjustmentBand = financeAdjustments.filter((item) => item.category_id === selectedCategoryId);

  return (
    <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]" data-testid="location-linked-workspace">
      <aside className="rounded-[28px] bg-[#0c5c43] p-5 text-white shadow-[0_22px_55px_rgba(12,92,67,0.28)]">
        <div className="rounded-2xl bg-white/8 p-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#a8e4c5]">실제 API 연동</p>
          <h3 className="mt-2 text-2xl font-black">입지 분석 콘솔</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-[#d6f1e3]">
            소상공인365 공식 화면을 탭별로 직접 띄우고, 같은 좌표와 업종으로 만든 정규화 캐시를 시뮬레이터 입력값으로 함께 보여줍니다.
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 text-[#164033]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8176]">업종 선택</p>
          <div className="mt-3 grid gap-2" data-testid="location-category-chip-group">
            {categories.map((category) => (
              <button
                key={category.category_id}
                type="button"
                onClick={() => setSelectedCategoryId(category.category_id)}
                className={`rounded-2xl border px-3 py-3 text-left text-sm font-black transition ${
                  selectedCategoryId === category.category_id
                    ? "border-[#0c5c43] bg-[#0c5c43] text-white"
                    : "border-[#ddd2c0] bg-[#f8f2e9] text-[#164033]"
                }`}
              >
                <span className="block">{category.display_name}</span>
                <span className={`mt-1 block text-xs ${selectedCategoryId === category.category_id ? "text-[#c8f4de]" : "text-[#8a8176]"}`}>
                  {category.sdsc_codes[0]?.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedCategory && selectedRule ? (
          <div className="mt-4 rounded-2xl bg-white p-4 text-[#164033]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8176]">권장 반경</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-black">{selectedRule.recommended_radius_meters}m</p>
                <p className="mt-1 text-sm font-bold text-[#655d52]">보조 반경 {selectedRule.secondary_radius_meters}m</p>
              </div>
              <Badge tone="success">{selectedRule.delivery_bias} delivery</Badge>
            </div>
            <p className="mt-3 text-sm font-bold leading-6 text-[#574d42]">{selectedRule.reason}</p>
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl bg-white p-4 text-[#164033]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8176]">추천 입지</p>
          <div className="mt-3 grid gap-2" data-testid="location-candidate-list">
            {rankedCandidates.slice(0, 5).map((candidate, index) => (
              <button
                key={`${candidate.category_id}-${candidate.candidate_id}`}
                type="button"
                onClick={() => setSelectedCandidateId(candidate.candidate_id)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  selectedCandidate?.candidate_id === candidate.candidate_id
                    ? "border-[#0c5c43] bg-[#e7f5ee]"
                    : "border-[#ddd2c0] bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#164033]">{index + 1}. {candidate.summary.split("·")[0]?.trim()}</p>
                    <p className="mt-1 text-xs font-bold text-[#8a8176]">{candidate.recommended_operation_type}</p>
                  </div>
                  <span className="rounded-full bg-[#0c5c43] px-2 py-1 text-xs font-black text-white">{candidate.headline_score}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="grid gap-5">
        <section className="rounded-[28px] border border-[#ddd2c0] bg-white p-5 shadow-[0_20px_48px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8176]">소상공인365 공식 화면</p>
              <h3 className="mt-1 text-2xl font-black text-[#164033]">{selectedCategory?.display_name} 체험용 입지 워크스페이스</h3>
              <p className="mt-1 text-sm font-bold text-[#655d52]">
                {selectedCandidate?.summary ?? "후보 입지를 선택하세요"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success">{activeService?.name}</Badge>
              <Badge>{selectedCandidate?.radius_meters ?? selectedRule?.recommended_radius_meters}m 반경</Badge>
            </div>
          </div>

          <div className="mt-5 grid gap-2 lg:grid-cols-6">
            {services.map((service) => {
              const Icon = serviceIcons[service.id] ?? Activity;
              const currentRecord = currentRecordByModule[service.id];
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`rounded-2xl border px-3 py-3 text-left transition ${
                    selectedServiceId === service.id
                      ? "border-[#0c5c43] bg-[#0c5c43] text-white"
                      : "border-[#ddd2c0] bg-[#faf6f0] text-[#164033]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <span className="text-sm font-black">{service.name}</span>
                  </div>
                  <p className={`mt-2 text-xs font-bold ${selectedServiceId === service.id ? "text-[#d6f1e3]" : "text-[#8a8176]"}`}>
                    {currentRecord?.collection_status === "actual_api_response" ? "actual" : currentRecord ? "linked" : "pending"}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-[24px] border border-[#ddd2c0] bg-[#f6f2eb]">
              <div className="flex items-center justify-between gap-3 border-b border-[#ddd2c0] px-4 py-3">
                <div>
                  <p className="text-sm font-black text-[#164033]">{activeService?.name}</p>
                  <p className="text-xs font-bold text-[#8a8176]">{activeBlueprint?.official_route ?? "official route"}</p>
                </div>
                <Badge tone="success">iframe linked</Badge>
              </div>
              {activeIframeUrl ? (
                <iframe
                  key={activeIframeUrl}
                  src={activeIframeUrl}
                  title={`${activeService?.name} 공식 화면`}
                  className="h-[860px] w-full bg-white"
                  data-testid="sbiz365-iframe"
                />
              ) : (
                <div className="flex h-[860px] items-center justify-center text-sm font-bold text-[#8a8176]">
                  공식 화면 URL을 생성하지 못했습니다.
                </div>
              )}
            </div>

            <div className="grid gap-3">
              <SummaryMetric
                label="월 평균 매출"
                value={`${formatNumber(readNumber(currentRecordByModule.simple?.data?.monthlyAverageSalesThousandKrw))}천원`}
                hint="간단분석 actual"
              />
              <SummaryMetric
                label="동종 업소 수"
                value={`${formatNumber(readNumber(currentRecordByModule.store_status?.data?.sameCategoryStoreCount))}개`}
                hint="업소현황 actual"
              />
              <SummaryMetric
                label="배달 월평균"
                value={`${formatNumber(readNumber(currentRecordByModule.delivery?.data?.averageMonthlyDeliveryCount))}건`}
                hint="배달분석 actual"
              />
              <SummaryMetric
                label="일평균 유동인구"
                value={`${formatNumber(readNumber(currentRecordByModule.theme?.data?.dailyFloatingPopulation))}명`}
                hint="테마상권 actual"
              />
              <div className="rounded-[24px] border border-[#ddd2c0] p-4">
                <p className="text-sm font-black text-[#164033]">시뮬레이터 보정</p>
                <div className="mt-3 grid gap-2">
                  {activeAdjustmentBand.map((item) => (
                    <div key={`${item.category_id}-${item.location_score_band}`} className="rounded-2xl bg-[#faf6f0] px-3 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-[#164033]">{item.location_score_band}</p>
                        <Badge>{item.confidence_label}</Badge>
                      </div>
                      <p className="mt-2 text-xs font-bold text-[#574d42]">
                        일주문 x{item.daily_order_multiplier} · 배달비중 {signedPercent(item.delivery_share_adjustment)} · 임차료 상한 {Math.round(item.rent_guardrail_ratio * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[#ddd2c0] p-4">
                <p className="text-sm font-black text-[#164033]">원본 매핑</p>
                <div className="mt-3 grid gap-2">
                  {Object.entries(activeBlueprint?.field_mapping ?? {}).slice(0, 5).map(([source, target]) => (
                    <div key={source} className="rounded-2xl bg-[#faf6f0] px-3 py-2">
                      <p className="text-xs font-black text-[#8a8176]">{source}</p>
                      <p className="mt-1 text-sm font-black text-[#164033]">{target}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-[#ddd2c0] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xl font-black text-[#164033]">브랜치 후보 지도</h4>
                <p className="mt-1 text-sm font-bold text-[#655d52]">카카오맵 위에 후보 입지 5곳과 현재 권장 반경을 직접 표시합니다.</p>
              </div>
              <Badge tone="success">Kakao Maps</Badge>
            </div>
            <div className="mt-4">
              <KakaoLocationMap
                candidates={rankedCandidates}
                selectedCandidateId={selectedCandidate?.candidate_id}
                radiusMeters={selectedCandidate?.radius_meters ?? selectedRule?.recommended_radius_meters ?? 500}
                onSelectCandidate={setSelectedCandidateId}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-[#ddd2c0] bg-white p-5" data-testid="location-ranking-table">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xl font-black text-[#164033]">후보 입지 랭킹</h4>
                <p className="mt-1 text-sm font-bold text-[#655d52]">상가(상권)정보 + SBIZ365 actual cache를 합친 체험용 우선순위입니다.</p>
              </div>
              <Badge tone="success">{selectedCategory?.display_name}</Badge>
            </div>
            <div className="mt-4 grid gap-2">
              {rankedCandidates.map((candidate) => (
                <div key={`${candidate.category_id}-${candidate.candidate_id}`} className="grid gap-3 rounded-2xl border border-[#eee4d7] p-4 md:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
                  <div>
                    <p className="text-sm font-black text-[#164033]">{candidate.summary}</p>
                    <p className="mt-1 text-xs font-bold text-[#8a8176]">{candidate.recommended_operation_type}</p>
                  </div>
                  <ScoreCell label="헤드라인" value={candidate.headline_score} />
                  <ScoreCell label="매출" value={candidate.sales_score} />
                  <ScoreCell label="경쟁" value={candidate.competition_score} />
                  <ScoreCell label="배달" value={candidate.delivery_score} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#ddd2c0] bg-white p-5">
            <h4 className="text-xl font-black text-[#164033]">업종 운영 힌트</h4>
            {selectedCategory ? (
              <div className="mt-4 grid gap-3">
                <InfoBlock label="대표 메뉴군" value={selectedCategory.representative_menu_groups.join(" · ")} />
                <InfoBlock label="운영 형태" value={selectedCategory.operation_formats.join(" / ")} />
                <InfoBlock label="객단가 밴드" value={`${formatNumber(selectedCategory.average_ticket_band[0])}~${formatNumber(selectedCategory.average_ticket_band[1])}원`} />
                <InfoBlock label="원가율 밴드" value={`${Math.round(selectedCategory.food_cost_rate_band[0] * 100)}~${Math.round(selectedCategory.food_cost_rate_band[1] * 100)}%`} />
                <InfoBlock label="소진공 업종코드" value={selectedCategory.sdsc_codes.map((item) => item.small).join(", ")} />
                <InfoBlock label="원본 엔드포인트" value={(activeBlueprint?.discovered_endpoints ?? []).join(", ") || "공식 iframe linked"} />
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}

function SummaryMetric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[24px] border border-[#ddd2c0] p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8176]">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#164033]">{value}</p>
      <p className="mt-1 text-xs font-bold text-[#8a8176]">{hint}</p>
    </div>
  );
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#faf6f0] px-3 py-3 text-center">
      <p className="text-xs font-black text-[#8a8176]">{label}</p>
      <p className="mt-1 text-xl font-black text-[#164033]">{value}</p>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#eee4d7] px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8176]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#164033]">{value}</p>
    </div>
  );
}

function resolveIframeUrl(
  record: Sbiz365ModuleCacheRecord | undefined,
  blueprint: Sbiz365ResponseBlueprint | undefined,
  candidate: LocationCandidateRanking | undefined
) {
  const recordUrl = readString(record?.data?.officialIframeUrl);
  if (recordUrl) return recordUrl;
  if (!blueprint || !candidate) return null;
  const dongLabel = record?.candidateLabel ?? String(blueprint.query_params_example.dong ?? "");
  return blueprint.iframe_url_template
    .replace("%7Blat%7D", String(candidate.latitude))
    .replace("%7Blng%7D", String(candidate.longitude))
    .replace("%7Bdong%7D", encodeURIComponent(dongLabel));
}

function readNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function readString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

function signedPercent(value: number) {
  const percent = Math.round(value * 100);
  if (percent > 0) return `+${percent}%p`;
  if (percent < 0) return `${percent}%p`;
  return "0%p";
}
