import { Suspense } from "react";
import { ConsultationCTA } from "@/components/branch/ConsultationCTA";
import { ConsultationLeadForm } from "@/components/branch/ConsultationLeadForm";
import { ConsultationQuestionPanel } from "@/components/branch/ConsultationQuestionPanel";
import { MockConsultantTimetable } from "@/components/branch/MockConsultantTimetable";
import { PageHeader } from "@/components/branch/Common";
import { getAppointmentSlots, getConsultationQuestions, getDashboardCopy, getMockConsultants } from "@/lib/branch/data";

export default function ConsultationPage() {
  const copy = getDashboardCopy().screens.consultation;
  return (
    <div className="grid gap-5">
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <ConsultationCTA />
      <Suspense fallback={<div className="rounded-lg bg-white p-5">상담 폼을 준비 중입니다.</div>}>
        <ConsultationLeadForm />
      </Suspense>
      <ConsultationQuestionPanel categories={getConsultationQuestions()} />
      <MockConsultantTimetable consultants={getMockConsultants()} slots={getAppointmentSlots()} />
    </div>
  );
}
