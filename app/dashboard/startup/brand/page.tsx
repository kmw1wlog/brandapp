"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BrandOptionTabs } from "@/components/branch/BrandOptionTabs";
import { BrandSummaryPanel } from "@/components/branch/BrandSummaryPanel";
import { BrandBoardView } from "@/components/branch/assets/BrandBoardView";
import { OperatingTypeToggle } from "@/components/branch/OperatingTypeToggle";
import { PageHeader, ActionLink } from "@/components/branch/Common";
import { getBrandById, getBrandOptions, getDashboardCopy } from "@/lib/branch/data";
import { buildExperienceSimulation, type ExperienceSimulation } from "@/lib/branch/experience-data";
import { saveSelectedBrand, trackEvent } from "@/lib/branch/events";
import { getBranchStorage } from "@/lib/branch/storage";
import { readStartupInput } from "@/lib/branch/storage/startup-flow-storage";

export default function BrandPage() {
  const copy = getDashboardCopy().screens.brand_detail;
  const brands = getBrandOptions();
  const [brandId, setBrandId] = useState("brand_yukbanjang");
  const [operatingType, setOperatingType] = useState("점포형");
  const [simulation, setSimulation] = useState<ExperienceSimulation>(() => buildExperienceSimulation(readStartupInput()));
  const brand = getBrandById(brandId);

  useEffect(() => {
    getBranchStorage().getSelectedBrand().then(setBrandId);
    setSimulation(buildExperienceSimulation(readStartupInput()));
  }, []);

  function selectBrand(nextId: string) {
    setBrandId(nextId);
    saveSelectedBrand(nextId);
    getBranchStorage().saveSelectedBrand(nextId);
    trackEvent("brand_selected", { brandId: nextId, operatingType });
  }

  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning="이 브랜드는 단순 이름이 아니라, 앞에서 계산한 메뉴·가격·상권·공급처를 바탕으로 만든 창업 콘셉트입니다." />
      <section className="grid gap-5 rounded-lg border border-[#ddd2c0] bg-white p-5 lg:grid-cols-[1fr_420px]" data-testid="experience-brand-detail">
        <div>
          <p className="text-xs font-black uppercase text-[#b8642f]">현재 입력 업종 기준</p>
          <h2 className="mt-2 text-3xl font-black text-[#164033]">{simulation.virtualBrand.name}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-[#655d52]">{simulation.virtualBrand.tagline}</p>
          <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
            <Metric label="업종" value={simulation.category.display_name} />
            <Metric label="예상 월매출" value={`${Math.round(simulation.results.monthlySales / 10_000).toLocaleString("ko-KR")}만원`} />
            <Metric label="점주 수익" value={`${Math.round(simulation.results.estimatedOwnerProfit / 10_000).toLocaleString("ko-KR")}만원`} />
          </div>
          <div className="mt-5 grid gap-2">
            {simulation.virtualBrand.menuBoard.slice(0, 4).map((line) => (
              <div key={line} className="rounded-lg bg-[#f7f1e8] px-3 py-2 text-sm font-black text-[#164033]">{line}</div>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {simulation.imageTemplates.slice(0, 4).map((template) => (
            <div key={template.template_id} className="overflow-hidden rounded-lg border border-[#ddd2c0] bg-[#f7f1e8]">
              <Image src={template.image_path} alt={template.visual_concept} width={420} height={315} className="aspect-[4/3] w-full object-cover" />
              <div className="p-3">
                <p className="text-xs font-black text-[#164033]">{template.visual_concept}</p>
                <p className="mt-1 text-xs font-bold text-[#8a8176]">{template.signage_style}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <BrandOptionTabs brands={brands} selectedId={brandId} onSelect={selectBrand} />
        <OperatingTypeToggle value={operatingType} onChange={setOperatingType} />
      </div>
      <section className="relative z-0 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg bg-[#164033] p-5 text-white">
          <h3 className="text-2xl font-black">{brand.name}</h3>
          <p className="mt-1 font-semibold text-[#e2b15f]">{brand.slogan}</p>
          <p className="mt-3 text-sm leading-6 text-white/78">{brand.concept}</p>
          <div className="mt-5"><BrandBoardView brand={brand} /></div>
        </div>
        <div className="rounded-lg border border-[#ddd2c0] bg-white p-5">
          <h3 className="text-xl font-black text-[#164033]">브랜드 실행 문구</h3>
          <dl className="mt-4 grid gap-3 text-sm">
            <Item label="인테리어 방향" value={brand.interior_mood} />
            <Item label="로고 방향" value={brand.logo_direction} />
            <Item label="컬러 무드" value={brand.color_mood.join(", ")} />
            <Item label="메뉴판 문구" value={brand.menu_board_copy} />
            <Item label="네이버 플레이스" value={brand.naver_place_intro} />
            <Item label="배달앱 소개문" value={brand.delivery_app_intro} />
          </dl>
        </div>
      </section>
      <BrandSummaryPanel brand={brand} operatingType={operatingType} />
      <div className="flex flex-wrap gap-3">
        <button onClick={() => selectBrand(brand.id)} className="rounded-lg bg-[#164033] px-4 py-3 text-sm font-black text-white">이 버전 선택</button>
        <button onClick={() => setOperatingType("배달형")} className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">배달형으로 바꾸기</button>
        <button onClick={() => setOperatingType("점포형")} className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">점포형으로 바꾸기</button>
        <ActionLink href="/dashboard/startup/finance">이 브랜드로 4개월 회계 시뮬레이션 보기</ActionLink>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-black text-[#164033]">{label}</dt><dd className="mt-1 leading-6 text-[#655d52]">{value}</dd></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f7f1e8] p-3"><p className="text-xs font-bold text-[#7a7065]">{label}</p><p className="mt-1 font-black text-[#164033]">{value}</p></div>;
}
