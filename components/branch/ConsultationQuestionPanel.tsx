"use client";

import type { ConsultationQuestionCategory } from "@/lib/branch/types";

export function ConsultationQuestionPanel({ categories }: { categories: ConsultationQuestionCategory[] }) {
  function copyAll(category: ConsultationQuestionCategory) {
    navigator.clipboard.writeText(category.questions.map((item) => item.question).join("\n"));
  }
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-xl font-black text-[#164033]">상담 질문 템플릿</h3>
      <div className="mt-4 grid gap-3">
        {categories.map((category) => (
          <details key={category.category} className="rounded-lg bg-[#f6f1e8] p-4">
            <summary className="cursor-pointer font-black text-[#164033]">{category.category}</summary>
            <ol className="mt-3 grid gap-2 text-sm text-[#655d52]">
              {category.questions.map((item) => <li key={item.id}>{item.question}</li>)}
            </ol>
            <button onClick={() => copyAll(category)} className="mt-3 rounded-md bg-[#164033] px-3 py-2 text-xs font-black text-white">질문 전체 복사</button>
          </details>
        ))}
      </div>
    </section>
  );
}
