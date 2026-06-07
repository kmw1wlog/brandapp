"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/branch/Common";
import { DataQualityBadge } from "@/components/branch/data/DataQualityBadge";
import { DataSourceNote } from "@/components/branch/data/DataSourceNote";
import { InfraStatusBadge } from "@/components/branch/data/InfraStatusBadge";
import { NeedsManualCheckBadge } from "@/components/branch/data/NeedsManualCheckBadge";
import { OfficialSourceBadge } from "@/components/branch/data/OfficialSourceBadge";
import { QuoteRequiredBadge } from "@/components/branch/data/QuoteRequiredBadge";
import { SupplierTabs } from "@/components/branch/SupplierTabs";
import { BranchEmptyState } from "@/components/branch/ui/BranchEmptyState";
import { getInfraPriceLabel } from "@/lib/branch/infra/infra-quality";
import { getMergedInfraData } from "@/lib/branch/infra/merge-infra-data";
import type { EquipmentProductLead, InfraCandidate } from "@/lib/branch/infra/infra-types";
import { getRealGroupBuyCandidatesOrFallback, getRealNeedsPriceProducts, getRealRejectedSupplierUrls, getRealSupplierLeads, getRealSupplierQuality, getRealVerifiedSupplierProducts } from "@/lib/branch/real-data";
import { formatKRW } from "@/lib/branch/format";

export default function SuppliersPage() {
  const [tab, setTab] = useState("식재료");
  const verified = getRealVerifiedSupplierProducts();
  const needsPrice = getRealNeedsPriceProducts();
  const leads = getRealSupplierLeads() as LeadRecord[];
  const rejected = getRealRejectedSupplierUrls() as LeadRecord[];
  const groupBuy = getRealGroupBuyCandidatesOrFallback() as GroupBuyRecord[];
  const quality = getRealSupplierQuality() as { blockedLabels?: string[]; missingItems?: { item: string; notes: string }[] };
  const infra = getMergedInfraData();
  const foodRows = [...verified, ...needsPrice].filter((item) => !isPackaging(item.category));
  const packagingRows = [...verified, ...needsPrice].filter((item) => isPackaging(item.category));

  const items = useMemo(() => {
    if (tab === "식재료") return foodRows;
    if (tab === "포장재") return packagingRows;
    if (tab === "주방설비") return infra.equipmentProductLeads;
    if (tab === "간판/인쇄") return infra.signagePrintingCandidates;
    if (tab === "데이터 품질") return { leads, rejected };
    return groupBuy;
  }, [foodRows, groupBuy, infra.equipmentProductLeads, infra.signagePrintingCandidates, leads, packagingRows, rejected, tab]);

  return (
    <div className="grid gap-5">
      <PageHeader
        title="공급처·공동구매"
        subtitle="식재료·포장재와 함께 주방설비·간판/인쇄 후보를 부산 고기덮밥집 실행 기준으로 함께 봅니다."
        warning="공식 페이지와 공개 목록 기반 후보입니다. 실제 계약 전 업체 견적, 배송·설치비, 부가세, 인허가 조건을 재확인해야 합니다."
      />
      <SupplierTabs value={tab} onChange={setTab} />
      {tab === "공동구매" ? (
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
      ) : tab === "주방설비" ? (
        <EquipmentLeadTable rows={items as EquipmentProductLead[]} />
      ) : tab === "간판/인쇄" ? (
        <InfraCandidateTable rows={items as InfraCandidate[]} />
      ) : tab === "데이터 품질" ? (
        <div className="grid gap-5">
          <LeadTable title="추가 확인 후보" rows={(items as { leads: LeadRecord[] }).leads} />
          <LeadTable title="제외된 URL" rows={(items as { rejected: LeadRecord[] }).rejected} />
        </div>
      ) : Array.isArray(items) && items.length > 0 ? (
        <ProductTable rows={items as ProductRecord[]} />
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

function isPackaging(category: string) {
  return ["packaging", "포장재", "general_supplies", "주방 소모품"].includes(category);
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
              <td className="p-3"><a href={row.productUrl} target="_blank" rel="noopener noreferrer" className="font-black text-[color:var(--branch-accent)] underline">새 탭 열기</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadTable({ rows, title }: { rows: LeadRecord[]; title: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[color:var(--branch-border)] bg-white shadow-[var(--branch-shadow)]">
      <div className="border-b border-[color:var(--branch-border)] p-4">
        <h3 className="text-lg font-black text-[color:var(--branch-primary)]">{title}</h3>
      </div>
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
              <td className="p-3">{row.productUrl ? <a href={row.productUrl} target="_blank" rel="noopener noreferrer" className="font-black text-[color:var(--branch-accent)] underline">새 탭 열기</a> : "없음"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EquipmentLeadTable({ rows }: { rows: EquipmentProductLead[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[color:var(--branch-border)] bg-white shadow-[var(--branch-shadow)]">
      <table className="min-w-[1100px] w-full text-left text-sm">
        <thead className="bg-[color:var(--branch-primary)] text-white">
          <tr>
            {["장비", "공급처", "용도", "가격", "상태", "비고", "링크"].map((header) => <th key={header} className="p-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[color:var(--branch-border)] align-top">
              <td className="p-3 font-black text-[color:var(--branch-primary)]">{row.productName}</td>
              <td className="p-3">{row.supplierName}</td>
              <td className="p-3">{row.useFor}</td>
              <td className="p-3">{row.displayedPriceKrw == null ? "견적 필요" : getInfraPriceLabel(row.displayedPriceKrw)}</td>
              <td className="p-3">
                <div className="flex flex-wrap gap-2">
                  <InfraStatusBadge status={row.verificationStatus} />
                  <QuoteRequiredBadge required={row.quoteRequired} label={row.displayedPriceKrw == null ? "전화상담 필요" : "견적 필요"} />
                </div>
              </td>
              <td className="p-3"><NeedsManualCheckBadge note={row.deliveryInstallationNote} /></td>
              <td className="p-3"><a href={row.productUrl} target="_blank" rel="noopener noreferrer" className="font-black text-[color:var(--branch-accent)] underline">상품 상세 열기</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfraCandidateTable({ rows }: { rows: InfraCandidate[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[color:var(--branch-primary)]">{row.name}</h3>
              <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">{row.busanFit ?? "전국 온라인 주문 기반 후보"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <InfraStatusBadge status={row.verificationStatus} />
              <OfficialSourceBadge minimal={row.verificationStatus.includes("minimal")} />
              <QuoteRequiredBadge required={row.quoteRequired} />
            </div>
          </div>
          <p className="mt-3 text-xs font-bold text-[color:var(--branch-ink-muted)]">{row.useFor.join(" · ")}</p>
          <a href={row.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-xl bg-[color:var(--branch-primary)] px-4 py-2 text-sm font-black text-white">
            공식 페이지 열기
          </a>
        </article>
      ))}
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
