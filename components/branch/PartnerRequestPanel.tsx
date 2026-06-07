"use client";

import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/branch/events";

export function PartnerRequestPanel() {
  const router = useRouter();
  const actions = ["시공사", "주방설비", "간판"];

  function go(category: string) {
    trackEvent("construction_quote_click", { category });
    router.push(`/dashboard/startup/consultation?category=${encodeURIComponent(category)}`);
  }

  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-[#164033] p-5 text-white">
      <h3 className="text-lg font-black">견적 요청 연결</h3>
      <div className="mt-4 grid gap-2">
        {actions.map((action) => <button key={action} onClick={() => go(action)} className="rounded-lg bg-white px-4 py-3 text-sm font-black text-[#164033]">{action} 견적 요청</button>)}
        <button onClick={() => go("창업 컨설턴트")} className="rounded-lg bg-white/10 px-4 py-3 text-sm font-black">비용 낮춘 버전 상담</button>
      </div>
    </section>
  );
}
