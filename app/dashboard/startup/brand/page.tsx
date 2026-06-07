"use client";

import { useEffect, useState } from "react";
import { BrandOptionTabs } from "@/components/branch/BrandOptionTabs";
import { BrandSummaryPanel } from "@/components/branch/BrandSummaryPanel";
import { BrandBoardView } from "@/components/branch/assets/BrandBoardView";
import { OperatingTypeToggle } from "@/components/branch/OperatingTypeToggle";
import { PageHeader, ActionLink } from "@/components/branch/Common";
import { getBrandById, getBrandOptions, getDashboardCopy } from "@/lib/branch/data";
import { saveSelectedBrand, trackEvent } from "@/lib/branch/events";
import { getBranchStorage } from "@/lib/branch/storage";

export default function BrandPage() {
  const copy = getDashboardCopy().screens.brand_detail;
  const brands = getBrandOptions();
  const [brandId, setBrandId] = useState("brand_yukbanjang");
  const [operatingType, setOperatingType] = useState("점포형");
  const brand = getBrandById(brandId);

  useEffect(() => {
    getBranchStorage().getSelectedBrand().then(setBrandId);
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
        <ActionLink href="/dashboard/startup/cost">최종 리포트에 저장</ActionLink>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-black text-[#164033]">{label}</dt><dd className="mt-1 leading-6 text-[#655d52]">{value}</dd></div>;
}
