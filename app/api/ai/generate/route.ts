import { NextResponse } from "next/server";
import { fallbackByTask } from "@/lib/ai/fallback";
import { buildPrompt } from "@/lib/ai/promptBuilder";
import { generateWithQwen } from "@/lib/ai/qwen";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = String(body?.task ?? "menu_recommendation");
    const context = (body?.context ?? {}) as Record<string, unknown>;
    const fallback = fallbackByTask(task);
    const userPrompt = buildPrompt(task, context);
    const result = await generateWithQwen({
      task,
      systemPrompt: "너는 AI 기반 F&B 창업 실행 리포트 작성자다. 추정값은 반드시 추정값으로 표시한다.",
      userPrompt,
      jsonMode: true,
      fallback
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "fallback",
        data: fallbackByTask("menu_recommendation"),
        error: error instanceof Error ? error.message : "controlled ai route error"
      },
      { status: 200 }
    );
  }
}
