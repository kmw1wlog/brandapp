import { fallbackByTask } from "./fallback";
import { safeJsonParse } from "./safeJson";

type GenerateInput = {
  task: string;
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  fallback?: unknown;
};

export async function generateWithQwen(input: GenerateInput) {
  const apiKey = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY;
  const baseUrl = process.env.QWEN_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
  const model = process.env.QWEN_MODEL || "qwen-plus";
  const fallback = input.fallback ?? fallbackByTask(input.task);

  if (!apiKey) {
    return { ok: true, source: "fallback" as const, data: fallback };
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: input.systemPrompt },
          { role: "user", content: input.userPrompt }
        ],
        response_format: input.jsonMode ? { type: "json_object" } : undefined
      })
    });

    if (!response.ok) {
      return { ok: true, source: "fallback" as const, data: fallback, error: `Qwen request failed: ${response.status}` };
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;
    const data = input.jsonMode && typeof content === "string" ? safeJsonParse(content, fallback) : { content };
    return { ok: true, source: "qwen" as const, data };
  } catch (error) {
    return {
      ok: true,
      source: "fallback" as const,
      data: fallback,
      error: error instanceof Error ? error.message : "Qwen request failed"
    };
  }
}
