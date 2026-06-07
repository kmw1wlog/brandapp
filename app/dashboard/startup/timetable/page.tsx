"use client";

import { useEffect, useState } from "react";
import { OpeningTimeline } from "@/components/branch/OpeningTimeline";
import { PageHeader } from "@/components/branch/Common";
import { getDashboardCopy, getDefaultBrand } from "@/lib/branch/data";
import { getMergedInfraData } from "@/lib/branch/infra/merge-infra-data";
import { trackEvent } from "@/lib/branch/events";
import { getBranchStorage } from "@/lib/branch/storage";
import type { Appointment, TimelineState } from "@/lib/branch/types";
import { generateTimetable } from "@/lib/branch/timetable/generate-timetable";
import { preserveTaskState } from "@/lib/branch/timetable/reschedule-task";
import { readDynamicTimeline, saveDynamicTimeline } from "@/lib/branch/timetable/timetable-storage";
import { readStartupInput, saveStartupInput } from "@/lib/branch/storage/startup-flow-storage";
import { normalizeStartupInput } from "@/lib/branch/user-input";
import type { OpeningTarget } from "@/lib/branch/finance/finance-types";

export default function TimetablePage() {
  const copy = getDashboardCopy().screens.timetable;
  const infra = getMergedInfraData();
  const [openingTarget, setOpeningTarget] = useState<OpeningTarget>({ type: "days_from_now", days: 45 });
  const generated = generateTimetable(openingTarget);
  const [timeline, setTimeline] = useState<TimelineState>(createFallbackTimeline(generated.targetOpenDate));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [saved, setSaved] = useState(false);
  const officialLinksByTaskId = getOfficialLinksByTaskId(infra);

  useEffect(() => {
    const storage = getBranchStorage();
    const input = readStartupInput();
    const nextGenerated = generateTimetable(input.opening_target);
    setOpeningTarget(input.opening_target);
    Promise.all([storage.getAppointments()]).then(([nextAppointments]) => {
      setTimeline(readDynamicTimeline(createFallbackTimeline(nextGenerated.targetOpenDate)));
      setAppointments(nextAppointments ?? []);
    });
  }, []);

  function updateTimeline(next: TimelineState) {
    setTimeline(next);
    setSaved(false);
    getBranchStorage().saveTimeline(next);
    saveDynamicTimeline(next);
  }

  function save() {
    if (timeline) getBranchStorage().saveTimeline(timeline);
    trackEvent("timetable_saved");
    setSaved(true);
  }

  function reset() {
    getBranchStorage().getSelectedBrand().then((selectedBrandId) => {
      const target: OpeningTarget = { type: "days_from_now", days: 45 };
      const nextGenerated = generateTimetable(target);
      const input = normalizeStartupInput({ ...readStartupInput(), opening_target: target });
      saveStartupInput(input);
      setOpeningTarget(target);
      updateTimeline({ version: 3, selectedBrandId, targetOpenDate: nextGenerated.targetOpenDate, tasks: {} });
    });
  }

  function changeOpeningTarget(target: OpeningTarget) {
    const nextGenerated = generateTimetable(target);
    const input = normalizeStartupInput({ ...readStartupInput(), opening_target: target });
    saveStartupInput(input);
    setOpeningTarget(target);
    updateTimeline({
      ...timeline,
      targetOpenDate: nextGenerated.targetOpenDate,
      tasks: preserveTaskState(timeline, nextGenerated.tasks.map((task) => task.id))
    });
  }

  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--branch-border)] bg-white p-4 text-sm font-bold shadow-[var(--branch-shadow)]">
        <span>목표 오픈일 {generated.targetOpenDate}</span>
        <span className="rounded-md bg-[color:var(--branch-surface-muted)] px-3 py-2">준비기간 {generated.preparationDays}일 · {generated.variantLabel}</span>
        <button type="button" onClick={() => changeOpeningTarget({ type: "days_from_now", days: 14 })} className="rounded-md bg-[color:var(--branch-surface-muted)] px-3 py-2">2주 뒤</button>
        <button type="button" onClick={() => changeOpeningTarget({ type: "days_from_now", days: 45 })} className="rounded-md bg-[color:var(--branch-primary)] px-3 py-2 text-white">45일 뒤</button>
        <input type="date" value={timeline?.targetOpenDate ?? ""} onChange={(event) => changeOpeningTarget({ type: "date", date: event.target.value })} className="rounded-md border border-[color:var(--branch-border)] px-3 py-2" />
        <button onClick={save} className="rounded-md bg-[color:var(--branch-accent)] px-3 py-2 text-white">{saved ? "저장 완료" : "저장"}</button>
        <button onClick={reset} className="rounded-md border border-[color:var(--branch-border)] px-3 py-2">초기화</button>
      </div>
      <p className="rounded-xl bg-[color:var(--branch-surface-muted)] p-4 text-sm font-bold text-[color:var(--branch-ink-muted)]">Finance의 월 0 지출은 개점 전 현금잔고와 연결해 확인합니다.</p>
      <OpeningTimeline tasks={generated.tasks} timeline={timeline} appointments={appointments} onTimelineChange={updateTimeline} officialLinksByTaskId={officialLinksByTaskId} />
    </div>
  );
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createFallbackTimeline(targetOpenDate = addDays(45)): TimelineState {
  return {
    version: 3,
    selectedBrandId: getDefaultBrand().id,
    targetOpenDate,
    tasks: {}
  };
}

function getOfficialLinksByTaskId(infra: ReturnType<typeof getMergedInfraData>) {
  const byName = new Map(
    [...infra.permitLawRefs, ...infra.locationAndPublicDataRefs, ...infra.posPaymentDeliveryCandidates, ...infra.operatingCostRefs]
      .filter((item) => item.officialUrl)
      .map((item) => [item.name, item.officialUrl as string])
  );

  return {
    task_003: [
      { label: "공공데이터포털", url: byName.get("공공데이터포털") ?? "#" },
      { label: "세움터", url: byName.get("세움터") ?? "#" },
      { label: "토지이음", url: byName.get("토지이음") ?? "#" }
    ],
    task_009: [
      { label: "한국외식업중앙회", url: byName.get("한국외식업중앙회") ?? "#" },
      { label: "e보건소", url: byName.get("e보건소") ?? "#" },
      { label: "정부24", url: byName.get("정부24") ?? "#" }
    ],
    task_010: [
      { label: "국세청 홈택스", url: byName.get("국세청 홈택스") ?? "#" }
    ],
    task_012: [
      { label: "배민외식업광장", url: byName.get("배민외식업광장") ?? "#" },
      { label: "쿠팡이츠 사장님 포털", url: byName.get("쿠팡이츠 사장님 포털") ?? "#" }
    ],
    task_013: [
      { label: "2026 최저임금", url: byName.get("2026 최저임금") ?? "#" }
    ]
  } satisfies Record<string, Array<{ label: string; url: string }>>;
}
