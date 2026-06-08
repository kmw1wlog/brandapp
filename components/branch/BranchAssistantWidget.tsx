"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bot, LoaderCircle, Send, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { readStartupInput } from "@/lib/branch/storage/startup-flow-storage";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterByPath: Record<string, string[]> = {
  "/dashboard/startup/input": [
    "예산 5천만원이면 어떤 업종이 무난한가?",
    "입력 항목 중 지금 가장 먼저 고정해야 할 것은?",
    "대출 비중을 어떻게 잡으면 좋을까?"
  ],
  "/dashboard/startup/location": [
    "이 화면에서 입지 비교는 어떤 순서로 봐야 하나?",
    "동종 업소 수와 월평균 매출 중 무엇을 더 먼저 봐야 하나?",
    "장전2동이 왜 우선 후보인지 설명해줘"
  ],
  "/dashboard/startup/new": [
    "가상 브랜드와 업종 평균을 같이 읽는 방법을 알려줘",
    "지금 브랜드 컨셉에서 가장 바꿔야 할 포인트는?",
    "다음 단계로 보기 전에 꼭 확인할 수치를 정리해줘"
  ]
};

export function BranchAssistantWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionKey, setSessionKey] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "현재 화면 기준으로 무엇을 먼저 봐야 하는지 바로 정리해 드릴 수 있습니다."
    }
  ]);

  useEffect(() => {
    const key = window.localStorage.getItem("branch_assistant_session_key") ?? crypto.randomUUID();
    window.localStorage.setItem("branch_assistant_session_key", key);
    setSessionKey(key);
  }, []);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "현재 화면 기준으로 무엇을 먼저 봐야 하는지 바로 정리해 드릴 수 있습니다."
      }
    ]);
    setInput("");
  }, [pathname]);

  const starters = useMemo(() => starterByPath[pathname] ?? starterByPath["/dashboard/startup/new"], [pathname]);

  async function sendMessage(event?: FormEvent<HTMLFormElement>, preset?: string) {
    event?.preventDefault();
    const question = (preset ?? input).trim();
    if (!question || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey,
          pathname,
          startupInput: readStartupInput(),
          messages: nextMessages
        })
      });
      const json = await response.json();
      setMessages((current) => [...current, { role: "assistant", content: String(json?.reply ?? "답변을 생성하지 못했습니다.") }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "지금은 답변 연결이 불안정합니다. 현재 화면 기준 핵심 지표를 짚어드릴 수 있게 질문을 더 짧게 보내 주세요." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-lg bg-[#164033] px-4 py-3 text-sm font-black text-white shadow-lg"
        data-testid="assistant-open-button"
      >
        <Bot size={18} />
        브랜치 도우미
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/30 p-4">
          <div className="ml-auto flex h-[min(760px,calc(100vh-32px))] max-w-xl flex-col rounded-[24px] bg-white shadow-2xl" data-testid="assistant-widget">
            <div className="flex items-start justify-between gap-4 border-b border-[#eee4d7] px-5 py-4">
              <div>
                <div className="flex items-center gap-2 text-[#164033]">
                  <Sparkles size={16} />
                  <p className="text-sm font-black">Qwen 창업 도우미</p>
                </div>
                <h2 className="mt-1 text-xl font-black text-[#164033]">현재 화면 맥락으로 바로 답변</h2>
                <p className="mt-1 text-sm font-bold text-[#6b6258]">입지 비교, 브랜드 선택, 손익 해석, 다음 액션 정리에 맞춰 답합니다.</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-[#f3eadb]" aria-label="닫기">
                <X size={18} />
              </button>
            </div>

            <div className="border-b border-[#eee4d7] px-5 py-3">
              <div className="flex flex-wrap gap-2">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => sendMessage(undefined, starter)}
                    className="rounded-full border border-[#ddd2c0] bg-[#faf6f0] px-3 py-2 text-left text-xs font-black text-[#164033]"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm font-bold leading-6 ${
                    message.role === "assistant"
                      ? "bg-[#f7f1e8] text-[#164033]"
                      : "ml-auto bg-[#164033] text-white"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {loading ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f7f1e8] px-4 py-3 text-sm font-black text-[#164033]">
                  <LoaderCircle size={16} className="animate-spin" />
                  답변 생성 중
                </div>
              ) : null}
            </div>

            <form onSubmit={sendMessage} className="border-t border-[#eee4d7] px-5 py-4">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="현재 화면에서 막히는 점을 물어보세요"
                  className="min-h-24 flex-1 rounded-2xl border border-[#ddd2c0] px-4 py-3 text-sm font-bold text-[#164033] outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#b8642f] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />
                  보내기
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
