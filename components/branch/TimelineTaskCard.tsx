"use client";

import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/branch/events";
import { formatRange } from "@/lib/branch/format";
import { offsetDate, statusLabels, statusTone } from "@/lib/branch/timetable";
import type { OpeningTask, TimelineTaskState, TimelineTaskStatus } from "@/lib/branch/types";
import { BranchBadge } from "./ui/BranchBadge";
import { BranchButton } from "./ui/BranchButton";

const statuses: TimelineTaskStatus[] = ["pending", "in_progress", "consultation_waiting", "booked", "completed", "blocked"];

export function TimelineTaskCard({
  task,
  taskState,
  targetOpenDate,
  appointmentText,
  officialLinks,
  onStatusChange,
  onDateChange,
  onOpenDetail
}: {
  task: OpeningTask;
  taskState: TimelineTaskState;
  targetOpenDate: string;
  appointmentText?: string;
  officialLinks: Array<{ label: string; url: string }>;
  onStatusChange: (taskId: string, status: TimelineTaskStatus) => void;
  onDateChange: (taskId: string, targetDate: string) => void;
  onOpenDetail: (task: OpeningTask) => void;
}) {
  const router = useRouter();
  const taskDate = taskState.targetDate ?? offsetDate(targetOpenDate, task.day);
  function consult() {
    trackEvent("consultation_cta_click", { category: task.consultation_category, task_id: task.id });
    router.push(`/dashboard/startup/consultation?category=${encodeURIComponent(task.consultation_category ?? "")}&taskId=${task.id}`);
  }
  return (
    <article className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-4 shadow-[var(--branch-shadow)]">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-black text-[color:var(--branch-accent)]">{task.day} · {taskDate}</p><h3 className="mt-1 font-black text-[color:var(--branch-primary)]">{task.title}</h3></div>
        <BranchBadge tone={statusTone(taskState.status)}>{statusLabels[taskState.status]}</BranchBadge>
      </div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--branch-ink-muted)]">{task.description}</p>
      <p className="mt-2 text-xs font-bold text-[color:var(--branch-ink-muted)]">예상 비용 {formatRange(task.estimated_cost_min, task.estimated_cost_max)} · 산출물 {task.output}</p>
      {appointmentText ? <p className="mt-2 rounded-lg bg-emerald-50 p-2 text-xs font-black text-emerald-800">{appointmentText}</p> : null}
      <div className="mt-3 grid gap-2">
        <label className="grid gap-1 text-xs font-black text-[color:var(--branch-ink-muted)]">
          태스크 날짜
          <input type="date" value={taskDate} onChange={(event) => onDateChange(task.id, event.target.value)} className="rounded-lg border border-[color:var(--branch-border)] px-3 py-2 text-sm" />
        </label>
        <div className="flex flex-wrap gap-1">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(task.id, status)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-black ${taskState.status === status ? "bg-[color:var(--branch-primary)] text-white" : "bg-[color:var(--branch-surface-muted)] text-[color:var(--branch-ink-muted)]"}`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <BranchButton type="button" variant="secondary" className="px-3 py-2 text-xs" onClick={() => onOpenDetail(task)}>상세</BranchButton>
        {task.requires_consultation ? <BranchButton type="button" className="px-3 py-2 text-xs" onClick={consult}>상담 신청</BranchButton> : null}
        {officialLinks.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl border border-[color:var(--branch-border)] bg-white px-3 py-2 text-xs font-black text-[color:var(--branch-primary)]">
            공식 링크: {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}
