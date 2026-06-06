import type { GroupBuy } from "@/lib/types";

export function GroupBuyCard({ groupBuy }: { groupBuy: GroupBuy }) {
  const progress = Math.min(100, (groupBuy.current_buyers / groupBuy.target_buyers) * 100);
  return (
    <article className="rounded-3xl bg-white p-6 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-clay">{groupBuy.status}</p>
      <h3 className="mt-2 text-3xl font-black text-forest">{groupBuy.item_name}</h3>
      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <span>현재 참여 <b>{groupBuy.current_buyers}명</b></span>
        <span>목표 <b>{groupBuy.target_buyers}명</b></span>
        <span>목표 물량 <b>{groupBuy.target_quantity}{groupBuy.unit}</b></span>
        <span>예상 절감률 <b>{Math.round(groupBuy.estimated_discount_rate_min * 100)}~{Math.round(groupBuy.estimated_discount_rate_max * 100)}%</b></span>
      </div>
      <div className="mt-5 h-4 overflow-hidden rounded-full bg-cream">
        <div className="h-full bg-clay" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-4 text-sm text-ink/65">관련 메뉴: {groupBuy.related_menus.join(", ")}</p>
      <p className="mt-2 text-sm text-ink/65">{groupBuy.memo}</p>
    </article>
  );
}
