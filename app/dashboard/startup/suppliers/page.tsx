import Link from "next/link";
import { SupplierTable } from "@/components/SupplierTable";
import { getGroupBuysByMenu, getSuppliers, getWoosamgyupDetail } from "@/lib/db/local";
import { buildRecommendedSupplierBundle, matchSuppliersForMenu } from "@/lib/matching";
import { won } from "@/lib/format";

export default function SuppliersPage() {
  const detail = getWoosamgyupDetail();
  const matches = matchSuppliersForMenu([...detail.ingredients, ...detail.packaging], getSuppliers());
  const bundle = buildRecommendedSupplierBundle(matches);
  const groupBuys = getGroupBuysByMenu(detail.menu_name);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-clay">4단계</p><h2 className="mt-2 text-3xl font-black text-forest">공급처 링크</h2><p className="mt-2 text-ink/60">재료 키워드 기반 매칭 결과입니다. 실제 링크는 확인 전까지 비활성화합니다.</p></div>
          <Link href="/dashboard/startup/brand" className="rounded-2xl bg-clay px-5 py-3 text-sm font-black text-white">브랜드/인테리어 보기</Link>
        </div>
        <SupplierTable matches={matches} />
      </div>
      <aside className="grid gap-5">
        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <h3 className="text-xl font-black text-forest">추천 구매 조합</h3>
          <div className="mt-4 grid gap-3">
            {bundle.slice(0, 5).map((supplier) => <div key={supplier.id} className="rounded-2xl bg-cream p-3 text-sm font-bold text-forest">{supplier.name} · {supplier.sub_category}</div>)}
          </div>
          <p className="mt-4 text-sm text-ink/60">예상 원가 절감 효과: 우삼겹 공동구매 참여 시 월 약 {won(52000)} 절감 추정</p>
          <button className="mt-4 rounded-2xl bg-forest px-4 py-3 text-sm font-black text-cream">즐겨찾기 저장</button>
        </div>
        <div className="rounded-3xl bg-forest p-5 text-cream shadow-soft">
          <h3 className="text-xl font-black">공동구매 가능 품목</h3>
          <div className="mt-4 grid gap-3">
            {groupBuys.map((item) => <div key={item.id} className="rounded-2xl bg-white/10 p-3 text-sm font-bold">{item.item_name} · {item.current_buyers}/{item.target_buyers}명</div>)}
          </div>
          <Link href="/dashboard/startup/groupbuy" className="mt-5 inline-block rounded-2xl bg-clay px-5 py-3 text-sm font-black text-white">공동구매 보기</Link>
        </div>
      </aside>
    </section>
  );
}
