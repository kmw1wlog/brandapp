"use client";

import { useMemo, useState } from "react";
import { InfraStatusBadge } from "@/components/branch/data/InfraStatusBadge";
import { NeedsManualCheckBadge } from "@/components/branch/data/NeedsManualCheckBadge";
import { QuoteRequiredBadge } from "@/components/branch/data/QuoteRequiredBadge";
import { getInfraPriceLabel, shouldShowQuoteRequired } from "@/lib/branch/infra/infra-quality";
import type { EquipmentProductLead } from "@/lib/branch/infra/infra-types";

export function InfraEquipmentLeadSection({ items }: { items: EquipmentProductLead[] }) {
  const [includeEquipment, setIncludeEquipment] = useState(false);
  const confirmedTotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.displayedPriceKrw ?? 0), 0),
    [items]
  );

  return (
    <section className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[color:var(--branch-primary)]">장비 후보 표</h3>
          <p className="mt-1 text-sm font-bold text-[color:var(--branch-ink-muted)]">장비 가격은 기본적으로 초기투자비에 자동 합산하지 않습니다.</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-black text-[color:var(--branch-primary)]">
          <input type="checkbox" checked={includeEquipment} onChange={(event) => setIncludeEquipment(event.target.checked)} />
          장비 후보 포함
        </label>
      </div>
      {includeEquipment ? (
        <p className="mt-3 rounded-xl bg-[color:var(--branch-surface-muted)] p-3 text-sm font-black text-[color:var(--branch-primary)]">
          확인된 장비 후보 합계 {confirmedTotal.toLocaleString("ko-KR")}원
          <span className="ml-2 text-xs text-[color:var(--branch-ink-muted)]">배송·설치비는 별도 미확인</span>
        </p>
      ) : null}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="bg-[color:var(--branch-primary)] text-white">
            <tr>
              {["장비", "공급처", "용도", "표시가격", "상태", "비고", "링크"].map((item) => <th key={item} className="p-3">{item}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-[color:var(--branch-border)] align-top">
                <td className="p-3 font-black text-[color:var(--branch-primary)]">{item.productName}</td>
                <td className="p-3">{item.supplierName}</td>
                <td className="p-3">{item.useFor}</td>
                <td className="p-3">{item.displayedPriceKrw == null ? "전화상담/견적 필요" : getInfraPriceLabel(item.displayedPriceKrw)}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <InfraStatusBadge status={item.verificationStatus} />
                    <QuoteRequiredBadge required={shouldShowQuoteRequired(item)} label={item.displayedPriceKrw == null ? "전화상담 필요" : "견적 필요"} />
                  </div>
                </td>
                <td className="p-3"><NeedsManualCheckBadge note={item.deliveryInstallationNote} /></td>
                <td className="p-3">
                  <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="font-black text-[color:var(--branch-accent)] underline">
                    상품 상세 열기
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
