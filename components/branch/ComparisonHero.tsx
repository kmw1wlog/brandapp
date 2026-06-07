"use client";

import { useState } from "react";
import { getDefaultBrand, getScenario } from "@/lib/branch/data";
import { trackEvent } from "@/lib/branch/events";
import { getRealFeaturedFranchise, getRealFranchiseSummaryOrFallback } from "@/lib/branch/real-data";
import { InputSummaryBar } from "./InputSummaryBar";
import { OwnBrandCard } from "./OwnBrandCard";
import { FranchiseCompareCard } from "./FranchiseCompareCard";
import { OperatingTypeToggle } from "./OperatingTypeToggle";

export function ComparisonHero() {
  const scenario = getScenario();
  const brand = getDefaultBrand();
  const franchise = getRealFeaturedFranchise();
  const summary = getRealFranchiseSummaryOrFallback();
  const [operatingType, setOperatingType] = useState("점포형");

  return (
    <div>
      <InputSummaryBar scenario={scenario} />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="max-w-4xl text-4xl font-black leading-tight text-[#164033]">프랜차이즈 상담 전에, 내 자본으로 만들 수 있는 브랜드 창업안을 먼저 비교하세요.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#655d52]">브랜치는 프랜차이즈안과 자가 브랜드안을 같은 표에서 비교하고, 선택한 브랜드에 대해 메뉴·원가·시공 요구사항서·개점 타임테이블·상담 질문지까지 만들어드립니다.</p>
        </div>
        <OperatingTypeToggle value={operatingType} onChange={setOperatingType} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr]">
        <OwnBrandCard brand={brand} operatingType={operatingType} onDetail={() => trackEvent("own_brand_detail_click", { brandId: brand.id, operatingType })} />
        {franchise ? <FranchiseCompareCard franchise={franchise} summary={summary} onDetail={() => trackEvent("franchise_detail_click", { franchiseId: franchise.id })} /> : null}
      </div>
    </div>
  );
}
