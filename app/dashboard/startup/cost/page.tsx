"use client";

import Link from "next/link";
import { CostCompositionChart } from "@/components/CostCompositionChart";
import { IngredientCostTable } from "@/components/IngredientCostTable";
import { StatCard } from "@/components/StatCard";
import { getWoosamgyupDetail } from "@/lib/db/local";
import { calculateBreakevenServings, calculateContributionMargin, calculateFoodCost, calculateFoodCostRate, calculateGrossMargin, calculateOperatingMargin, calculatePackagingCost, calculateWeightedDeliveryFee, simulatePrices } from "@/lib/cost";
import { percent, won } from "@/lib/format";
import { getFallbackCostComment } from "@/lib/ai/fallback";

export default function CostPage() {
  const detail = getWoosamgyupDetail();
  const foodCost = calculateFoodCost(detail.ingredients);
  const packagingCost = calculatePackagingCost(detail.packaging);
  const weightedDeliveryFee = calculateWeightedDeliveryFee(detail.recommended_price, detail.assumptions.delivery_order_ratio, detail.assumptions.delivery_platform_fee_rate);
  const contributionMargin = calculateContributionMargin(detail.recommended_price, foodCost, packagingCost, weightedDeliveryFee);
  const operatingMargin = calculateOperatingMargin(contributionMargin, detail.assumptions.labor_allocation_per_serving, detail.assumptions.rent_allocation_per_serving, detail.assumptions.utility_and_misc_per_serving);
  const breakeven = calculateBreakevenServings(detail.assumptions.monthly_fixed_cost, contributionMargin, detail.assumptions.business_days);
  const simulations = simulatePrices({ foodCost, packagingCost, deliveryRatio: detail.assumptions.delivery_order_ratio, deliveryFeeRate: detail.assumptions.delivery_platform_fee_rate, recommendedPrice: detail.recommended_price }, [8500, 8900, 9300, 9500]);
  const comment = getFallbackCostComment();

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold text-clay">3단계</p><h2 className="mt-2 text-3xl font-black text-forest">우삼겹 덮밥 원가 분석</h2></div>
        <div className="flex gap-3"><Link href="/dashboard/startup/suppliers" className="rounded-2xl bg-clay px-5 py-3 text-sm font-black text-white">공급처 링크 보기</Link><button onClick={() => globalThis.print()} className="rounded-2xl bg-forest px-5 py-3 text-sm font-black text-cream">PDF 리포트 저장</button></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="권장 판매가" value={won(detail.recommended_price)} />
        <StatCard label="1인분 원재료비" value={won(foodCost)} />
        <StatCard label="목표 원가율" value={percent(calculateFoodCostRate(foodCost, detail.recommended_price))} />
        <StatCard label="예상 마진" value={won(operatingMargin)} note="배달/배분 비용 반영" />
        <StatCard label="손익분기 일 판매량" value={`${breakeven.daily.toFixed(1)}그릇`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <IngredientCostTable items={[...detail.ingredients, ...detail.packaging]} />
          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <h3 className="text-lg font-black text-forest">판매가 시뮬레이션</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {simulations.map((item) => (
                <div key={item.price} className={`rounded-2xl p-4 ${item.recommended ? "bg-forest text-cream" : "bg-cream text-forest"}`}>
                  <p className="text-xl font-black">{won(item.price)}</p>
                  <p className="mt-2 text-sm">원가율 {percent(item.foodCostRate)}</p>
                  <p className="text-sm">공헌이익 {won(item.contributionMargin)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <CostCompositionChart items={[{ label: "식품 원재료비", value: foodCost, color: "bg-clay" }, { label: "포장비", value: packagingCost, color: "bg-moss" }, { label: "배달 가중 수수료", value: weightedDeliveryFee, color: "bg-forest" }, { label: "기초 매출총이익", value: calculateGrossMargin(detail.recommended_price, foodCost, packagingCost), color: "bg-amber-300" }]} />
          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <h3 className="text-lg font-black text-forest">AI 수익성 코멘트</h3>
            <ul className="mt-4 grid gap-3 text-sm text-ink/70">{comment.ai_comment.map((item) => <li key={item}>- {item}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
