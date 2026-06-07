"use client";

import { useEffect, useState } from "react";
import { exportBetaData } from "@/lib/branch/events";

export function BetaMetricsPanel() {
  const [data, setData] = useState<ReturnType<typeof exportBetaData> | null>(null);
  useEffect(() => setData(exportBetaData()), []);
  if (!data) return null;

  const count = (name: string) => data.events.filter((event) => event.event_name === name).length;
  const categories = data.consultationLeads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.category] = (acc[lead.category] ?? 0) + 1;
    return acc;
  }, {});

  function download() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "branch-beta-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="총 이벤트" value={data.events.length} />
        <Metric label="브랜드 클릭" value={count("own_brand_detail_click")} />
        <Metric label="프랜차이즈 클릭" value={count("franchise_detail_click")} />
        <Metric label="상담 CTA" value={count("consultation_cta_click")} />
        <Metric label="상담 신청 완료" value={count("consultation_waitlist_submit")} />
        <Metric label="공동구매 예약" value={count("groupbuy_reservation_click")} />
        <Metric label="피드백 제출" value={count("feedback_submit")} />
        <Metric label="리포트 저장" value={count("report_save_click")} />
      </div>
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <h3 className="text-xl font-black text-[#164033]">연락처 남긴 리드</h3>
        <div className="mt-3 grid gap-2 text-sm">{data.consultationLeads.map((lead) => <p key={lead.id}>{lead.name} · {lead.contact} · {lead.category}</p>)}</div>
        <p className="mt-4 text-sm font-bold text-[#655d52]">상담 카테고리별: {Object.entries(categories).map(([key, value]) => `${key} ${value}`).join(", ") || "없음"}</p>
        <button onClick={download} className="mt-4 rounded-lg bg-[#164033] px-4 py-3 text-sm font-black text-white">JSON export</button>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-[#ddd2c0] bg-white p-4"><p className="text-xs font-bold text-[#655d52]">{label}</p><p className="mt-1 text-2xl font-black text-[#164033]">{value}</p></div>;
}
