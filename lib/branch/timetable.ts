import type { Appointment, AvailabilitySlot, Consultant, MockConsultant, OpeningTask, TimelineState, TimelineTaskState, TimelineTaskStatus } from "./types";

export const statusLabels: Record<TimelineTaskStatus, string> = {
  pending: "대기",
  in_progress: "진행 중",
  consultation_waiting: "상담 대기",
  booked: "예약됨",
  completed: "완료",
  blocked: "보류"
};

export function getTaskState(timeline: TimelineState, task: OpeningTask): TimelineTaskState {
  return timeline.tasks[task.id] ?? { taskId: task.id, status: (task.status_default as TimelineTaskStatus) || "pending" };
}

export function offsetDate(targetOpenDate: string, day: string) {
  const offset = day === "D-day" ? 0 : Number(day.replace("D-", "-"));
  const date = new Date(`${targetOpenDate}T00:00:00`);
  if (Number.isFinite(offset)) date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function statusTone(status: TimelineTaskStatus): "default" | "success" | "warning" | "danger" | "info" {
  if (status === "completed") return "success";
  if (status === "consultation_waiting" || status === "booked") return "warning";
  if (status === "blocked") return "danger";
  if (status === "in_progress") return "info";
  return "default";
}

export function toConsultants(items: MockConsultant[]): Consultant[] {
  return items.map((item, index) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    status: index === 0 ? "active" : item.status === "pending_onboarding" ? "pending_onboarding" : "inactive",
    description: item.description
  }));
}

export function buildAvailabilitySlots(targetOpenDate: string, consultants: Consultant[], appointments: Appointment[]): AvailabilitySlot[] {
  const base = new Date(`${targetOpenDate}T00:00:00`);
  const slots: AvailabilitySlot[] = consultants.flatMap((consultant, consultantIndex) => [7, 8, 9].map((offset, slotIndex) => {
    const start = new Date(base);
    start.setDate(start.getDate() - 30 + offset + consultantIndex);
    start.setHours(10 + slotIndex * 2, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 40);
    const id = `${consultant.id}_${start.toISOString()}`;
    return {
      id,
      consultantId: consultant.id,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      status: consultant.status === "active" ? "available" : "blocked"
    };
  }));

  return slots.map((slot) => {
    const appointment = appointments.find((item) => item.consultantId === slot.consultantId && item.startAt === slot.startAt && item.status !== "cancelled");
    return appointment ? { ...slot, status: "booked" } : slot;
  });
}
