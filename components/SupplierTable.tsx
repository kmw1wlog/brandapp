import type { matchSuppliersForMenu } from "@/lib/matching";
import { won } from "@/lib/format";

type Matches = ReturnType<typeof matchSuppliersForMenu>;

export function SupplierTable({ matches }: { matches: Matches }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead className="bg-forest text-cream">
          <tr>
            <th className="p-4">품목</th>
            <th className="p-4">공급처</th>
            <th className="p-4">카테고리</th>
            <th className="p-4">최소주문</th>
            <th className="p-4">배송</th>
            <th className="p-4">예상단가</th>
            <th className="p-4">신뢰도</th>
            <th className="p-4">링크</th>
          </tr>
        </thead>
        <tbody>
          {matches.flatMap((match) =>
            match.candidates.slice(0, 2).map((candidate) => (
              <tr key={`${match.ingredientName}-${candidate.supplier.id}`} className="border-b border-forest/10">
                <td className="p-4 font-bold text-forest">{match.ingredientName}</td>
                <td className="p-4">{candidate.supplier.name}</td>
                <td className="p-4">{candidate.supplier.sub_category}</td>
                <td className="p-4">{candidate.supplier.min_order.value}{candidate.supplier.min_order.unit}</td>
                <td className="p-4">{candidate.supplier.delivery_type.join(", ")}</td>
                <td className="p-4">{won(candidate.supplier.estimated_price.value)} / {candidate.supplier.estimated_price.unit}</td>
                <td className="p-4">{Math.round(candidate.supplier.confidence_score * 100)}%</td>
                <td className="p-4">
                  <button disabled className="rounded-full bg-cream px-3 py-2 text-xs font-bold text-forest/60">실제 링크 확인 필요</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
