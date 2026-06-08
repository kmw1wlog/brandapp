import { NextResponse } from "next/server";
import { chatWithQwen } from "@/lib/ai/qwen";
import { saveChatMessage, saveChatSession } from "@/lib/db";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

const FALLBACK_REPLY = {
  "/dashboard/startup/input": "입력 화면에서는 예산, 지역, 업종, 운영 형태를 먼저 확정하는 게 좋습니다. 예산이 정해지지 않았다면 자기자본과 대출 비중부터 같이 정리해 드릴 수 있습니다.",
  "/dashboard/startup/location": "입지 분석 화면에서는 후보 입지의 월평균 매출, 동종 업소 수, 배달 월평균, 유동인구를 같이 비교해야 합니다. 원하는 업종을 말하면 어떤 수치를 먼저 봐야 하는지 정리해 드리겠습니다.",
  "/dashboard/startup/new": "비교 화면에서는 가상 브랜드, 업종 평균, 입지 점수의 순서로 보는 게 좋습니다. 현재 업종 기준으로 어떤 브랜드 포지션이 유리한지부터 요약해 드릴 수 있습니다.",
  default: "현재 화면 기준으로 무엇을 먼저 결정해야 하는지와 어떤 수치를 읽어야 하는지 짧게 정리해 드릴 수 있습니다."
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pathname = String(body?.pathname ?? "/");
    const sessionKey = String(body?.sessionKey ?? crypto.randomUUID());
    const startupInput = (body?.startupInput ?? {}) as Record<string, unknown>;
    const history = Array.isArray(body?.messages) ? (body.messages as IncomingMessage[]).slice(-8) : [];
    const latestUserMessage = [...history].reverse().find((item) => item.role === "user")?.content ?? "";

    const systemPrompt = [
      "너는 브랜치 앱 안에서 동작하는 F&B 창업 도우미다.",
      "답변은 한국어로, 짧고 실무적으로 한다.",
      "화면에 이미 있는 지표와 사용자 입력을 우선 활용한다.",
      "추정값이나 외부 확인이 필요한 내용은 단정하지 말고 조건부로 설명한다.",
      "예비점주가 다음 클릭에서 무엇을 해야 하는지 1~3개로 제안한다."
    ].join(" ");

    const contextSummary = JSON.stringify({
      pathname,
      startupInput
    });

    const messages = [
      { role: "system" as const, content: `${systemPrompt}\n현재 컨텍스트: ${contextSummary}` },
      ...history.map((item) => ({ role: item.role, content: item.content }))
    ];

    const fallbackContent = FALLBACK_REPLY[pathname as keyof typeof FALLBACK_REPLY] ?? FALLBACK_REPLY.default;
    const result = await chatWithQwen(messages, fallbackContent);

    await saveChatSession(sessionKey, {
      session_key: sessionKey,
      pathname,
      context_summary: latestUserMessage.slice(0, 200),
      startup_input: startupInput
    });
    await saveChatMessage({
      session_key: sessionKey,
      role: "user",
      content: latestUserMessage,
      model: result.model,
      meta: { pathname }
    });
    await saveChatMessage({
      session_key: sessionKey,
      role: "assistant",
      content: result.content,
      model: result.model,
      meta: { pathname, source: result.source }
    });

    return NextResponse.json({
      ok: true,
      source: result.source,
      model: result.model,
      sessionKey,
      reply: result.content
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: true,
        source: "fallback",
        model: process.env.QWEN_MODEL || "qwen-plus",
        reply: FALLBACK_REPLY.default,
        error: error instanceof Error ? error.message : "assistant chat route failed"
      },
      { status: 200 }
    );
  }
}
