"use client";

import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/branch/events";
import { formatRange } from "@/lib/branch/format";
import type { OpeningTask } from "@/lib/branch/types";

export function TimelineTaskCard({ task }: { task: OpeningTask }) {
  const router = useRouter();
  function consult() {
    trackEvent("consultation_cta_click", { category: task.consultation_category, task_id: task.id });
    router.push(`/dashboard/startup/consultation?category=${encodeURIComponent(task.consultation_category ?? "")}&taskId=${task.id}`);
  }
  return (
    <article className="rounded-lg border border-[#ddd2c0] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-black text-[#b8642f]">{task.day}</p><h3 className="mt-1 font-black text-[#164033]">{task.title}</h3></div>
        <span className="rounded-md bg-[#eee6d8] px-2 py-1 text-xs font-bold">대기</span>
      </div>
      <p className="mt-2 text-sm text-[#655d52]">{task.description}</p>
      <p className="mt-2 text-xs font-bold text-[#655d52]">예상 비용 {formatRange(task.estimated_cost_min, task.estimated_cost_max)} · 산출물 {task.output}</p>
      {task.requires_consultation ? <button onClick={consult} className="mt-3 rounded-md bg-[#b8642f] px-3 py-2 text-xs font-black text-white">상담 신청</button> : null}
    </article>
  );
}
