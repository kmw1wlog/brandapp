import { formatManwon } from "@/lib/branch/finance/finance-format";
import type { FinanceScenarioResult } from "@/lib/branch/finance/finance-types";

export function BreakEvenCard({ scenario }: { scenario: FinanceScenarioResult }) {
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-lg font-black text-[#164033]">손익분기 주문 수</h3>
      <div className="mt-4 grid gap-3 text-sm">
        <Metric label="일 손익분기" value={`${scenario.breakEvenDailyOrders.toLocaleString("ko-KR")}건`} />
        <Metric label="추가 자금 필요 시점" value={scenario.firstCashNeedMonth == null ? "없음" : `${scenario.firstCashNeedMonth}개월차`} />
        <Metric label="4개월 후 예상 현금잔고" value={formatManwon(scenario.endingCashMonth4)} />
        <Metric label="점주가 가져갈 수 있는 돈" value={formatManwon(scenario.ownerTakeHomeTotal)} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3 border-b border-[#eee6d8] pb-2"><span className="font-bold text-[#655d52]">{label}</span><span className="font-black text-[#164033]">{value}</span></div>;
}
