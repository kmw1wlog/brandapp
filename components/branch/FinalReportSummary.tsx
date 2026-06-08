"use client";

import { useEffect, useState } from "react";
import { getDefaultFranchise, getGroupbuyCandidates, getSupplierCandidates } from "@/lib/branch/data";
import { buildExperienceSimulation, type ExperienceSimulation } from "@/lib/branch/experience-data";
import { trackEvent } from "@/lib/branch/events";
import { formatKRW } from "@/lib/branch/format";
import { readFinanceSelection, readStartupInput } from "@/lib/branch/storage/startup-flow-storage";
import { readSelectedLocation, type SelectedLocationState } from "@/lib/branch/storage/experience-state-storage";
import type { SavedFinanceSelection } from "@/lib/branch/storage/startup-flow-storage";

export function FinalReportSummary() {
  const franchise = getDefaultFranchise();
  const suppliers = getSupplierCandidates().slice(0, 5);
  const groupbuys = getGroupbuyCandidates();
  const [simulation, setSimulation] = useState<ExperienceSimulation>(() => buildExperienceSimulation(readStartupInput()));
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocationState | null>(null);
  const [finance, setFinance] = useState<SavedFinanceSelection | null>(null);

  useEffect(() => {
    const input = readStartupInput();
    setSimulation(buildExperienceSimulation(input));
    setSelectedLocation(readSelectedLocation());
    setFinance(readFinanceSelection());
  }, []);

  const firstMenu = simulation.menus[0];

  function saveReport() {
    trackEvent("report_save_click");
    window.print();
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <h3 className="text-xl font-black text-[#164033]">최종 창업 리포트 요약</h3>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <Item label="입력 조건" value={`${simulation.locationProfile.administrativeDistrict}, ${simulation.category.display_name}`} />
          <Item label="가상 브랜드" value={`${simulation.virtualBrand.name} · ${simulation.virtualBrand.tagline}`} />
          <Item label="선택 입지" value={selectedLocation ? `${selectedLocation.summary} · 점수 ${selectedLocation.headlineScore}` : "입지 후보 선택 전"} />
          <Item label="프랜차이즈 비교" value={`${franchise.brand_name} · ${franchise.data_note}`} />
          <Item label="대표 메뉴 원가" value={firstMenu ? `${firstMenu.menu_name} · 가격 ${formatKRW(firstMenu.recommended_price_band_krw[0])}~${formatKRW(firstMenu.recommended_price_band_krw[1])}` : "대표 메뉴 구성 전"} />
          <Item label="4개월 회계" value={finance ? `목표 일주문 ${finance.targetDailyOrders}건 · 4개월 후 현금 ${formatKRW(finance.endingCash)}` : "회계 시뮬레이션 저장 전"} />
          <Item label="원가방어안" value="공급처 변경, 원산지 변경, 세트 구성, 공동구매 참여" />
          <Item label="공급처 후보" value={suppliers.map((supplier) => supplier.name).join(", ")} />
          <Item label="공동구매 후보" value={groupbuys.map((item) => item.item_name).join(", ")} />
          <Item label="상담 대기 상태" value="상담사 입점 시 연락받기 가능" />
          <Item label="점주 혜택" value="개점 후 운영 대시보드 3개월 무료 미리보기" />
        </dl>
      </section>
      <div className="flex flex-wrap gap-3">
        <button onClick={saveReport} className="rounded-lg bg-[#164033] px-4 py-3 text-sm font-black text-white">PDF 저장</button>
        <button className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">카카오톡 공유</button>
        <button className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">무료 피드백 신청</button>
        <a href="/dashboard/startup/consultation" className="rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">상담사 입점 시 연락받기</a>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-black text-[#164033]">{label}</dt><dd className="mt-1 leading-6 text-[#655d52]">{value}</dd></div>;
}
