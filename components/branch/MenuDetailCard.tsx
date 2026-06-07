import { calculateBreakeven } from "@/lib/branch/calculations";
import { formatKRW, formatPercent } from "@/lib/branch/format";
import type { MenuCost } from "@/lib/branch/types";

export function MenuDetailCard({ menu }: { menu: MenuCost }) {
  const breakeven = calculateBreakeven(3100000, menu.delivery_margin);
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-xl font-black text-[#164033]">대표 메뉴 상세</h3>
      <p className="mt-1 text-sm text-[#655d52]">{menu.name}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric label="판매가" value={formatKRW(menu.selling_price)} />
        <Metric label="식재료비" value={formatKRW(menu.food_cost)} />
        <Metric label="포장비" value={formatKRW(menu.packaging_cost)} />
        <Metric label="목표 원가율" value={formatPercent(menu.target_food_cost_rate)} />
        <Metric label="손익분기 일 판매량" value={`${breakeven.dailyServings.toFixed(1)}그릇`} />
        <Metric label="배달 포함 공헌이익" value={formatKRW(menu.delivery_margin)} />
      </div>
      <ul className="mt-4 grid gap-2 text-sm text-[#655d52]">{menu.risk_notes.map((note) => <li key={note}>- {note}</li>)}</ul>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f6f1e8] p-3"><p className="text-xs font-bold text-[#7a7065]">{label}</p><p className="mt-1 font-black text-[#164033]">{value}</p></div>;
}
