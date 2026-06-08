import { fallbackByTask } from "./fallback";
import { safeJsonParse } from "./safeJson";

type GenerateInput = {
  task: string;
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  fallback?: unknown;
};

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function getQwenConfig() {
  return {
    apiKey: process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY,
    baseUrl: process.env.QWEN_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    model: process.env.QWEN_MODEL || "qwen-plus"
  };
}

export async function generateWithQwen(input: GenerateInput) {
  const { apiKey, baseUrl, model } = getQwenConfig();
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

export async function chatWithQwen(messages: ChatMessage[], fallbackContent: string) {
  const { apiKey, baseUrl, model } = getQwenConfig();

  if (!apiKey) {
    return {
      ok: true,
      source: "fallback" as const,
      model,
      content: fallbackContent
    };
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
        messages,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      return {
        ok: true,
        source: "fallback" as const,
        model,
        content: fallbackContent,
        error: `Qwen request failed: ${response.status}`
      };
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;
    return {
      ok: true,
      source: "qwen" as const,
      model,
      content: typeof content === "string" && content.trim() ? content.trim() : fallbackContent
    };
  } catch (error) {
    return {
      ok: true,
      source: "fallback" as const,
      model,
      content: fallbackContent,
      error: error instanceof Error ? error.message : "Qwen chat request failed"
    };
  }
}
