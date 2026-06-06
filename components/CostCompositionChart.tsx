import { percent } from "@/lib/format";

export function CostCompositionChart({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <h3 className="text-lg font-black text-forest">비용 구성 비율</h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm font-bold text-forest">
              <span>{item.label}</span>
              <span>{percent(item.value / total)}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-cream">
              <div className={`h-full ${item.color}`} style={{ width: `${(item.value / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
