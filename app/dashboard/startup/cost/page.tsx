"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CostDefenseCards } from "@/components/branch/CostDefenseCards";
import { MenuCostTable } from "@/components/branch/MenuCostTable";
import { MenuDetailCard } from "@/components/branch/MenuDetailCard";
import { PageHeader } from "@/components/branch/Common";
import { ProfitSimulationChart } from "@/components/branch/ProfitSimulationChart";
import { getDashboardCopy } from "@/lib/branch/data";
import { trackEvent } from "@/lib/branch/events";
import { getRealMenuCostsOrFallback, getRealProfitSimulationsOrFallback } from "@/lib/branch/real-data";
import { readFinanceSelection } from "@/lib/branch/storage/startup-flow-storage";
import { formatManwon, formatPercentValue } from "@/lib/branch/finance/finance-format";

export default function CostPage() {
  const copy = getDashboardCopy().screens.cost;
  const menus = getRealMenuCostsOrFallback();
  const simulation = getRealProfitSimulationsOrFallback();
  const [finance, setFinance] = useState<ReturnType<typeof readFinanceSelection>>(null);

  useEffect(() => {
    trackEvent("cost_simulation_view");
    setFinance(readFinanceSelection());
  }, []);

  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-4">
        <h3 className="font-black text-[#164033]">4개월 회계 시뮬레이션의 기준값을 바탕으로 메뉴·원가를 더 정확히 조정합니다.</h3>
        <p className="mt-2 text-sm font-bold text-[#655d52]">
          {finance ? `기준 객단가 ${formatManwon(finance.averageOrderValue)} · 목표 일 주문 ${finance.targetDailyOrders}건 · 원가율 ${formatPercentValue(finance.foodCostRate)} · 배달 비중 ${formatPercentValue(finance.deliveryShare)}` : "finance simulation recalculation available"}
        </p>
      </section>
      <MenuCostTable menus={menus} />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <MenuDetailCard menu={menus[0]} />
        <ProfitSimulationChart simulation={simulation} />
      </div>
      <CostDefenseCards menu={menus[0]} />
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/startup/suppliers" className="rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">공급처 보기</Link>
        <Link href="/dashboard/startup/suppliers" className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">공동구매 후보 보기</Link>
        <Link href="/dashboard/startup/finance" className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">수정한 원가로 4개월 회계 다시 계산</Link>
      </div>
    </div>
  );
}
