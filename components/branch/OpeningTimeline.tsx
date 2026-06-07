"use client";

import { useState } from "react";
import type { OpeningTask } from "@/lib/branch/types";
import { TimelineTaskCard } from "./TimelineTaskCard";

export function OpeningTimeline({ tasks }: { tasks: OpeningTask[] }) {
  const [filter, setFilter] = useState("전체");
  const filtered = filter === "전체" ? tasks : tasks.filter((task) => task.day === filter);
  const filters = ["전체", "D-30", "D-14", "D-7", "D-day"];
  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-sm font-black ${filter === item ? "bg-[#164033] text-white" : "bg-white text-[#574d42]"}`}>{item}</button>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((task) => <TimelineTaskCard key={task.id} task={task} />)}
      </div>
    </section>
  );
}
