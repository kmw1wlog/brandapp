"use client";

import { saveOwnerPreviewInterest, trackEvent } from "@/lib/branch/events";
import { ProfitSimulationChart } from "./ProfitSimulationChart";
import type { ProfitSimulation } from "@/lib/branch/types";

const features = ["싼 공급처 찾기", "원가 변동 알림", "공동구매 후보", "월매출 입력/업로드", "메뉴별 원가율", "홍보비/식자재비 기록", "점주 의견 남기기"];

export function OwnerDashboardPreview({ simulation }: { simulation: ProfitSimulation }) {
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
      <div className="grid gap-3 md:grid-cols-3">
        {features.map((feature) => <div key={feature} className="rounded-lg border border-[#ddd2c0] bg-white p-4"><span className="rounded-md bg-[#fff0cf] px-2 py-1 text-xs font-bold text-[#805412]">체험용 미리보기</span><p className="mt-3 font-black text-[#164033]">{feature}</p></div>)}
      </div>
      <ProfitSimulationChart simulation={simulation} />
    </div>
  );
}
