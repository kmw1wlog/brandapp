import type { Menu } from "@/lib/types";
import { won, percent } from "@/lib/format";

export function MenuCard({ menu, highlighted, action }: { menu: Menu; highlighted?: boolean; action?: React.ReactNode }) {
  return (
    <article className={`rounded-3xl p-5 shadow-soft ${highlighted ? "bg-forest text-cream" : "bg-white text-ink"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-xs font-bold ${highlighted ? "text-clay" : "text-moss"}`}>{menu.category}</p>
          <h3 className="mt-2 text-2xl font-black">{menu.name}</h3>
        </div>
        {highlighted ? <span className="rounded-full bg-clay px-3 py-1 text-xs font-black text-white">추천/선택</span> : null}
      </div>
      <p className={`mt-3 text-sm ${highlighted ? "text-cream/80" : "text-ink/65"}`}>{menu.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <span>판매가: <b>{won(menu.recommended_price)}</b></span>
        <span>목표 원가율: <b>{percent(menu.target_food_cost_rate)}</b></span>
        <span>배달 적합성: <b>{menu.delivery_fit_score}/10</b></span>
        <span>조리 난이도: <b>{menu.difficulty_score}/10</b></span>
        <span>회전율: <b>{menu.rotation_score}/10</b></span>
      </div>
      <ul className="mt-5 grid gap-2 text-sm">
        {menu.recommended_reason.map((reason) => (
          <li key={reason}>- {reason}</li>
        ))}
      </ul>
      {action ? <div className="mt-5">{action}</div> : null}
    </article>
  );
}
