"use client";

import { getDefaultBrand, getDefaultFranchise, getGroupbuyCandidates, getMenuCosts, getScenario, getSupplierCandidates } from "@/lib/branch/data";
import { trackEvent } from "@/lib/branch/events";
import { formatKRW } from "@/lib/branch/format";

export function FinalReportSummary() {
  const scenario = getScenario();
  const brand = getDefaultBrand();
  const franchise = getDefaultFranchise();
  const menu = getMenuCosts()[0];
  const suppliers = getSupplierCandidates().slice(0, 5);
  const groupbuys = getGroupbuyCandidates();

  function saveReport() {
    trackEvent("report_save_click");
    window.print();
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <h3 className="text-xl font-black text-[#164033]">최종 창업 리포트 요약</h3>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <Item label="입력 조건" value={`${scenario.region.display_name}, ${formatKRW(scenario.capital)}, ${scenario.category}`} />
          <Item label="선택 브랜드" value={`${brand.name} · ${brand.slogan}`} />
          <Item label="프랜차이즈 비교" value={`${franchise.brand_name} · ${franchise.data_note}`} />
          <Item label="대표 메뉴 원가" value={`${menu.name} · 식재료비 ${formatKRW(menu.food_cost)} · 배달 마진 ${formatKRW(menu.delivery_margin)}`} />
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
