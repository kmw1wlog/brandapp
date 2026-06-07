import { formatManwon } from "@/lib/branch/finance/finance-format";
import { calculateSensitivityCards } from "@/lib/branch/finance/finance-sensitivity";
import type { FinanceScenarioKey, StartupUserInput } from "@/lib/branch/finance/finance-types";

export function SensitivityCards({ input, scenarioKey }: { input: StartupUserInput; scenarioKey: FinanceScenarioKey }) {
  const cards = calculateSensitivityCards(input, scenarioKey);
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-lg font-black text-[#164033]">민감도 카드</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg bg-[#f6f1e8] p-3">
            <p className="text-xs font-black text-[#805412]">{card.label}</p>
            <p className="mt-2 font-black text-[#164033]">{formatManwon(card.endingCash)}</p>
            <p className="mt-1 text-xs font-bold text-[#655d52]">기준 대비 {formatManwon(card.delta)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
