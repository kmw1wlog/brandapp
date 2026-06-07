"use client";

import { getDefaultBrand } from "@/lib/branch/data";
import type { Appointment, AppointmentInput, ConsultationLead, FeedbackEntry, TimelineState, TimelineTaskStatus } from "../types";
import type { BranchStorageAdapter } from "./types";

const SELECTED_BRAND_KEY = "branch_selected_brand_v2";
const TIMELINE_V2_KEY = "branch_timeline_v2";
const TIMELINE_KEY = "branch_timeline_v3";
const APPOINTMENT_KEY = "branch_appointments_v3";
const LEAD_KEY = "branch_consultation_leads_v2";
const FEEDBACK_KEY = "branch_feedback_v2";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

function fallbackTimeline(): TimelineState {
  const selectedBrandId = readJson<string>(SELECTED_BRAND_KEY, getDefaultBrand().id);
  const target = new Date();
  target.setDate(target.getDate() + 30);
  const legacy = readJson<Record<string, string>>(TIMELINE_V2_KEY, {});
  const tasks = Object.fromEntries(
    Object.entries(legacy).map(([taskId, value]) => [
      taskId,
      {
        taskId,
        status: normalizeStatus(value)
      }
    ])
  );
  return { version: 3, selectedBrandId, targetOpenDate: target.toISOString().slice(0, 10), tasks };
}

function normalizeStatus(value: string): TimelineTaskStatus {
  if (value === "진행 중") return "in_progress";
  if (value === "상담 대기") return "consultation_waiting";
  if (value === "예약됨") return "booked";
  if (value === "완료") return "completed";
  if (value === "보류") return "blocked";
  if (["pending", "in_progress", "consultation_waiting", "booked", "completed", "blocked"].includes(value)) return value as TimelineTaskStatus;
  return "pending";
}

export function createLocalStorageAdapter(): BranchStorageAdapter {
  return {
    async getSelectedBrand() {
      return readJson<string>(SELECTED_BRAND_KEY, getDefaultBrand().id);
    },
    async saveSelectedBrand(brandId: string) {
      writeJson(SELECTED_BRAND_KEY, brandId);
      const timeline = readJson<TimelineState>(TIMELINE_KEY, fallbackTimeline());
      writeJson(TIMELINE_KEY, { ...timeline, selectedBrandId: brandId });
    },
    async getTimeline() {
      return readJson<TimelineState>(TIMELINE_KEY, fallbackTimeline());
    },
    async saveTimeline(state: TimelineState) {
      writeJson(TIMELINE_KEY, state);
    },
    async getAppointments() {
      return readJson<Appointment[]>(APPOINTMENT_KEY, []);
    },
    async createAppointment(input: AppointmentInput) {
      const appointment: Appointment = {
        ...input,
        id: crypto.randomUUID(),
        status: input.status ?? "booked"
      };
      writeJson(APPOINTMENT_KEY, [...readJson<Appointment[]>(APPOINTMENT_KEY, []), appointment]);
      return appointment;
    },
    async updateAppointment(id: string, patch: Partial<Appointment>) {
      const next = readJson<Appointment[]>(APPOINTMENT_KEY, []).map((appointment) => appointment.id === id ? { ...appointment, ...patch } : appointment);
      writeJson(APPOINTMENT_KEY, next);
    },
    async saveConsultationLead(input) {
      const lead: ConsultationLead = { ...input, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
      writeJson(LEAD_KEY, [...readJson<ConsultationLead[]>(LEAD_KEY, []), lead]);
    },
    async saveFeedback(input) {
      const feedback: FeedbackEntry = { ...input, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
      writeJson(FEEDBACK_KEY, [...readJson<FeedbackEntry[]>(FEEDBACK_KEY, []), feedback]);
    }
  };
}
