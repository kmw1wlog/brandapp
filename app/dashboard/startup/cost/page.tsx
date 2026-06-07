"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CostDefenseCards } from "@/components/branch/CostDefenseCards";
import { MenuCostTable } from "@/components/branch/MenuCostTable";
import { MenuDetailCard } from "@/components/branch/MenuDetailCard";
import { PageHeader } from "@/components/branch/Common";
import { ProfitSimulationChart } from "@/components/branch/ProfitSimulationChart";
import { getDashboardCopy } from "@/lib/branch/data";
import { trackEvent } from "@/lib/branch/events";
import { getRealMenuCostsOrFallback, getRealProfitSimulationsOrFallback } from "@/lib/branch/real-data";

export default function CostPage() {
  const copy = getDashboardCopy().screens.cost;
  const menus = getRealMenuCostsOrFallback();
  const simulation = getRealProfitSimulationsOrFallback();

  useEffect(() => {
    trackEvent("cost_simulation_view");
  }, []);

  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <MenuCostTable menus={menus} />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <MenuDetailCard menu={menus[0]} />
        <ProfitSimulationChart simulation={simulation} />
      </div>
      <CostDefenseCards menu={menus[0]} />
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/startup/suppliers" className="rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">공급처 보기</Link>
        <Link href="/dashboard/startup/suppliers" className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">공동구매 후보 보기</Link>
      </div>
    </div>
  );
}
