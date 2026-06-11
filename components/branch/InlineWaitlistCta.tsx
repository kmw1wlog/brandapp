"use client";

import { Gift, Mail, Phone, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { saveBetaSignup, trackEvent } from "@/lib/branch/events";

type InlineWaitlistCtaProps = {
  title: string;
  description: string;
  purpose: string;
  submitLabel: string;
  benefits: string[];
  defaultBenefit?: string;
  category?: string;
  openDate?: string;
  notePlaceholder?: string;
  successMessage?: string;
  theme?: "light" | "dark";
  compact?: boolean;
  eventName?: string;
  testId?: string;
};

export function InlineWaitlistCta({
  title,
  description,
  purpose,
  submitLabel,
  benefits,
  defaultBenefit,
  category,
  openDate,
  notePlaceholder = "선택 사항: 원하는 기능이나 준비 중인 내용을 남겨주세요.",
  successMessage = "저장되었습니다. 사전오픈 혜택과 기능 업데이트 알림 대상으로 등록했어요.",
  theme = "light",
  compact = false,
  eventName = "beta_waitlist_submit",
  testId
}: InlineWaitlistCtaProps) {
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveBetaSignup({
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      purpose,
      benefit: String(form.get("benefit") ?? defaultBenefit ?? benefits[0] ?? ""),
      category,
      openDate,
      note: String(form.get("note") ?? "")
    });
    trackEvent(eventName, { purpose, category, openDate });
    setSaved(true);
  }

  const panelClass =
    theme === "dark"
      ? "border border-white/10 bg-white/5 text-white"
      : "border border-[#e4dacb] bg-white text-[#1f2937]";
  const subTextClass = theme === "dark" ? "text-white/74" : "text-[#6a6258]";
  const chipClass =
    theme === "dark"
      ? "border border-white/10 bg-white/10 text-white/88"
      : "border border-[#d7e7df] bg-[#f4fbf7] text-[#0f7b54]";
  const inputClass =
    theme === "dark"
      ? "border border-white/15 bg-[#081d31] text-white placeholder:text-white/40"
      : "border border-[#e4dacb] bg-white text-[#1f2937] placeholder:text-[#9a8f82]";

  return (
    <section data-testid={testId} className={`rounded-[28px] p-6 shadow-[0_18px_50px_rgba(61,45,27,0.06)] ${panelClass}`}>
      <div className={`grid gap-5 ${compact ? "" : "lg:grid-cols-[0.95fr_1.05fr]"}`}>
        <div>
          <p className={`inline-flex items-center gap-2 text-sm font-black ${theme === "dark" ? "text-[#8fd1ff]" : "text-[#0f7b54]"}`}>
            <Gift size={16} />
            사전오픈 혜택 알림
          </p>
          <h3 className="mt-3 text-2xl font-black">{title}</h3>
          <p className={`mt-3 text-sm font-bold leading-6 ${subTextClass}`}>{description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {benefits.map((benefit) => (
              <span key={benefit} className={`rounded-full px-3 py-2 text-xs font-black ${chipClass}`}>
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {saved ? (
          <div className={`rounded-2xl p-5 text-sm font-bold leading-6 ${theme === "dark" ? "bg-[#0f7b54]/18 text-white" : "bg-[#edf8f2] text-[#0f7b54]"}`}>
            <p className="flex items-center gap-2 text-base font-black">
              <Sparkles size={18} />
              저장 완료
            </p>
            <p className="mt-2">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-3">
            <label className="grid gap-2 text-sm font-black">
              어떤 혜택을 먼저 받을까요?
              <select aria-label="혜택 선택" name="benefit" defaultValue={defaultBenefit ?? benefits[0] ?? ""} className={`rounded-2xl px-4 py-3 text-sm font-bold ${inputClass}`}>
                {benefits.map((benefit) => (
                  <option key={benefit} value={benefit}>
                    {benefit}
                  </option>
                ))}
              </select>
            </label>
            <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
              <label className="grid gap-2 text-sm font-black">
                이메일
                <span className={`flex items-center gap-2 rounded-2xl px-4 py-3 ${inputClass}`}>
                  <Mail size={16} className={theme === "dark" ? "text-white/60" : "text-[#8a7b6c]"} />
                  <input aria-label="이메일" required name="email" type="email" placeholder="name@example.com" className="w-full bg-transparent outline-none" />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-black">
                전화번호
                <span className={`flex items-center gap-2 rounded-2xl px-4 py-3 ${inputClass}`}>
                  <Phone size={16} className={theme === "dark" ? "text-white/60" : "text-[#8a7b6c]"} />
                  <input aria-label="전화번호" name="phone" type="tel" placeholder="선택 입력" className="w-full bg-transparent outline-none" />
                </span>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-black">
              한 줄 메모
              <textarea aria-label="메모" name="note" placeholder={notePlaceholder} className={`min-h-24 rounded-2xl px-4 py-3 text-sm font-bold outline-none ${inputClass}`} />
            </label>
            <button type="submit" className={`rounded-2xl px-5 py-4 text-sm font-black ${theme === "dark" ? "bg-[#0f67d8] text-white" : "bg-[#073d2d] text-white"}`}>
              {submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
