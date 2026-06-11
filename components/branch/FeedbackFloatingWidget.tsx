"use client";

import { MessageSquare, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { getFeedbackQuestions } from "@/lib/branch/data";
import { saveFeedback, trackEvent } from "@/lib/branch/events";

export function FeedbackFloatingWidget() {
  const copy = getFeedbackQuestions();
  const stageOptions = copy.fields.find((field: { id: string }) => field.id === "stage")?.options ?? [];
  const blockerOptions = copy.fields.find((field: { id: string }) => field.id === "blocker")?.options ?? [];
  const timelineOptions = copy.fields.find((field: { id: string }) => field.id === "openTimeline")?.options ?? [];
  const budgetOptions = copy.fields.find((field: { id: string }) => field.id === "budgetRange")?.options ?? [];
  const benefitOptions = copy.fields.find((field: { id: string }) => field.id === "desiredBenefit")?.options ?? [];
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveFeedback({
      stage: String(form.get("stage") ?? ""),
      blocker: String(form.get("blocker") ?? ""),
      openTimeline: String(form.get("openTimeline") ?? ""),
      budgetRange: String(form.get("budgetRange") ?? ""),
      desiredBenefit: String(form.get("desiredBenefit") ?? ""),
      consultation: form.get("consultation") === "on",
      contact: String(form.get("contact") ?? ""),
      note: String(form.get("note") ?? "")
    });
    trackEvent("feedback_submit");
    setSaved(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-2xl bg-[#b8642f] px-4 py-3 text-sm font-black text-white shadow-[0_16px_35px_rgba(93,52,18,0.28)]"
      >
        <MessageSquare size={18} />
        {copy.floating_button}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 p-4">
          <div className="ml-auto mt-auto max-h-[calc(100vh-2rem)] max-w-md overflow-y-auto rounded-[24px] bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#164033]">{copy.title}</h2>
                <p className="mt-1 text-sm text-[#6b6258]">짧게 남겨주시면 사전오픈 혜택과 기능 우선순위에 반영합니다.</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-[#f3eadb]" aria-label="닫기">
                <X size={18} />
              </button>
            </div>
            {saved ? (
              <p className="mt-5 rounded-lg bg-[#e8f3eb] p-4 text-sm font-semibold text-[#164033]">{copy.success}</p>
            ) : (
              <form onSubmit={submit} className="mt-5 grid gap-3 text-sm">
                <label className="grid gap-1 font-semibold">
                  {copy.fields.find((field: { id: string }) => field.id === "stage")?.label}
                  <select aria-label="현재 창업 단계" name="stage" className="rounded-md border border-[#ddd2c0] p-2">
                    {stageOptions.map((option: string) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 font-semibold">
                  {copy.fields.find((field: { id: string }) => field.id === "blocker")?.label}
                  <select aria-label="지금 가장 막히는 부분" name="blocker" className="rounded-md border border-[#ddd2c0] p-2">
                    {blockerOptions.map((option: string) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 font-semibold">
                  {copy.fields.find((field: { id: string }) => field.id === "openTimeline")?.label}
                  <select aria-label="언제쯤 개점하고 싶나요?" name="openTimeline" className="rounded-md border border-[#ddd2c0] p-2">
                    {timelineOptions.map((option: string) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 font-semibold">
                  {copy.fields.find((field: { id: string }) => field.id === "budgetRange")?.label}
                  <select aria-label="현재 예상 자본은?" name="budgetRange" className="rounded-md border border-[#ddd2c0] p-2">
                    {budgetOptions.map((option: string) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 font-semibold">
                  {copy.fields.find((field: { id: string }) => field.id === "desiredBenefit")?.label}
                  <select aria-label="어떤 혜택을 먼저 받고 싶나요?" name="desiredBenefit" className="rounded-md border border-[#ddd2c0] p-2">
                    {benefitOptions.map((option: string) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2 font-semibold">
                  <input name="consultation" type="checkbox" />
                  {copy.fields.find((field: { id: string }) => field.id === "consultation")?.label}
                </label>
                <label className="grid gap-1 font-semibold">
                  {copy.fields.find((field: { id: string }) => field.id === "contact")?.label}
                  <input aria-label="이메일 또는 전화번호" name="contact" className="rounded-md border border-[#ddd2c0] p-2" />
                </label>
                <label className="grid gap-1 font-semibold">
                  한 줄 메모
                  <textarea aria-label="한 줄 메모" name="note" className="min-h-20 rounded-md border border-[#ddd2c0] p-2" />
                </label>
                <button className="rounded-lg bg-[#164033] px-4 py-3 font-black text-white">설문 보내기</button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
