"use client";

import type { BetaSignup, BranchEvent, ConsultationLead, FeedbackEntry } from "./types";

const EVENT_KEY = "branch_events_v2";
const LEAD_KEY = "branch_consultation_leads_v2";
const FEEDBACK_KEY = "branch_feedback_v2";
const BETA_SIGNUP_KEY = "branch_beta_signups_v1";
const SELECTED_BRAND_KEY = "branch_selected_brand_v2";
const TIMELINE_KEY = "branch_timeline_v2";
const OWNER_PREVIEW_KEY = "branch_owner_preview_v2";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export function trackEvent(eventName: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const event: BranchEvent = {
    event_name: eventName,
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname + window.location.search,
    scenario_id: "busan_meatbowl_001",
    selected_brand_id: readJson<string | undefined>(SELECTED_BRAND_KEY, undefined),
    metadata
  };
  writeJson(EVENT_KEY, [...getEvents(), event]);
}

export function getEvents() {
  return readJson<BranchEvent[]>(EVENT_KEY, []);
}

export function saveConsultationLead(lead: Omit<ConsultationLead, "id" | "timestamp">) {
  const next: ConsultationLead = { ...lead, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
  writeJson(LEAD_KEY, [...getConsultationLeads(), next]);
  return next;
}

export function getConsultationLeads() {
  return readJson<ConsultationLead[]>(LEAD_KEY, []);
}

export function saveFeedback(entry: Omit<FeedbackEntry, "id" | "timestamp">) {
  const next: FeedbackEntry = { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
  writeJson(FEEDBACK_KEY, [...getFeedback(), next]);
  return next;
}

export function getFeedback() {
  return readJson<FeedbackEntry[]>(FEEDBACK_KEY, []);
}

export function saveBetaSignup(input: Omit<BetaSignup, "id" | "timestamp" | "pagePath">) {
  const next: BetaSignup = {
    ...input,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    pagePath: typeof window === "undefined" ? undefined : window.location.pathname + window.location.search
  };
  writeJson(BETA_SIGNUP_KEY, [...getBetaSignups(), next]);
  return next;
}

export function getBetaSignups() {
  return readJson<BetaSignup[]>(BETA_SIGNUP_KEY, []);
}

export function saveSelectedBrand(brandId: string) {
  writeJson(SELECTED_BRAND_KEY, brandId);
}

export function getSelectedBrandId() {
  return readJson<string>(SELECTED_BRAND_KEY, "brand_yukbanjang");
}

export function saveTimelineStatus(taskId: string, status: string) {
  const current = readJson<Record<string, string>>(TIMELINE_KEY, {});
  writeJson(TIMELINE_KEY, { ...current, [taskId]: status });
}

export function getTimelineStatus() {
  return readJson<Record<string, string>>(TIMELINE_KEY, {});
}

export function saveOwnerPreviewInterest(value = true) {
  writeJson(OWNER_PREVIEW_KEY, value);
}

export function exportBetaData() {
  return {
    events: getEvents(),
    consultationLeads: getConsultationLeads(),
    feedback: getFeedback(),
    betaSignups: getBetaSignups(),
    timeline: getTimelineStatus(),
    selectedBrand: getSelectedBrandId(),
    ownerPreview: readJson<boolean>(OWNER_PREVIEW_KEY, false)
  };
}
