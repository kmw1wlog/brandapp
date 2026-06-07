import type { AppointmentSlot, MockConsultant } from "@/lib/branch/types";

export function MockConsultantTimetable({ consultants, slots }: { consultants: MockConsultant[]; slots: AppointmentSlot[] }) {
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-xl font-black text-[#164033]">상담사 타임테이블 목업</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {consultants.map((consultant) => (
          <div key={consultant.id} className="rounded-lg bg-[#f6f1e8] p-4">
            <p className="font-black text-[#164033]">{consultant.name}</p>
            <p className="mt-1 text-sm text-[#655d52]">{consultant.category} · 입점 준비 중</p>
            <p className="mt-2 text-xs text-[#655d52]">{consultant.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">{slots.filter((slot) => slot.consultant_id === consultant.id).map((slot) => <span key={slot.time} className="rounded-md bg-white px-2 py-1 text-xs font-bold">D+{slot.date_offset_days} {slot.time}</span>)}</div>
            <button disabled className="mt-3 rounded-md bg-[#cfc5b6] px-3 py-2 text-xs font-black text-white">입점 완료 시 알림 받기</button>
          </div>
        ))}
      </div>
    </section>
  );
}
