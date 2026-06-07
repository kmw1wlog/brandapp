"use client";

import { useEffect, useState } from "react";
import { saveOwnerPreviewInterest, trackEvent } from "@/lib/branch/events";
import type { InfraMergedData } from "@/lib/branch/infra/infra-types";
import { ProfitSimulationChart } from "./ProfitSimulationChart";
import type { ProfitSimulation } from "@/lib/branch/types";
import { BranchDrawer } from "./ui/BranchDrawer";
import { readOwnerConversion } from "@/lib/branch/storage/startup-flow-storage";

const features = ["싼 공급처 찾기", "원가 변동 알림", "공동구매 후보", "월매출 입력/업로드", "메뉴별 원가율", "홍보비/식자재비 기록", "점주 의견 남기기"];

export function OwnerDashboardPreview({ simulation, readiness, infra }: { simulation: ProfitSimulation; readiness?: Record<string, unknown>; infra: InfraMergedData }) {
  const [drawer, setDrawer] = useState<string | undefined>();
  const [accountStage, setAccountStage] = useState("pre_owner");
  const alerts = Array.isArray(readiness?.alerts) ? (readiness?.alerts as string[]) : [];
  const wage = infra.operatingCostRefs.find((item) => item.id === "labor_minimum_wage_2026" || item.id === "cost_labor_2026_minimum_wage");
  const posCandidates = infra.posPaymentDeliveryCandidates.filter((item) => ["토스플레이스", "스마트로", "포스뱅크"].includes(item.name));
  const deliveryAgency = infra.posPaymentDeliveryCandidates.filter((item) => item.name === "바로고");
  const deliveryApps = infra.posPaymentDeliveryCandidates.filter((item) => ["배민외식업광장", "쿠팡이츠 사장님 포털"].includes(item.name));
  function save() {
    saveOwnerPreviewInterest(true);
    trackEvent("owner_preview_click");
  }

  useEffect(() => {
    setAccountStage(readOwnerConversion().accountStage);
  }, []);

  const plannedSales = simulation.months[3]?.own_brand_sales ?? 24_000_000;
  const sampleActualSales = Math.round(plannedSales * 0.92);
  const plannedFoodCostRate = 32;
  const sampleActualFoodCostRate = 35;
  return (
    <div className="grid gap-5">
      <section className="rounded-lg bg-[#164033] p-6 text-white">
        <h3 className="text-2xl font-black">브랜치로 개점하면 운영 대시보드 3개월 무료</h3>
        <p className="mt-2 text-sm text-white/80">브랜치로 개점한 점주는 운영 대시보드를 3개월 동안 무료로 사용할 수 있습니다. 현재 계정 상태: {accountStage}</p>
        <button onClick={save} className="mt-4 rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">점주 전환 예약</button>
      </section>
      <div className="grid gap-4 lg:grid-cols-3">
        <PreviewMetric title="계획 매출 vs 샘플 실제 매출" planned={`${plannedSales.toLocaleString("ko-KR")}원`} actual={`${sampleActualSales.toLocaleString("ko-KR")}원`} />
        <PreviewMetric title="예상 원가율 vs 샘플 실제 원가율" planned={`${plannedFoodCostRate}%`} actual={`${sampleActualFoodCostRate}%`} />
        <PreviewMetric title="월말 현금잔고" planned={`${(simulation.months[3]?.own_brand_owner_profit ?? 4_000_000).toLocaleString("ko-KR")}원`} actual="샘플 실제값 입력 대기" />
        <PreviewMetric title="이번 달 식재료비" planned="식재료비 기록" actual="샘플 780만원" />
        <PreviewMetric title="이번 달 인건비" planned="인건비 기록" actual="샘플 216만원" />
        <PreviewMetric title="배달앱 수수료" planned="배달앱 수수료" actual="샘플 132만원" />
      </div>
      {alerts.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {alerts.map((alert) => <div key={alert} className="rounded-lg border border-[#ddd2c0] bg-white p-4 text-sm font-black text-[#164033]">{alert}</div>)}
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
          <h3 className="text-lg font-black text-[#164033]">POS/결제 후보</h3>
          <div className="mt-4 grid gap-2 text-sm font-bold text-[#655d52]">
            {posCandidates.map((item) => <a key={item.id} href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">{item.name}</a>)}
          </div>
        </section>
        <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
          <h3 className="text-lg font-black text-[#164033]">배달대행 후보</h3>
          <div className="mt-4 grid gap-2 text-sm font-bold text-[#655d52]">
            {deliveryAgency.map((item) => <a key={item.id} href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">{item.name}</a>)}
          </div>
        </section>
        <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
          <h3 className="text-lg font-black text-[#164033]">배달앱 입점 후보</h3>
          <div className="mt-4 grid gap-2 text-sm font-bold text-[#655d52]">
            {deliveryApps.map((item) => <a key={item.id} href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">{item.name}</a>)}
          </div>
        </section>
        <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
          <h3 className="text-lg font-black text-[#164033]">인건비 기준</h3>
          <div className="mt-4 grid gap-2 text-sm font-bold text-[#655d52]">
            <p>{wage?.name ?? "2026 최저임금"} {wage?.value?.toLocaleString("ko-KR") ?? "10,320"}원/h</p>
            <p>월 209시간 기준 {(wage?.monthly209hKrw ?? 2_156_880).toLocaleString("ko-KR")}원</p>
            <p>평일 3시간 × 22일 × 10,320원 = 681,120원</p>
            <p>주휴수당·4대보험은 별도 가정으로 확인</p>
          </div>
        </section>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {features.map((feature) => (
          <button key={feature} type="button" onClick={() => setDrawer(feature)} className="rounded-lg border border-[#ddd2c0] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg">
            <span className="rounded-md bg-[#fff0cf] px-2 py-1 text-xs font-bold text-[#805412]">체험용 미리보기</span>
            <p className="mt-3 font-black text-[#164033]">{feature}</p>
            <p className="mt-2 text-xs font-bold text-[#655d52]">개점 후 사용 가능</p>
          </button>
        ))}
      </div>
      <ProfitSimulationChart simulation={simulation} />
      <BranchDrawer open={Boolean(drawer)} title={drawer ?? "점주 기능"} onClose={() => setDrawer(undefined)}>
        <div className="grid gap-4">
          <p className="rounded-xl bg-[color:var(--branch-surface-muted)] p-3 text-sm font-black text-[color:var(--branch-ink-muted)]">개점 후 사용 가능</p>
          <div className="h-32 rounded-xl border border-[color:var(--branch-border)] bg-white p-4">
            <div className="h-full rounded-lg bg-[color:var(--branch-surface-muted)]">
              <div className="h-full w-2/3 rounded-lg bg-[color:var(--branch-primary)]" />
            </div>
          </div>
          <p className="text-sm leading-6 text-[color:var(--branch-ink-muted)]">샘플 그래프와 상태만 표시합니다. 실제 운영 데이터 입력, POS 연동, 정산 기능은 이번 데모 범위가 아닙니다.</p>
          <button type="button" onClick={save} className="rounded-xl bg-[color:var(--branch-accent)] px-4 py-3 text-sm font-black text-white">점주 전환 관심 저장</button>
        </div>
      </BranchDrawer>
    </div>
  );
}

function PreviewMetric({ title, planned, actual }: { title: string; planned: string; actual: string }) {
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-4">
      <h3 className="text-sm font-black text-[#164033]">{title}</h3>
      <p className="mt-3 text-sm font-bold text-[#655d52]">계획값: {planned}</p>
      <p className="mt-1 text-sm font-bold text-[#655d52]">샘플 실제값: {actual}</p>
    </section>
  );
}
