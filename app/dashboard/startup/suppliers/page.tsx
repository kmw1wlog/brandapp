"use client";

import { useState } from "react";
import { GroupbuyReservationCard } from "@/components/branch/GroupbuyReservationCard";
import { LocationCriteriaCards } from "@/components/branch/LocationCriteriaCards";
import { PageHeader } from "@/components/branch/Common";
import { SupplierTable } from "@/components/branch/SupplierTable";
import { SupplierTabs } from "@/components/branch/SupplierTabs";
import { getDashboardCopy, getGroupbuyCandidates, getLocationCriteria, getSupplierCandidates } from "@/lib/branch/data";

export default function SuppliersPage() {
  const copy = getDashboardCopy().screens.suppliers;
  const [tab, setTab] = useState("식재료 공급처");
  const suppliers = getSupplierCandidates();
  const filtered = tab === "포장재/주방기기" ? suppliers.filter((item) => item.category !== "food") : suppliers.filter((item) => item.category === "food");

  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <SupplierTabs value={tab} onChange={setTab} />
      {tab === "공동구매" ? (
        <div className="grid gap-4 md:grid-cols-2">{getGroupbuyCandidates().map((item) => <GroupbuyReservationCard key={item.id} item={item} />)}</div>
      ) : tab === "입지 기준" ? (
        <LocationCriteriaCards criteria={getLocationCriteria()} />
      ) : (
        <SupplierTable suppliers={filtered} />
      )}
    </div>
  );
}
