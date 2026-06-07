import { formatManwon } from "@/lib/branch/finance/finance-format";
import type { FinanceScenarioResult } from "@/lib/branch/finance/finance-types";

export function CashBalanceChart({ scenario }: { scenario: FinanceScenarioResult }) {
  const values = scenario.rows.map((row) => row.endingCash);
  const max = Math.max(...values.map((value) => Math.abs(value)), 1);
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-lg font-black text-[#164033]">월별 현금잔고 그래프</h3>
      <div className="mt-4 grid gap-3">
        {scenario.rows.map((row) => (
          <div key={row.month} className="grid grid-cols-[90px_1fr_90px] items-center gap-3 text-sm">
            <span className="font-bold text-[#655d52]">{row.month}개월차</span>
            <div className="h-3 rounded-full bg-[#eee6d8]">
              <div className={`h-3 rounded-full ${row.endingCash >= 0 ? "bg-[#164033]" : "bg-[#b8642f]"}`} style={{ width: `${Math.max(4, Math.min(100, (Math.abs(row.endingCash) / max) * 100))}%` }} />
            </div>
            <span className="text-right font-black text-[#164033]">{formatManwon(row.endingCash)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
