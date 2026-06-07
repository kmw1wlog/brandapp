"use client";

import { trackEvent } from "@/lib/branch/events";
import { formatKRW } from "@/lib/branch/format";
import type { SupplierCandidate } from "@/lib/branch/types";
import { Badge } from "./Common";

export function SupplierTable({ suppliers }: { suppliers: SupplierCandidate[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#ddd2c0] bg-white">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-[#164033] text-white">
          <tr>{["품목", "공급처 후보", "예상 단가", "최소 주문", "배송방식", "보관 리스크", "견적 요청"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-t border-[#eee5d7]">
              <td className="p-3">{supplier.item_keywords.join(", ")}</td>
              <td className="p-3 font-black text-[#164033]">{supplier.name} {supplier.confidence_score < 0.8 ? <Badge tone="warning">견적 확인 필요</Badge> : null}</td>
              <td className="p-3">{formatKRW(supplier.estimated_price)}</td>
              <td className="p-3">{supplier.min_order}</td>
              <td className="p-3">{supplier.delivery_type}</td>
              <td className="p-3">{supplier.storage_risk}</td>
              <td className="p-3"><button onClick={() => trackEvent("supplier_quote_click", { supplierId: supplier.id, item: supplier.item_keywords[0] })} className="rounded-md bg-[#b8642f] px-3 py-2 text-xs font-black text-white">견적 요청</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
