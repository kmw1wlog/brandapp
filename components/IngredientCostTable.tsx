import type { CostIngredient } from "@/lib/types";
import { won } from "@/lib/format";

export function IngredientCostTable({ items }: { items: CostIngredient[] }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-forest text-cream">
          <tr>
            <th className="p-4">재료</th>
            <th className="p-4">사용량</th>
            <th className="p-4">단가</th>
            <th className="p-4">1인분 원가</th>
            <th className="p-4">공급 키워드</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-b border-forest/10">
              <td className="p-4 font-bold text-forest">{item.name}</td>
              <td className="p-4">{item.amount_per_serving}{item.unit}</td>
              <td className="p-4">{item.unit_price_label ?? "-"}</td>
              <td className="p-4 font-bold">{won(item.cost_estimate)}</td>
              <td className="p-4 text-ink/60">{item.supplier_keywords?.join(", ") ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
