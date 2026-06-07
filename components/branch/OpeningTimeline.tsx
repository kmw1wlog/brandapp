"use client";

import { useState } from "react";
import type { Appointment, OpeningTask, TimelineState, TimelineTaskStatus } from "@/lib/branch/types";
import { getTaskState, offsetDate, statusLabels } from "@/lib/branch/timetable";
import { TimelineTaskCard } from "./TimelineTaskCard";
import { BranchBadge } from "./ui/BranchBadge";
import { BranchEmptyState } from "./ui/BranchEmptyState";
import { BranchModal } from "./ui/BranchModal";

export function OpeningTimeline({
  tasks,
  timeline,
  appointments,
  onTimelineChange,
  officialLinksByTaskId = {}
}: {
  tasks: OpeningTask[];
  timeline: TimelineState;
  appointments: Appointment[];
  onTimelineChange: (state: TimelineState) => void;
  officialLinksByTaskId?: Record<string, Array<{ label: string; url: string }>>;
}) {
  const [view, setView] = useState<"list" | "week" | "stage">("list");
  const [filter, setFilter] = useState("전체");
  const [detailTask, setDetailTask] = useState<OpeningTask | undefined>();
  const filtered = filter === "전체" ? tasks : tasks.filter((task) => task.day === filter || task.category === filter);
  const filters = ["전체", ...Array.from(new Set(tasks.map((task) => task.day))).slice(0, 6), ...Array.from(new Set(tasks.map((task) => task.category))).slice(0, 4)];
  const completed = tasks.filter((task) => getTaskState(timeline, task).status === "completed").length;
  const progress = Math.round((completed / tasks.length) * 100);

  function patchTask(taskId: string, patch: Partial<ReturnType<typeof getTaskState>>) {
    const current = timeline.tasks[taskId] ?? { taskId, status: "pending" as TimelineTaskStatus };
    onTimelineChange({ ...timeline, tasks: { ...timeline.tasks, [taskId]: { ...current, ...patch, taskId } } });
  }

  function appointmentText(taskId: string) {
    const appointment = appointments.find((item) => item.taskId === taskId && item.status !== "cancelled");
    if (!appointment) return undefined;
    return `상담 예약 ${new Date(appointment.startAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-2xl border border-[color:var(--branch-border)] bg-white p-4 shadow-[var(--branch-shadow)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[color:var(--branch-primary)]">타임라인 진행률 {progress}%</p>
            <div className="mt-2 h-2 w-64 max-w-full overflow-hidden rounded-full bg-[color:var(--branch-surface-muted)]">
              <div className="h-full rounded-full bg-[color:var(--branch-primary)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["list", "week", "stage"] as const).map((item) => <button key={item} type="button" onClick={() => setView(item)} className={`rounded-lg px-3 py-2 text-sm font-black ${view === item ? "bg-[color:var(--branch-primary)] text-white" : "bg-[color:var(--branch-surface-muted)] text-[color:var(--branch-ink-muted)]"}`}>{item === "list" ? "리스트 보기" : item === "week" ? "주간 보기" : "단계별 보기"}</button>)}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-sm font-black ${filter === item ? "bg-[color:var(--branch-primary)] text-white" : "bg-[color:var(--branch-surface-muted)] text-[color:var(--branch-ink-muted)]"}`}>{item}</button>)}
        </div>
      </div>
      {filtered.length === 0 ? <BranchEmptyState title="표시할 태스크가 없습니다" description="필터를 전체로 바꾸면 D-30 프로젝트 전체를 볼 수 있습니다." /> : null}
      <div className={`grid gap-3 ${view === "list" ? "md:grid-cols-2 xl:grid-cols-3" : view === "week" ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        {filtered.map((task) => (
          <TimelineTaskCard
            key={task.id}
            task={task}
            taskState={getTaskState(timeline, task)}
            targetOpenDate={timeline.targetOpenDate}
            appointmentText={appointmentText(task.id)}
            officialLinks={officialLinksByTaskId[task.id] ?? []}
            onStatusChange={(taskId, status) => patchTask(taskId, { status })}
            onDateChange={(taskId, targetDate) => patchTask(taskId, { targetDate })}
            onOpenDetail={setDetailTask}
          />
        ))}
      </div>
      <BranchModal open={Boolean(detailTask)} title={detailTask?.title ?? "태스크 상세"} onClose={() => setDetailTask(undefined)}>
        {detailTask ? (
          <div className="grid gap-3 text-sm leading-6 text-[color:var(--branch-ink-muted)]">
            <p>{detailTask.description}</p>
            <p><strong>기준 날짜:</strong> {detailTask.day} · {offsetDate(timeline.targetOpenDate, detailTask.day)}</p>
            <p><strong>예상비용:</strong> {detailTask.estimated_cost_min.toLocaleString("ko-KR")}원 ~ {detailTask.estimated_cost_max.toLocaleString("ko-KR")}원</p>
            <p><strong>산출물:</strong> {detailTask.output}</p>
            <p><strong>연관 상담:</strong> {detailTask.consultation_category ?? "없음"}</p>
            <div className="flex items-center gap-2"><strong>상담 상태:</strong><BranchBadge>{statusLabels[getTaskState(timeline, detailTask).status]}</BranchBadge></div>
          </div>
        ) : null}
      </BranchModal>
    </section>
  );
}
