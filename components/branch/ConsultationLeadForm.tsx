"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConsultantSchedule } from "./ConsultantSchedule";
import { getBrandOptions, getConsultantCategories, getMockConsultants } from "@/lib/branch/data";
import { saveConsultationLead, saveTimelineStatus, trackEvent } from "@/lib/branch/events";
import { getBranchStorage } from "@/lib/branch/storage";
import { buildAvailabilitySlots, toConsultants } from "@/lib/branch/timetable";
import type { Appointment, AvailabilitySlot, TimelineState } from "@/lib/branch/types";

export function ConsultationLeadForm() {
  const params = useSearchParams();
  const categories = getConsultantCategories();
  const brands = getBrandOptions();
  const consultants = useMemo(() => toConsultants(getMockConsultants()), []);
  const initialCategory = normalizeCategory(params.get("category") ?? categories[0]?.name ?? "시공사");
  const [saved, setSaved] = useState(false);
  const [bookingSaved, setBookingSaved] = useState(false);
  const [timeline, setTimeline] = useState<TimelineState | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedConsultantId, setSelectedConsultantId] = useState(consultants.find((item) => item.category === selectedCategory)?.id ?? consultants[0]?.id ?? "");
  const [user, setUser] = useState({ name: "", contact: "", brandId: brands[0]?.id ?? "brand_yukbanjang", concern: "" });
  const taskId = params.get("taskId") ?? undefined;

  useEffect(() => {
    const storage = getBranchStorage();
    Promise.all([storage.getTimeline(), storage.getAppointments(), storage.getSelectedBrand()]).then(([nextTimeline, nextAppointments, brandId]) => {
      setTimeline(nextTimeline);
      setAppointments(nextAppointments);
      setUser((current) => ({ ...current, brandId }));
    });
  }, []);

  useEffect(() => {
    const next = consultants.find((item) => selectedCategory === "전체" || item.category === selectedCategory);
    if (next) setSelectedConsultantId(next.id);
  }, [consultants, selectedCategory]);

  const slots = buildAvailabilitySlots(timeline?.targetOpenDate ?? new Date().toISOString().slice(0, 10), consultants, appointments);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lead = {
      name: String(form.get("name") ?? ""),
      contact: String(form.get("contact") ?? ""),
      region: String(form.get("region") ?? ""),
      capital: String(form.get("capital") ?? ""),
      openDate: String(form.get("openDate") ?? ""),
      category: String(form.get("category") ?? ""),
      brandId: String(form.get("brandId") ?? ""),
      concern: String(form.get("concern") ?? ""),
      taskId
    };
    saveConsultationLead(lead);
    getBranchStorage().saveConsultationLead(lead);
    if (taskId) saveTimelineStatus(taskId, "상담 대기");
    if (taskId && timeline) {
      const next = {
        ...timeline,
        tasks: {
          ...timeline.tasks,
          [taskId]: { ...(timeline.tasks[taskId] ?? { taskId }), taskId, status: "consultation_waiting" as const }
        }
      };
      setTimeline(next);
      getBranchStorage().saveTimeline(next);
    }
    trackEvent("consultation_waitlist_submit", { category: String(form.get("category") ?? ""), task_id: taskId });
    setSaved(true);
  }

  async function book(slot: AvailabilitySlot) {
    if (!timeline) return;
    const appointment = await getBranchStorage().createAppointment({
      consultantId: slot.consultantId,
      taskId,
      categoryId: selectedCategory,
      startAt: slot.startAt,
      endAt: slot.endAt,
      userName: user.name || "데모 점주",
      contact: user.contact || "demo@example.com",
      brandId: user.brandId,
      note: user.concern
    });
    const next = taskId ? {
      ...timeline,
      tasks: {
        ...timeline.tasks,
        [taskId]: { ...(timeline.tasks[taskId] ?? { taskId }), taskId, status: "booked" as const, appointmentId: appointment.id }
      }
    } : timeline;
    setAppointments([...appointments, appointment]);
    setTimeline(next);
    await getBranchStorage().saveTimeline(next);
    if (taskId) saveTimelineStatus(taskId, "예약됨");
    trackEvent("consultation_slot_booked", { task_id: taskId, consultantId: slot.consultantId });
    setBookingSaved(true);
  }

  async function cancel(appointment: Appointment) {
    await getBranchStorage().updateAppointment(appointment.id, { status: "cancelled" });
    const nextAppointments = appointments.map((item) => item.id === appointment.id ? { ...item, status: "cancelled" as const } : item);
    setAppointments(nextAppointments);
    if (timeline && appointment.taskId) {
      const next = {
        ...timeline,
        tasks: {
          ...timeline.tasks,
          [appointment.taskId]: { ...(timeline.tasks[appointment.taskId] ?? { taskId: appointment.taskId }), taskId: appointment.taskId, status: "consultation_waiting" as const, appointmentId: undefined }
        }
      };
      setTimeline(next);
      await getBranchStorage().saveTimeline(next);
      saveTimelineStatus(appointment.taskId, "상담 대기");
    }
    trackEvent("consultation_slot_cancelled", { task_id: appointment.taskId, consultantId: appointment.consultantId });
  }

  if (saved) {
    return <p className="rounded-lg bg-[#e8f3eb] p-5 text-sm font-bold leading-6 text-[#164033]">상담 대기 신청이 완료되었습니다. 입점 대기 상담사는 확정 예약 대신 알림 신청과 질문 템플릿 저장으로 처리했습니다.</p>;
  }

  return (
    <div className="grid gap-5">
      {taskId ? <p className="rounded-xl bg-[color:var(--branch-accent-soft)] p-3 text-sm font-black text-[color:var(--branch-accent)]">연결된 타임라인 태스크: {taskId}</p> : null}
      {bookingSaved ? <p className="rounded-xl bg-emerald-50 p-3 text-sm font-black text-emerald-800">예약이 저장되었습니다. 타임테이블의 연결 태스크 상태가 예약됨으로 변경됩니다.</p> : null}
      <form onSubmit={submit} className="grid gap-3 rounded-lg border border-[#ddd2c0] bg-white p-5 text-sm md:grid-cols-2">
        <Input name="name" label="이름/닉네임" value={user.name} onChange={(value) => setUser((current) => ({ ...current, name: value }))} />
        <Input name="contact" label="연락처 또는 이메일" value={user.contact} onChange={(value) => setUser((current) => ({ ...current, contact: value }))} required />
        <Input name="region" label="창업 예정 지역" defaultValue="부산 대학가" />
        <Input name="capital" label="예산" defaultValue="5,000만원" />
        <Input name="openDate" label="목표 오픈일" defaultValue={timeline?.targetOpenDate ?? "1개월 뒤"} />
        <label className="grid gap-1 font-bold">상담 카테고리<select name="category" className="rounded-md border border-[#ddd2c0] p-2" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
        <label className="grid gap-1 font-bold">선택 브랜드안<select name="brandId" className="rounded-md border border-[#ddd2c0] p-2" value={user.brandId} onChange={(event) => setUser((current) => ({ ...current, brandId: event.target.value }))}>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>
        <label className="grid gap-1 font-bold md:col-span-2">현재 막히는 문제<textarea name="concern" value={user.concern} onChange={(event) => setUser((current) => ({ ...current, concern: event.target.value }))} className="min-h-24 rounded-md border border-[#ddd2c0] p-2" /></label>
        <div className="rounded-xl bg-[color:var(--branch-surface-muted)] p-3 text-xs font-bold leading-5 text-[#655d52] md:col-span-2">
          질문 템플릿: 견적 범위, 추가 비용 조건, 오픈 전 필수 산출물, 계약 전 확인사항을 상담 질문으로 저장합니다.
        </div>
        <button className="rounded-lg bg-[#b8642f] px-4 py-3 font-black text-white md:col-span-2">입점 대기 상담사 알림 등록</button>
      </form>
      <ConsultantSchedule
        consultants={consultants}
        slots={slots}
        appointments={appointments}
        selectedCategory={selectedCategory}
        selectedConsultantId={selectedConsultantId}
        onSelectCategory={setSelectedCategory}
        onSelectConsultant={setSelectedConsultantId}
        onBookSlot={book}
        onCancelAppointment={cancel}
      />
    </div>
  );
}

function Input({ name, label, defaultValue, value, onChange, required }: { name: string; label: string; defaultValue?: string; value?: string; onChange?: (value: string) => void; required?: boolean }) {
  return <label className="grid gap-1 font-bold">{label}<input required={required} name={name} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} defaultValue={value === undefined ? defaultValue : undefined} className="rounded-md border border-[#ddd2c0] p-2" /></label>;
}

function normalizeCategory(value: string) {
  if (value.includes("시공")) return "시공사";
  if (value.includes("주방")) return "주방설비";
  if (value.includes("공급")) return "식자재/공급처";
  if (value.includes("홍보") || value.includes("릴스")) return "홍보/릴스";
  if (value.includes("세무") || value.includes("노무") || value.includes("행정")) return "세무/노무";
  if (value.includes("창업")) return "창업 컨설턴트";
  return value;
}
