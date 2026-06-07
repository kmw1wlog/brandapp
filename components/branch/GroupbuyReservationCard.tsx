"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/branch/events";
import type { GroupbuyCandidate } from "@/lib/branch/types";

export function GroupbuyReservationCard({ item }: { item: GroupbuyCandidate }) {
  const [saved, setSaved] = useState(false);
  const progress = Math.min(100, (item.current_interest_count / item.target_buyers) * 100);

  function reserve() {
    localStorage.setItem(`branch_groupbuy_${item.id}`, JSON.stringify({ quantity: 20, timestamp: new Date().toISOString() }));
    trackEvent("groupbuy_reservation_click", { groupbuyId: item.id });
    setSaved(true);
  }

  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-xl font-black text-[#164033]">{item.item_name}</h3>
      <div className="mt-3 grid gap-2 text-sm">
        <p>현재 관심자 {item.current_interest_count}명 · 목표 {item.target_buyers}명</p>
        <p>목표 물량 {item.target_quantity.toLocaleString("ko-KR")}{item.unit}</p>
        <p>예상 절감률 {item.estimated_discount_rate_min}~{item.estimated_discount_rate_max}%</p>
      </div>
      <div className="mt-4 h-3 rounded-full bg-[#eee5d7]"><div className="h-3 rounded-full bg-[#b8642f]" style={{ width: `${progress}%` }} /></div>
      <label className="mt-4 grid gap-1 text-sm font-bold">월 사용량<input className="rounded-md border border-[#ddd2c0] p-2" defaultValue="20kg" /></label>
      <button onClick={reserve} className="mt-3 rounded-lg bg-[#164033] px-4 py-3 text-sm font-black text-white">{saved ? "공동구매 예약 저장됨" : item.cta_copy}</button>
    </section>
  );
}
