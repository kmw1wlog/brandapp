import { formatRange } from "@/lib/branch/format";
import type { EquipmentItem } from "@/lib/branch/types";

export function EquipmentListCard({ items }: { items: EquipmentItem[] }) {
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-lg font-black text-[#164033]">주방설비 리스트</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg bg-[#f6f1e8] p-3 text-sm">
            <p className="font-black text-[#164033]">{item.name} · {item.quantity}개</p>
            <p className="mt-1 text-[#655d52]">{item.priority} · {formatRange(item.estimated_cost_min, item.estimated_cost_max)} · {item.notes}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
