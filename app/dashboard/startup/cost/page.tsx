"use client";

import Link from "next/link";
import { Download, RefreshCw, Star } from "lucide-react";
import { ConceptImage, formatKrw, useDemoExperience } from "@/components/branch/DemoExperience";

export default function CostPage() {
  const { simulation } = useDemoExperience();
  const menus = simulation.menus.slice(0, 4);
  const selectedMenu = menus[0];
  const selectedImage = simulation.imageTemplates[0]?.image_path ?? "/branch/image_template/categories/rice_bowl/rice_bowl_01.jpg";

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-[#e4dacb] bg-white p-6 shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
        <div>
          <p className="text-sm font-black text-[#0f7b54]">메뉴 개발 · 메뉴 개발 및 원가 분석</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-[#171717]">이 브랜드에서 팔 메뉴를 AI가 먼저 계산했습니다.</h2>
          <p className="mt-3 text-sm font-bold text-[#6a6258]">판매가, 목표 원가율, 난이도, 배달 적합도까지 한눈에 비교합니다.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#e4dacb] bg-white px-4 py-3 text-sm font-black text-[#4a2a18]"><RefreshCw size={16} /> 메뉴 후보 재생성</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#073d2d] px-4 py-3 text-sm font-black text-white"><Download size={16} /> 분석 리포트 다운로드</button>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-4">
        {menus.map((menu, index) => {
          const image = simulation.imageTemplates[index]?.image_path ?? selectedImage;
          const price = Math.round((menu.recommended_price_band_krw[0] + menu.recommended_price_band_krw[1]) / 2);
          const foodRate = Math.round(((menu.ingredient_cost_rate_band[0] + menu.ingredient_cost_rate_band[1]) / 2) * 100);
          const margin = Math.round(((menu.margin_rate_band[0] + menu.margin_rate_band[1]) / 2) * 100);
          return (
            <article key={`${menu.menu_group}-${menu.menu_name}`} className="overflow-hidden rounded-[26px] border border-[#e4dacb] bg-white shadow-[0_18px_45px_rgba(61,45,27,0.06)]">
              <div className="relative">
                <img src={image} alt={menu.menu_name} className="h-56 w-full object-cover" />
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#073d2d] text-sm font-black text-white">{index + 1}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black text-[#171717]">{menu.menu_name}</h3>
                  <p className="text-xl font-black text-[#0f7b54]">{formatKrw(price)}</p>
                </div>
                <dl className="mt-5 grid gap-3 text-sm font-bold text-[#6a6258]">
                  <Row label="목표 원가율" value={`${foodRate}%`} />
                  <Row label="포장 원가" value={formatKrw(menu.packaging_cost_krw)} />
                  <Row label="배달 적합도" value={menu.delivery_fit} />
                  <Row label="난이도" value={menu.labor_difficulty} />
                </dl>
                <p className="mt-4 rounded-xl bg-[#eef7f1] px-4 py-3 text-sm font-black text-[#0f7b54]">마진 요약 {margin}%</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[28px] border border-[#e4dacb] bg-white p-6">
          <h3 className="text-xl font-black text-[#171717]">{selectedMenu?.menu_name ?? "대표 메뉴"} 상세 원가 분석</h3>
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <ConceptImage src={selectedImage} alt="대표 메뉴" />
            <div className="overflow-hidden rounded-2xl border border-[#eadfce]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fffaf3] text-[#6a6258]">
                  <tr><th className="p-3">항목</th><th className="p-3">기준값</th><th className="p-3">메모</th></tr>
                </thead>
                <tbody className="font-bold text-[#2b1e16]">
                  <tr className="border-t border-[#eadfce]"><td className="p-3">권장 판매가</td><td className="p-3">{selectedMenu ? `${formatKrw(selectedMenu.recommended_price_band_krw[0])} ~ ${formatKrw(selectedMenu.recommended_price_band_krw[1])}` : "-"}</td><td className="p-3">업종 객단가 기반</td></tr>
                  <tr className="border-t border-[#eadfce]"><td className="p-3">식재 원가율</td><td className="p-3">{selectedMenu ? `${Math.round(selectedMenu.ingredient_cost_rate_band[0] * 100)}~${Math.round(selectedMenu.ingredient_cost_rate_band[1] * 100)}%` : "-"}</td><td className="p-3">공급처 비교 전 기준</td></tr>
                  <tr className="border-t border-[#eadfce]"><td className="p-3">조리 시간</td><td className="p-3">{selectedMenu?.cooking_time_minutes ?? 0}분</td><td className="p-3">피크타임 회전율 반영</td></tr>
                  <tr className="border-t border-[#eadfce]"><td className="p-3">마진율</td><td className="p-3">{selectedMenu ? `${Math.round(selectedMenu.margin_rate_band[0] * 100)}~${Math.round(selectedMenu.margin_rate_band[1] * 100)}%` : "-"}</td><td className="p-3">배달 수수료 전후 비교 필요</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-[#e4dacb] bg-white p-6">
          <h3 className="text-xl font-black text-[#171717]">수익성 요약</h3>
          <dl className="mt-5 grid gap-3 text-sm">
            <Summary label="예상 월 매출" value={formatKrw(simulation.results.monthlySales)} />
            <Summary label="식재료 원가" value={formatKrw(simulation.results.foodCost)} />
            <Summary label="포장 원가" value={formatKrw(simulation.results.packagingCost)} />
            <Summary label="인건비" value={formatKrw(simulation.results.laborCost)} />
            <Summary label="예상 점주 수익" value={formatKrw(simulation.results.estimatedOwnerProfit)} strong />
          </dl>
          <p className="mt-5 rounded-2xl bg-[#eef7f1] p-4 text-sm font-bold leading-6 text-[#406150]">
            <Star className="mb-2 text-[#0f7b54]" /> 원가 비중이 높은 재료는 다음 단계에서 공급처 비교와 공동구매로 방어합니다.
          </p>
        </article>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Link href="/dashboard/startup/suppliers" className="rounded-2xl bg-[#073d2d] px-6 py-4 text-sm font-black text-white">공급처·공동구매로 이동</Link>
        <Link href="/dashboard/startup/finance" className="rounded-2xl border border-[#e4dacb] bg-white px-6 py-4 text-sm font-black text-[#4a2a18]">4개월 회계 다시 보기</Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-[#f0e7d9] pb-2"><dt>{label}</dt><dd className="font-black text-[#171717]">{value}</dd></div>;
}

function Summary({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex justify-between rounded-xl p-4 ${strong ? "bg-[#e7f4ed] text-[#0f7b54]" : "bg-[#fffaf3] text-[#2b1e16]"}`}><dt className="font-bold">{label}</dt><dd className="font-black">{value}</dd></div>;
}
