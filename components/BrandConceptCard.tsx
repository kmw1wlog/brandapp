import type { BrandReference } from "@/lib/types";

export function BrandConceptCard({ brand, selected, action }: { brand: BrandReference; selected?: boolean; action?: React.ReactNode }) {
  return (
    <article className={`rounded-3xl p-5 shadow-soft ${selected ? "bg-forest text-cream" : "bg-white text-ink"}`}>
      <p className="text-xs font-black text-clay">{brand.slogan}</p>
      <h3 className="mt-2 text-2xl font-black">{brand.brand_name}</h3>
      <p className={`mt-3 text-sm ${selected ? "text-cream/80" : "text-ink/65"}`}>{brand.concept}</p>
      <dl className="mt-5 grid gap-3 text-sm">
        <div><dt className="font-black">컬러 무드</dt><dd>{brand.color_mood.join(", ")}</dd></div>
        <div><dt className="font-black">로고 방향</dt><dd>{brand.logo_direction}</dd></div>
        <div><dt className="font-black">네이버 지도 소개문</dt><dd>{brand.naver_intro}</dd></div>
        <div><dt className="font-black">배달앱 소개문</dt><dd>{brand.delivery_intro}</dd></div>
        <div><dt className="font-black">리스크 노트</dt><dd>{brand.risk_note}</dd></div>
      </dl>
      {action ? <div className="mt-5">{action}</div> : null}
    </article>
  );
}
