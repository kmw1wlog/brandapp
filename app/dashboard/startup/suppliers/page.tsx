"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/branch/Common";
import { DataQualityBadge } from "@/components/branch/data/DataQualityBadge";
import { DataSourceNote } from "@/components/branch/data/DataSourceNote";
import { SupplierTabs } from "@/components/branch/SupplierTabs";
import { BranchEmptyState } from "@/components/branch/ui/BranchEmptyState";
import { getRealGroupBuyCandidatesOrFallback, getRealNeedsPriceProducts, getRealRejectedSupplierUrls, getRealSupplierLeads, getRealSupplierQuality, getRealVerifiedSupplierProducts } from "@/lib/branch/real-data";
import { formatKRW } from "@/lib/branch/format";

export default function SuppliersPage() {
  const [tab, setTab] = useState("검증 상품");
  const verified = getRealVerifiedSupplierProducts();
  const needsPrice = getRealNeedsPriceProducts();
  const leads = getRealSupplierLeads() as LeadRecord[];
  const rejected = getRealRejectedSupplierUrls() as LeadRecord[];
  const groupBuy = getRealGroupBuyCandidatesOrFallback() as GroupBuyRecord[];
  const quality = getRealSupplierQuality() as { blockedLabels?: string[]; missingItems?: { item: string; notes: string }[] };

  const items = useMemo(() => {
    if (tab === "검증 상품") return verified;
    if (tab === "가격 확인 필요") return needsPrice;
    if (tab === "추가 확인 후보") return leads;
    if (tab === "제외된 URL") return rejected;
    return groupBuy;
  }, [groupBuy, leads, needsPrice, rejected, tab, verified]);

  return (
    <div className="grid gap-5">
      <PageHeader
        title="공급처·공동구매"
        subtitle="canonical 공급처 DB와 perplexity delta를 병합한 실상품 후보입니다."
        warning="가격이 비어 있는 항목은 매입가로 계산하지 않고, 가격 확인 필요 상태로만 표시합니다."
      />
      <SupplierTabs value={tab} onChange={setTab} />
      {tab === "공동구매 후보" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {groupBuy.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-[color:var(--branch-primary)]">{item.itemName}</h3>
                  <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">대표 상품 {item.representativeProductIds.length}개</p>
                </div>
                <DataQualityBadge status={item.dataStatus === "ready_for_interest" ? "verified_product" : "price_missing"} />
              </div>
              <dl className="mt-4 grid gap-2 text-sm">
                <Row label="관심자" value={`${item.currentInterestCount}/${item.targetBuyers}`} />
                <Row label="목표 수량" value={`${item.targetQuantity.toLocaleString("ko-KR")}${item.unit}`} />
                <Row label="할인 추정" value={item.estimatedDiscountRateMin == null ? "공급처 견적 필요" : `${item.estimatedDiscountRateMin}% ~ ${item.estimatedDiscountRateMax}%`} />
              </dl>
              <ul className="mt-4 grid gap-2 text-xs font-bold text-[color:var(--branch-ink-muted)]">
                {item.riskNotes.map((note) => <li key={note}>- {note}</li>)}
              </ul>
            </article>
          ))}
        </div>
      ) : Array.isArray(items) && items.length > 0 ? (
        tab === "추가 확인 후보" || tab === "제외된 URL" ? <LeadTable rows={items as LeadRecord[]} /> : <ProductTable rows={items as ProductRecord[]} />
      ) : (
        <BranchEmptyState title="표시할 데이터가 없습니다" description="현재 탭의 실데이터가 없으면 fallback 없이 빈 상태를 유지합니다." />
      )}
      <DataSourceNote>blocked labels: {(quality.blockedLabels ?? []).join(", ")}</DataSourceNote>
      <div className="grid gap-2 md:grid-cols-2">
        {(quality.missingItems ?? []).slice(0, 6).map((item) => (
          <div key={item.item} className="rounded-xl bg-[color:var(--branch-surface-muted)] p-3 text-xs font-bold text-[color:var(--branch-ink-muted)]">
            {item.item} · {item.notes}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductTable({ rows }: { rows: ProductRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[color:var(--branch-border)] bg-white shadow-[var(--branch-shadow)]">
      <table className="min-w-[1200px] w-full text-left text-sm">
        <thead className="bg-[color:var(--branch-primary)] text-white">
          <tr>
            {["상품명", "공급처", "원산지", "규격", "표시가격", "단위가격", "상태", "부산 배송", "상세 URL"].map((header) => <th key={header} className="p-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[color:var(--branch-border)] align-top">
              <td className="p-3 font-black text-[color:var(--branch-primary)]">{row.productName}</td>
              <td className="p-3">{row.supplierName}</td>
              <td className="p-3">{row.origin ?? "확인 필요"}</td>
              <td className="p-3">{row.packSizeValue && row.packSizeUnit ? `${row.packSizeValue}${row.packSizeUnit}` : "확인 필요"}</td>
              <td className="p-3">{row.displayedPrice == null ? "가격 확인 필요" : formatKRW(row.displayedPrice)}</td>
              <td className="p-3">{row.normalizedPricePerKg != null ? `${Math.round(row.normalizedPricePerKg).toLocaleString("ko-KR")}원/kg` : row.normalizedPricePerEach != null ? `${Math.round(row.normalizedPricePerEach).toLocaleString("ko-KR")}원/ea` : "가격 확인 필요"}</td>
              <td className="p-3"><DataQualityBadge status={row.dataStatus} /></td>
              <td className="p-3">{row.deliveryToBusan == null ? "부산 배송 추정" : row.deliveryToBusan ? "가능" : "확인 필요"}</td>
              <td className="p-3"><a href={row.productUrl} target="_blank" rel="noreferrer" className="font-black text-[color:var(--branch-accent)] underline">새 탭 열기</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadTable({ rows }: { rows: LeadRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[color:var(--branch-border)] bg-white shadow-[var(--branch-shadow)]">
      <table className="min-w-[920px] w-full text-left text-sm">
        <thead className="bg-[color:var(--branch-primary)] text-white">
          <tr>
            {["상품명", "공급처", "page_type", "카테고리", "비고", "URL"].map((header) => <th key={header} className="p-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[color:var(--branch-border)] align-top">
              <td className="p-3 font-black text-[color:var(--branch-primary)]">{row.productName}</td>
              <td className="p-3">{row.supplierName}</td>
              <td className="p-3">{row.pageType}</td>
              <td className="p-3">{row.category} / {row.subCategory}</td>
              <td className="p-3">{row.note}</td>
              <td className="p-3">{row.productUrl ? <a href={row.productUrl} target="_blank" rel="noreferrer" className="font-black text-[color:var(--branch-accent)] underline">새 탭 열기</a> : "없음"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[color:var(--branch-ink-muted)]">{label}</dt>
      <dd className="font-black text-[color:var(--branch-primary)]">{value}</dd>
    </div>
  );
}

type ProductRecord = {
  id: string;
  productName: string;
  supplierName: string;
  origin: string | null;
  packSizeValue: number | null;
  packSizeUnit: string | null;
  displayedPrice: number | null;
  normalizedPricePerKg: number | null;
  normalizedPricePerEach: number | null;
  dataStatus: string;
  deliveryToBusan: boolean | null;
  productUrl: string;
};

type LeadRecord = {
  id: string;
  supplierName: string;
  productName: string;
  productUrl: string | null;
  pageType: string;
  category: string;
  subCategory: string;
  note: string;
};

type GroupBuyRecord = {
  id: string;
  itemName: string;
  representativeProductIds: string[];
  currentInterestCount: number;
  targetBuyers: number;
  targetQuantity: number;
  unit: string;
  estimatedDiscountRateMin: number | null;
  estimatedDiscountRateMax: number | null;
  dataStatus: string;
  riskNotes: string[];
};
