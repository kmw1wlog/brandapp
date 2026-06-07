"use client";

import { useState } from "react";
import { OpeningTimeline } from "@/components/branch/OpeningTimeline";
import { PageHeader } from "@/components/branch/Common";
import { getDashboardCopy, getOpeningTasks } from "@/lib/branch/data";
import { trackEvent } from "@/lib/branch/events";

export default function TimetablePage() {
  const copy = getDashboardCopy().screens.timetable;
  const [saved, setSaved] = useState(false);
  function save() {
    trackEvent("timetable_saved");
    setSaved(true);
  }
  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#ddd2c0] bg-white p-4 text-sm font-bold">
        <span>목표 오픈일</span>
        <button className="rounded-md bg-[#164033] px-3 py-2 text-white">2주 뒤</button>
        <button className="rounded-md bg-[#eee6d8] px-3 py-2">1개월 뒤</button>
        <input type="date" className="rounded-md border border-[#ddd2c0] px-3 py-2" />
        <button onClick={save} className="rounded-md bg-[#b8642f] px-3 py-2 text-white">{saved ? "타임테이블 저장됨" : "타임테이블 저장"}</button>
      </div>
      <OpeningTimeline tasks={getOpeningTasks()} />
    </div>
  );
}
