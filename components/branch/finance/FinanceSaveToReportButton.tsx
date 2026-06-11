"use client";

import Link from "next/link";
import { saveFinanceSelection } from "@/lib/branch/storage/startup-flow-storage";
import type { FinanceScenarioKey, FinanceScenarioResult, FinanceSimulationResult } from "@/lib/branch/finance/finance-types";

export function FinanceSaveToReportButton({ result, scenarioKey, scenario }: { result: FinanceSimulationResult; scenarioKey: FinanceScenarioKey; scenario: FinanceScenarioResult }) {
  function save() {
    saveFinanceSelection({
      selectedScenario: scenarioKey,
      averageOrderValue: result.assumptions.average_order_value,
      foodCostRate: result.assumptions.food_cost_rate,
      targetDailyOrders: scenario.targetDailyOrders,
      deliveryShare: result.input.delivery_share ?? result.assumptions.delivery_share,
      endingCash: scenario.endingCashMonth4,
      updatedAt: new Date().toISOString()
    });
  }
  return (
    <Link onClick={save} href="/dashboard/startup/cost" className="inline-flex rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">
      메뉴와 원가를 더 정확히 구성하기
    </Link>
  );
}
