"use client";

import { useEffect, useMemo, useState } from "react";
import { ConsultantSchedule } from "@/components/branch/ConsultantSchedule";
import { PageHeader } from "@/components/branch/Common";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { BranchCard } from "@/components/branch/ui/BranchCard";
import { BranchEmptyState } from "@/components/branch/ui/BranchEmptyState";
import { getBranchStorage } from "@/lib/branch/storage";
import { buildAvailabilitySlots, toConsultants } from "@/lib/branch/timetable";
import { getConsultationLeads } from "@/lib/branch/events";
import { getMockConsultants } from "@/lib/branch/data";
import type { Appointment, ConsultationLead, TimelineState } from "@/lib/branch/types";

export default function ConsultationStatusPage() {
  const consultants = useMemo(() => toConsultants(getMockConsultants()), []);
  const [timeline, setTimeline] = useState<TimelineState | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedConsultantId, setSelectedConsultantId] = useState(consultants[0]?.id ?? "");

  useEffect(() => {
    const storage = getBranchStorage();
    Promise.all([storage.getTimeline(), storage.getAppointments()]).then(([nextTimeline, nextAppointments]) => {
      setTimeline(nextTimeline);
      setAppointments(nextAppointments);
      setLeads(getConsultationLeads());
    });
  }, []);

  const slots = buildAvailabilitySlots(timeline?.targetOpenDate ?? new Date().toISOString().slice(0, 10), consultants, appointments);

  async function cancel(appointment: Appointment) {
    await getBranchStorage().updateAppointment(appointment.id, { status: "cancelled" });
    setAppointments((current) => current.map((item) => item.id === appointment.id ? { ...item, status: "cancelled" } : item));
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
    }
  }

  return (
    <div className="grid gap-5">
      <PageHeader title="상담 현황" subtitle="상담사별 주간 슬롯과 점주 예약/대기 상태를 샘플 데이터로 확인합니다." warning="FullCalendar Standard 기반 샘플입니다. 유료 resource timeline 기능은 사용하지 않습니다." />
      <section className="grid gap-4 lg:grid-cols-3">
        <BranchCard>
          <p className="text-sm font-black text-[color:var(--branch-ink-muted)]">예약된 상담</p>
          <p className="mt-2 text-3xl font-black text-[color:var(--branch-primary)]">{appointments.filter((item) => item.status === "booked").length}건</p>
        </BranchCard>
        <BranchCard>
          <p className="text-sm font-black text-[color:var(--branch-ink-muted)]">대기 신청</p>
          <p className="mt-2 text-3xl font-black text-[color:var(--branch-primary)]">{leads.length}건</p>
        </BranchCard>
        <BranchCard>
          <p className="text-sm font-black text-[color:var(--branch-ink-muted)]">예약 가능 상담사</p>
          <p className="mt-2 text-3xl font-black text-[color:var(--branch-primary)]">{consultants.filter((item) => item.status === "active").length}명</p>
        </BranchCard>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <ConsultantSchedule
          consultants={consultants}
          slots={slots}
          appointments={appointments}
          selectedCategory={selectedCategory}
          selectedConsultantId={selectedConsultantId}
          onSelectCategory={setSelectedCategory}
          onSelectConsultant={setSelectedConsultantId}
          onCancelAppointment={cancel}
        />
        <div className="grid gap-4 content-start">
          <BranchCard>
            <h2 className="text-xl font-black text-[color:var(--branch-primary)]">상담 대기 상태</h2>
            <div className="mt-4 grid gap-3">
              {leads.length === 0 ? <BranchEmptyState title="대기 신청 없음" description="상담신청 화면에서 대기 등록 또는 슬롯 예약을 진행하면 여기에 표시됩니다." /> : leads.map((lead) => (
                <article key={lead.id} className="rounded-xl border border-[color:var(--branch-border)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-black text-[color:var(--branch-primary)]">{lead.name || "데모 점주"}</p>
                    <BranchBadge tone="warning">대기</BranchBadge>
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--branch-ink-muted)]">{lead.category} · {lead.brandId}</p>
                  {lead.taskId ? <p className="mt-1 text-xs font-bold text-[color:var(--branch-accent)]">연결 태스크 {lead.taskId}</p> : null}
                </article>
              ))}
            </div>
          </BranchCard>
          <BranchCard>
            <h2 className="text-xl font-black text-[color:var(--branch-primary)]">예약 목록</h2>
            <div className="mt-4 grid gap-3">
              {appointments.filter((item) => item.status !== "cancelled").length === 0 ? <BranchEmptyState title="예약 없음" description="예약 가능 슬롯을 선택하면 점주 정보와 연결 태스크가 이곳에 표시됩니다." /> : appointments.filter((item) => item.status !== "cancelled").map((appointment) => (
                <article key={appointment.id} className="rounded-xl border border-[color:var(--branch-border)] p-3 text-sm">
                  <p className="font-black text-[color:var(--branch-primary)]">{new Date(appointment.startAt).toLocaleString("ko-KR")}</p>
                  <p className="mt-1 text-[color:var(--branch-ink-muted)]">{appointment.userName} · {appointment.brandId}</p>
                  {appointment.taskId ? <p className="mt-1 text-xs font-bold text-[color:var(--branch-accent)]">연결 태스크 {appointment.taskId}</p> : null}
                </article>
              ))}
            </div>
          </BranchCard>
        </div>
      </section>
    </div>
  );
}
