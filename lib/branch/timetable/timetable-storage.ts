"use client";

import { BRANCH_TIMELINE_KEY } from "@/lib/branch/storage/startup-flow-storage";
import type { TimelineState } from "@/lib/branch/types";

export function readDynamicTimeline(fallback: TimelineState) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(BRANCH_TIMELINE_KEY);
    return raw ? (JSON.parse(raw) as TimelineState) : fallback;
  } catch {
    return fallback;
  }
}

export function saveDynamicTimeline(state: TimelineState) {
  if (typeof window !== "undefined") window.localStorage.setItem(BRANCH_TIMELINE_KEY, JSON.stringify(state));
}
