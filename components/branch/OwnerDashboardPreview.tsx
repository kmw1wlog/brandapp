"use client";

import { useState } from "react";
import { saveOwnerPreviewInterest, trackEvent } from "@/lib/branch/events";
import { ProfitSimulationChart } from "./ProfitSimulationChart";
import type { ProfitSimulation } from "@/lib/branch/types";
import { BranchDrawer } from "./ui/BranchDrawer";

const features = ["싼 공급처 찾기", "원가 변동 알림", "공동구매 후보", "월매출 입력/업로드", "메뉴별 원가율", "홍보비/식자재비 기록", "점주 의견 남기기"];

export function OwnerDashboardPreview({ simulation, readiness }: { simulation: ProfitSimulation; readiness?: Record<string, unknown> }) {
  const [drawer, setDrawer] = useState<string | undefined>();
  const alerts = Array.isArray(readiness?.alerts) ? (readiness?.alerts as string[]) : [];
  function save() {
    saveOwnerPreviewInterest(true);
    trackEvent("owner_preview_click");
  }
  return (
    <div className="grid gap-5">
      <section className="rounded-lg bg-[#164033] p-6 text-white">
        <h3 className="text-2xl font-black">브랜치로 개점하면 운영 대시보드 3개월 무료</h3>
        <p className="mt-2 text-sm text-white/80">브랜치로 개점한 점주는 운영 대시보드를 3개월 동안 무료로 사용할 수 있습니다.</p>
        <button onClick={save} className="mt-4 rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">점주 전환 예약</button>
      </section>
      {alerts.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {alerts.map((alert) => <div key={alert} className="rounded-lg border border-[#ddd2c0] bg-white p-4 text-sm font-black text-[#164033]">{alert}</div>)}
        </div>
      ) : null}
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
