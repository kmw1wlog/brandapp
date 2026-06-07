"use client";

import { useEffect, useState } from "react";
import { OpeningTimeline } from "@/components/branch/OpeningTimeline";
import { PageHeader } from "@/components/branch/Common";
import { getDashboardCopy, getDefaultBrand, getOpeningTasks } from "@/lib/branch/data";
import { trackEvent } from "@/lib/branch/events";
import { getBranchStorage } from "@/lib/branch/storage";
import type { Appointment, TimelineState } from "@/lib/branch/types";

export default function TimetablePage() {
  const copy = getDashboardCopy().screens.timetable;
  const [timeline, setTimeline] = useState<TimelineState>(createFallbackTimeline());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storage = getBranchStorage();
    Promise.all([storage.getTimeline(), storage.getAppointments()]).then(([nextTimeline, nextAppointments]) => {
      setTimeline(nextTimeline ?? createFallbackTimeline());
      setAppointments(nextAppointments ?? []);
    });
  }, []);

  function updateTimeline(next: TimelineState) {
    setTimeline(next);
    setSaved(false);
    getBranchStorage().saveTimeline(next);
  }

  function save() {
    if (timeline) getBranchStorage().saveTimeline(timeline);
    trackEvent("timetable_saved");
    setSaved(true);
  }

  function reset() {
    getBranchStorage().getSelectedBrand().then((selectedBrandId) => {
      const target = new Date();
      target.setDate(target.getDate() + 30);
      updateTimeline({ version: 3, selectedBrandId, targetOpenDate: target.toISOString().slice(0, 10), tasks: {} });
    });
  }

  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--branch-border)] bg-white p-4 text-sm font-bold shadow-[var(--branch-shadow)]">
        <span>목표 오픈일</span>
        <button type="button" onClick={() => timeline && updateTimeline({ ...timeline, targetOpenDate: addDays(14) })} className="rounded-md bg-[color:var(--branch-surface-muted)] px-3 py-2">2주 뒤</button>
        <button type="button" onClick={() => timeline && updateTimeline({ ...timeline, targetOpenDate: addDays(30) })} className="rounded-md bg-[color:var(--branch-primary)] px-3 py-2 text-white">1개월 뒤</button>
        <input type="date" value={timeline?.targetOpenDate ?? ""} onChange={(event) => timeline && updateTimeline({ ...timeline, targetOpenDate: event.target.value })} className="rounded-md border border-[color:var(--branch-border)] px-3 py-2" />
        <button onClick={save} className="rounded-md bg-[color:var(--branch-accent)] px-3 py-2 text-white">{saved ? "저장 완료" : "저장"}</button>
        <button onClick={reset} className="rounded-md border border-[color:var(--branch-border)] px-3 py-2">초기화</button>
      </div>
      <OpeningTimeline tasks={getOpeningTasks()} timeline={timeline} appointments={appointments} onTimelineChange={updateTimeline} />
    </div>
  );
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createFallbackTimeline(): TimelineState {
  return {
    version: 3,
    selectedBrandId: getDefaultBrand().id,
    targetOpenDate: addDays(30),
    tasks: {}
  };
}
