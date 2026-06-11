"use client";

import Link from "next/link";
import { ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { formatKrw, useDemoExperience } from "@/components/branch/DemoExperience";
import { getRealGroupBuyCandidatesOrFallback, getRealVerifiedSupplierProducts } from "@/lib/branch/real-data";

type ProductRecord = {
  id: string;
  productName: string;
  supplierName: string;
  displayedPrice: number | null;
  normalizedPricePerKg: number | null;
  normalizedPricePerEach: number | null;
  productUrl: string;
  deliveryToBusan: boolean | null;
};

type GroupBuyRecord = {
  id: string;
  itemName: string;
  currentInterestCount: number;
  targetBuyers: number;
  targetQuantity: number;
  unit: string;
  estimatedDiscountRateMin: number | null;
  estimatedDiscountRateMax: number | null;
};

const ingredientRows = [
  ["주재료", "100g", "2,950", "31.6%"],
  ["밥", "120g", "180", "2.4%"],
  ["대파", "20g", "120", "2.6%"],
  ["다진마늘", "10g", "160", "1.7%"],
  ["포장용기", "1ea", "210", "22.5%"],
  ["소스", "35g", "280", "10.5%"]
];

export default function SuppliersPage() {
  const { simulation } = useDemoExperience();
  const products = (getRealVerifiedSupplierProducts() as ProductRecord[]).slice(0, 5);
  const groupBuys = (getRealGroupBuyCandidatesOrFallback() as GroupBuyRecord[]).slice(0, 5);

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-[#e4dacb] bg-white p-6 shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
        <div>
          <p className="text-sm font-black text-[#0f7b54]">7 / 10 공급사 · 공동구매 · 원가방어</p>
          <h2 className="mt-3 text-4xl font-black text-[#171717]">선택한 메뉴 기준으로 주요 식재료의 구매 옵션과 원가 방어 전략을 확인하세요.</h2>
          <p className="mt-2 text-sm font-bold text-[#6a6258]">기준일 2025.05.20 · 실제 계약 전 견적/배송/부가세 재확인 필요</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#e4dacb] bg-white px-4 py-3 text-sm font-black text-[#4a2a18]"><RefreshCw size={16} /> 데이터 새로고침</button>
      </header>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1fr_0.92fr]">
        <article className="rounded-[28px] border border-[#e4dacb] bg-white p-5">
          <h3 className="text-xl font-black text-[#171717]">1. 식재료 구성</h3>
          <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#fffaf3] p-4">
            <p className="text-sm font-black text-[#0f7b54]">선택 메뉴</p>
            <p className="mt-1 text-lg font-black text-[#2b1e16]">{simulation.menus[0]?.menu_name ?? "대표 메뉴"}</p>
            <p className="mt-2 text-sm font-bold text-[#7b6a59]">1인분 기준 · VAT 제외</p>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-[#eadfce]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f7f3eb] text-[#6a6258]">
                <tr><th className="p-3">식재료</th><th className="p-3">소요량</th><th className="p-3">원가(원)</th><th className="p-3">비중</th></tr>
              </thead>
              <tbody className="font-bold text-[#2b1e16]">
                {ingredientRows.map((row) => <tr key={row[0]} className="border-t border-[#eadfce]"><td className="p-3">{row[0]}</td><td className="p-3">{row[1]}</td><td className="p-3">{row[2]}</td><td className="p-3">{row[3]}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-2xl bg-[#f3faf6] p-4">
            <p className="text-sm font-bold text-[#406150]">총 원가(1인분)</p>
            <p className="mt-1 text-3xl font-black text-[#0f7b54]">932원</p>
          </div>
        </article>

        <article className="rounded-[28px] border border-[#e4dacb] bg-white p-5">
          <h3 className="text-xl font-black text-[#171717]">2. 공급처 후보</h3>
          <div className="mt-4 grid gap-3">
            {products.map((product) => (
              <article key={product.id} className="rounded-2xl border border-[#eadfce] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0f7b54]">{product.supplierName}</p>
                    <h4 className="mt-1 font-black text-[#2b1e16]">{product.productName}</h4>
                    <p className="mt-1 text-sm font-bold text-[#7b6a59]">부산 배송 {product.deliveryToBusan === false ? "확인 필요" : "가능/추정"}</p>
                  </div>
                  <a href={product.productUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-[#e4dacb] px-3 py-2 text-sm font-black text-[#4a2a18]">
                    상품 링크 <ExternalLink className="inline" size={14} />
                  </a>
                </div>
                <p className="mt-3 text-lg font-black text-[#1264b0]">{priceLabel(product)}</p>
              </article>
            ))}
          </div>
          <button type="button" className="mt-4 w-full rounded-xl border border-[#e4dacb] px-4 py-3 text-sm font-black text-[#4a2a18]">더 많은 공급처 보기</button>
        </article>

        <aside className="grid gap-5">
          <section className="rounded-[28px] border border-[#e4dacb] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-[#171717]">3. 공동구매 현황</h3>
              <span className="text-sm font-black text-[#1264b0]">마감까지 5일 남음</span>
            </div>
            <div className="mt-4 grid gap-3">
              {groupBuys.map((item) => {
                const progress = Math.min(96, Math.round((item.currentInterestCount / Math.max(1, item.targetBuyers)) * 100));
                return (
                  <article key={item.id} className="rounded-2xl border border-[#eadfce] p-4">
                    <p className="font-black text-[#2b1e16]">{item.itemName}</p>
                    <p className="mt-2 text-sm font-bold text-[#6a6258]">현재 관심 {item.currentInterestCount}명 · 목표 {item.targetBuyers}명</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf1ec]"><div className="h-full rounded-full bg-[#0f7b54]" style={{ width: `${progress}%` }} /></div>
                    <button type="button" className="mt-3 w-full rounded-xl border border-[#e4dacb] px-3 py-2 text-sm font-black text-[#4a2a18]">참여하기</button>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#e4dacb] bg-white p-5">
            <h3 className="text-xl font-black text-[#171717]">4. 원가 방어 시나리오</h3>
            <div className="mt-4 rounded-2xl border border-[#ffd8d8] bg-[#fff7f7] p-4">
              <p className="font-black text-[#b93b35]">주재료 단가가 15% 상승하면?</p>
              <p className="mt-2 text-sm font-bold text-[#6a6258]">대체 공급처 전환, 공동구매 참여, 메뉴 믹스 조정으로 방어합니다.</p>
            </div>
            <div className="mt-4 grid gap-3">
              {["대체 공급처 전환", "원산지 옵션", "공동구매 참여", "메뉴 믹스 조정"].map((item) => (
                <button key={item} type="button" className="flex items-center justify-between rounded-xl border border-[#e4dacb] px-4 py-3 text-sm font-black text-[#4a2a18]">
                  <span className="flex items-center gap-2"><ShieldCheck size={16} /> {item}</span>
                  적용
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-2xl bg-[#e7f4ed] p-4 text-center text-xl font-black text-[#0f7b54]">복합 적용 시 예상 절감 효과 -1,003원/100g</p>
          </section>
        </aside>
      </section>

      <div className="flex justify-end gap-3">
        <Link href="/dashboard/startup/franchise" className="rounded-2xl bg-[#073d2d] px-6 py-4 text-sm font-black text-white">브랜드 비교로 이동</Link>
      </div>
    </div>
  );
}

function priceLabel(product: ProductRecord) {
  if (product.normalizedPricePerKg) return `${Math.round(product.normalizedPricePerKg).toLocaleString("ko-KR")}원/kg`;
  if (product.normalizedPricePerEach) return `${Math.round(product.normalizedPricePerEach).toLocaleString("ko-KR")}원/ea`;
  if (product.displayedPrice) return formatKrw(product.displayedPrice);
  return "견적 필요";
}
