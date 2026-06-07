"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useMemo, useState } from "react";
import type { Appointment, AvailabilitySlot, Consultant } from "@/lib/branch/types";
import { BranchBadge } from "./ui/BranchBadge";
import { BranchButton } from "./ui/BranchButton";
import { BranchCard } from "./ui/BranchCard";
import { BranchModal } from "./ui/BranchModal";

export function ConsultantSchedule({
  consultants,
  slots,
  appointments,
  selectedCategory,
  selectedConsultantId,
  onSelectConsultant,
  onSelectCategory,
  onBookSlot,
  onCancelAppointment
}: {
  consultants: Consultant[];
  slots: AvailabilitySlot[];
  appointments: Appointment[];
  selectedCategory: string;
  selectedConsultantId: string;
  onSelectConsultant: (consultantId: string) => void;
  onSelectCategory: (category: string) => void;
  onBookSlot?: (slot: AvailabilitySlot) => void;
  onCancelAppointment?: (appointment: Appointment) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<AvailabilitySlot | undefined>();
  const categories = ["전체", ...Array.from(new Set(consultants.map((consultant) => consultant.category)))];
  const visibleConsultants = consultants.filter((consultant) => selectedCategory === "전체" || consultant.category === selectedCategory);
  const visibleSlots = slots.filter((slot) => slot.consultantId === selectedConsultantId);
  const activeAppointment = activeSlot ? appointments.find((item) => item.consultantId === activeSlot.consultantId && item.startAt === activeSlot.startAt && item.status !== "cancelled") : undefined;

  const events = useMemo(() => visibleSlots.map((slot) => {
    const consultant = consultants.find((item) => item.id === slot.consultantId);
    const appointment = appointments.find((item) => item.consultantId === slot.consultantId && item.startAt === slot.startAt && item.status !== "cancelled");
    const status = appointment?.status ?? slot.status;
    return {
      id: slot.id,
      title: `${consultant?.name ?? "상담사"} · ${statusLabel(status)}`,
      start: slot.startAt,
      end: slot.endAt,
      backgroundColor: statusColor(status),
      borderColor: statusColor(status),
      extendedProps: { slot }
    };
  }), [appointments, consultants, visibleSlots]);

  return (
    <div className="grid gap-4">
      <BranchCard>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => onSelectCategory(category)} className={`rounded-xl px-3 py-2 text-sm font-black ${selectedCategory === category ? "bg-[color:var(--branch-primary)] text-white" : "bg-[color:var(--branch-surface-muted)] text-[color:var(--branch-ink-muted)]"}`}>{category}</button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleConsultants.map((consultant) => (
            <button key={consultant.id} type="button" onClick={() => onSelectConsultant(consultant.id)} className={`rounded-xl border px-3 py-2 text-left text-sm ${selectedConsultantId === consultant.id ? "border-[color:var(--branch-primary)] bg-[color:var(--branch-primary)] text-white" : "border-[color:var(--branch-border)] bg-white text-[color:var(--branch-ink)]"}`}>
              <span className="font-black">{consultant.name}</span>
              <span className="ml-2 text-xs opacity-75">{consultant.status === "active" ? "예약 가능" : "입점 대기"}</span>
            </button>
          ))}
        </div>
      </BranchCard>
      <BranchCard className="overflow-hidden">
        <div className="mb-3 flex flex-wrap gap-2">
          <BranchBadge tone="success">available 예약 가능</BranchBadge>
          <BranchBadge tone="warning">booked 예약됨</BranchBadge>
          <BranchBadge>blocked 입점 대기</BranchBadge>
        </div>
        <div className="mb-4 grid gap-2 md:grid-cols-3">
          {visibleSlots.map((slot) => {
            const appointment = appointments.find((item) => item.consultantId === slot.consultantId && item.startAt === slot.startAt && item.status !== "cancelled");
            const status = appointment?.status ?? slot.status;
            return (
              <div key={slot.id} className="rounded-xl border border-[color:var(--branch-border)] bg-[color:var(--branch-surface-muted)] p-3 text-xs font-bold text-[color:var(--branch-ink-muted)]">
                <button
                  type="button"
                  aria-label={`상담 슬롯 ${statusLabel(status)} ${new Date(slot.startAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}`}
                  onClick={() => setActiveSlot(slot)}
                  className="w-full text-left"
                >
                  <span className="block font-black text-[color:var(--branch-primary)]">{new Date(slot.startAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  <span>{statusLabel(status)}</span>
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!appointment && status === "available" && onBookSlot ? <BranchButton type="button" onClick={() => onBookSlot(slot)}>이 슬롯 예약</BranchButton> : null}
                  {appointment && onCancelAppointment ? <BranchButton type="button" variant="secondary" onClick={() => onCancelAppointment(appointment)}>예약 취소</BranchButton> : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="branch-calendar min-h-[520px]">
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            initialDate={visibleSlots[0]?.startAt}
            height="auto"
            locale="ko"
            allDaySlot={false}
            slotMinTime="09:00:00"
            slotMaxTime="18:00:00"
            events={events}
            eventClick={(info) => setActiveSlot(info.event.extendedProps.slot as AvailabilitySlot)}
          />
        </div>
      </BranchCard>
      <BranchModal open={Boolean(activeSlot)} title="상담 슬롯 상세" onClose={() => setActiveSlot(undefined)}>
        {activeSlot ? (
          <div className="grid gap-3 text-sm leading-6 text-[color:var(--branch-ink-muted)]">
            <p><strong>시간:</strong> {new Date(activeSlot.startAt).toLocaleString("ko-KR")} ~ {new Date(activeSlot.endAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</p>
            <p><strong>상태:</strong> {statusLabel(activeAppointment?.status ?? activeSlot.status)}</p>
            {activeAppointment ? <p><strong>점주:</strong> {activeAppointment.userName} · {activeAppointment.brandId}</p> : null}
            <div className="flex flex-wrap gap-2">
              {!activeAppointment && activeSlot.status === "available" && onBookSlot ? <BranchButton type="button" onClick={() => { onBookSlot(activeSlot); setActiveSlot(undefined); }}>이 슬롯 예약</BranchButton> : null}
              {activeAppointment && onCancelAppointment ? <BranchButton type="button" variant="secondary" onClick={() => { onCancelAppointment(activeAppointment); setActiveSlot(undefined); }}>예약 취소</BranchButton> : null}
            </div>
          </div>
        ) : null}
      </BranchModal>
    </div>
  );
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    available: "예약 가능",
    held: "보류",
    booked: "예약됨",
    blocked: "입점 대기",
    completed: "완료",
    cancelled: "취소"
  };
  return labels[status] ?? status;
}

function statusColor(status: string) {
  if (status === "available") return "#0f7b54";
  if (status === "booked" || status === "held") return "#b6721f";
  if (status === "completed") return "#2563eb";
  if (status === "cancelled") return "#9ca3af";
  return "#6b7280";
}
