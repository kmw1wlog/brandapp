"use client";

import { useState } from "react";
import { GroupbuyReservationCard } from "@/components/branch/GroupbuyReservationCard";
import { LocationCriteriaCards } from "@/components/branch/LocationCriteriaCards";
import { PageHeader } from "@/components/branch/Common";
import { SupplierTable } from "@/components/branch/SupplierTable";
import { SupplierTabs } from "@/components/branch/SupplierTabs";
import { BranchEmptyState } from "@/components/branch/ui/BranchEmptyState";
import { getDashboardCopy, getGroupbuyCandidates, getLocationCriteria, getSupplierCandidates } from "@/lib/branch/data";

export default function SuppliersPage() {
  const copy = getDashboardCopy().screens.suppliers;
  const [tab, setTab] = useState("식재료");
  const suppliers = getSupplierCandidates();
  const filtered = suppliers.filter((item) => {
    if (tab === "식재료") return item.category === "food";
    if (tab === "포장재") return item.category === "packaging";
    if (tab === "주방기기") return item.category === "equipment";
    return false;
  });

  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <SupplierTabs value={tab} onChange={setTab} />
      {tab === "공동구매" ? (
        <div className="grid gap-4 md:grid-cols-2">{getGroupbuyCandidates().map((item) => <GroupbuyReservationCard key={item.id} item={item} />)}</div>
      ) : tab === "입지 기준" ? (
        <LocationCriteriaCards criteria={getLocationCriteria()} />
      ) : (
        filtered.length > 0 ? <SupplierTable suppliers={filtered} /> : <BranchEmptyState title="표시할 후보가 없습니다" description="현재 샘플 JSON에 해당 카테고리 후보가 없으면 빈 상태로 표시합니다." />
      )}
    </div>
  );
}
