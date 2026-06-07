import { formatManwon, formatPercentValue } from "@/lib/branch/finance/finance-format";
import type { FinanceSimulationResult } from "@/lib/branch/finance/finance-types";

export function CostStructurePanel({ result }: { result: FinanceSimulationResult }) {
  const assumptions = result.assumptions;
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-lg font-black text-[#164033]">비용 구조</h3>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <Metric label="평균 객단가" value={formatManwon(assumptions.average_order_value)} />
        <Metric label="식재료 원가율" value={formatPercentValue(assumptions.food_cost_rate)} />
        <Metric label="포장비/주문" value={`${assumptions.packaging_cost_per_order.toLocaleString("ko-KR")}원`} />
        <Metric label="배달앱 수수료" value={formatPercentValue(assumptions.delivery_platform_fee_rate)} />
        <Metric label="카드 수수료" value={formatPercentValue(assumptions.card_fee_rate)} />
        <Metric label="월 고정 운영비" value={formatManwon(assumptions.management_fee + assumptions.utilities + assumptions.internet_pos + assumptions.insurance + assumptions.waste_disposal)} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold text-[#7a7065]">{label}</p><p className="mt-1 font-black text-[#164033]">{value}</p></div>;
}
