import { formatManwon } from "@/lib/branch/finance/finance-format";
import type { FinanceScenarioResult } from "@/lib/branch/finance/finance-types";

export function FourMonthLedgerTable({ scenario }: { scenario: FinanceScenarioResult }) {
  return (
    <section className="overflow-x-auto rounded-lg border border-[#ddd2c0] bg-white">
      <table className="min-w-[1180px] w-full text-left text-sm">
        <thead className="bg-[#164033] text-white">
          <tr>
            {["구간", "일 주문", "매출", "식재료비", "포장비", "배달 수수료", "고정비", "인건비", "마케팅", "영업이익", "점주 수령", "현금잔고"].map((header) => <th key={header} className="p-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {scenario.rows.map((row) => (
            <tr key={row.month} className="border-t border-[#eee6d8] align-top">
              <td className="p-3 font-black text-[#164033]">{row.month === 0 ? "0개월차: 개점 전 지출" : row.label}</td>
              <td className="p-3">{row.dailyOrders.toLocaleString("ko-KR")}건</td>
              <td className="p-3">{formatManwon(row.grossSales)}</td>
              <td className="p-3">{formatManwon(row.foodCost)}</td>
              <td className="p-3">{formatManwon(row.packagingCost)}</td>
              <td className="p-3">{formatManwon(row.deliveryPlatformFee)}</td>
              <td className="p-3">{formatManwon(row.fixedCosts)}</td>
              <td className="p-3">{formatManwon(row.laborCost)}</td>
              <td className="p-3">{formatManwon(row.marketingCost)}</td>
              <td className="p-3">{formatManwon(row.operatingProfit)}</td>
              <td className="p-3">{formatManwon(row.ownerTakeHome)}</td>
              <td className="p-3 font-black text-[#164033]">{formatManwon(row.endingCash)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
