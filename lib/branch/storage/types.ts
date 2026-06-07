import type { Appointment, AppointmentInput, ConsultationLeadInput, FeedbackInput, TimelineState } from "../types";

export type BranchStorageAdapter = {
  getSelectedBrand(): Promise<string>;
  saveSelectedBrand(brandId: string): Promise<void>;
  getTimeline(): Promise<TimelineState>;
  saveTimeline(state: TimelineState): Promise<void>;
  getAppointments(): Promise<Appointment[]>;
  createAppointment(input: AppointmentInput): Promise<Appointment>;
  updateAppointment(id: string, patch: Partial<Appointment>): Promise<void>;
  saveConsultationLead(input: ConsultationLeadInput): Promise<void>;
  saveFeedback(input: FeedbackInput): Promise<void>;
};
