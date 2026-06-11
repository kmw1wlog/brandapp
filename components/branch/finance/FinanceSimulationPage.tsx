"use client";

import { useEffect, useState } from "react";
import { calculateFinanceSimulation } from "@/lib/branch/finance/finance-calculator";
import type { FinanceScenarioKey } from "@/lib/branch/finance/finance-types";
import { readStartupInput } from "@/lib/branch/storage/startup-flow-storage";
import { FinanceInputSummary } from "./FinanceInputSummary";
import { RegionAssumptionPanel } from "./RegionAssumptionPanel";
import { ScenarioTabs } from "./ScenarioTabs";
import { FourMonthLedgerTable } from "./FourMonthLedgerTable";
import { CashBalanceChart } from "./CashBalanceChart";
import { BreakEvenCard } from "./BreakEvenCard";
import { SensitivityCards } from "./SensitivityCards";
import { CostStructurePanel } from "./CostStructurePanel";
import { FinanceSaveToReportButton } from "./FinanceSaveToReportButton";

export function FinanceSimulationPage() {
  const [scenarioKey, setScenarioKey] = useState<FinanceScenarioKey>("base");
  const [input, setInput] = useState(readStartupInput());

  useEffect(() => {
    setInput(readStartupInput());
  }, []);

  const result = calculateFinanceSimulation(input);
  const scenario = result.scenarios[scenarioKey];

  return (
    <div className="grid gap-5">
      <header className="border-b border-[#ddd2c0] pb-5">
        <h2 className="text-3xl font-black text-[#164033]">4개월 회계 시뮬레이터</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-[#655d52]">
          이 브랜드로 실제 개점하면 4개월 동안 돈이 어떻게 돌지 먼저 봅니다.
          보장 수익이 아니라, 입력값과 지역 추정값을 바탕으로 만든 회계 시뮬레이션입니다.
        </p>
        <p className="mt-3 inline-flex rounded-lg bg-[#fff6df] px-3 py-2 text-xs font-bold text-[#8a5a13]">
          임대료, 권리금, 배달앱 수수료, 인건비, 상권 수요는 실제 계약과 운영 조건에 따라 달라질 수 있습니다.
        </p>
      </header>
      <FinanceInputSummary input={input} />
      <RegionAssumptionPanel profile={result.regionProfile} />
      <ScenarioTabs value={scenarioKey} onChange={setScenarioKey} />
      <FourMonthLedgerTable scenario={scenario} />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <CashBalanceChart scenario={scenario} />
        <BreakEvenCard scenario={scenario} />
      </div>
      <SensitivityCards input={input} scenarioKey={scenarioKey} />
      <CostStructurePanel result={result} />
      <div className="flex flex-wrap gap-3">
        <FinanceSaveToReportButton result={result} scenarioKey={scenarioKey} scenario={scenario} />
      </div>
    </div>
  );
}
