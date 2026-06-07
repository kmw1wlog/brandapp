"use client";

import { MessageSquare, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { getFeedbackQuestions } from "@/lib/branch/data";
import { saveFeedback, trackEvent } from "@/lib/branch/events";

export function FeedbackFloatingWidget() {
  const copy = getFeedbackQuestions();
  const stageOptions = copy.fields.find((field: { id: string }) => field.id === "stage")?.options ?? [];
  const blockerOptions = copy.fields.find((field: { id: string }) => field.id === "blocker")?.options ?? [];
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveFeedback({
      stage: String(form.get("stage") ?? ""),
      blocker: String(form.get("blocker") ?? ""),
      feature: String(form.get("feature") ?? ""),
      consultation: form.get("consultation") === "on",
      contact: String(form.get("contact") ?? "")
    });
    trackEvent("feedback_submit");
    setSaved(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white shadow-lg"
      >
        <MessageSquare size={18} />
        {copy.floating_button}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/30 p-4">
          <div className="ml-auto mt-auto max-w-md rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#164033]">{copy.title}</h2>
                <p className="mt-1 text-sm text-[#6b6258]">의견은 기능 우선순위와 상담 파트너 모집에 사용됩니다.</p>
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
                  현재 창업 단계
                  <select name="stage" className="rounded-md border border-[#ddd2c0] p-2">
                    {stageOptions.map((option: string) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 font-semibold">
                  가장 막히는 부분
                  <select name="blocker" className="rounded-md border border-[#ddd2c0] p-2">
                    {blockerOptions.map((option: string) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 font-semibold">
                  필요한 기능
                  <textarea name="feature" className="min-h-20 rounded-md border border-[#ddd2c0] p-2" />
                </label>
                <label className="flex items-center gap-2 font-semibold">
                  <input name="consultation" type="checkbox" />
                  상담 연결 희망
                </label>
                <label className="grid gap-1 font-semibold">
                  연락처 선택 입력
                  <input name="contact" className="rounded-md border border-[#ddd2c0] p-2" />
                </label>
                <button className="rounded-lg bg-[#164033] px-4 py-3 font-black text-white">의견 보내기</button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
