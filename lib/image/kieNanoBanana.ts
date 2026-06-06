import { getFallbackImage } from "./fallbackImage";

export async function createKieImage(input: { kind: string; prompt: string; referenceImages?: string[] }) {
  const apiKey = process.env.KIE_API_KEY;
  const baseUrl = process.env.KIE_BASE_URL;
  const endpoint = process.env.KIE_NANOBANANA_CREATE_ENDPOINT;
  const model = process.env.KIE_NANOBANANA_MODEL || "kie-nano-banana-pro";

  if (!apiKey || !baseUrl || !endpoint) return getFallbackImage(input.prompt);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        prompt: input.prompt,
        referenceImages: input.referenceImages ?? [],
        callbackUrl: process.env.KIE_CALLBACK_URL
      })
    });

    if (!response.ok) return getFallbackImage(input.prompt);
    const data = await response.json();
    return {
      ok: true,
      source: "kie" as const,
      status: data?.imageUrl ? "completed" : "pending",
      imageUrl: data?.imageUrl ?? data?.data?.imageUrl ?? null,
      taskId: data?.taskId ?? data?.data?.taskId ?? null,
      prompt: input.prompt
    };
  } catch {
    return getFallbackImage(input.prompt);
  }
}

export async function getKieImageStatus(taskId: string) {
  const apiKey = process.env.KIE_API_KEY;
  const baseUrl = process.env.KIE_BASE_URL;
  const endpoint = process.env.KIE_NANOBANANA_STATUS_ENDPOINT;

  if (!apiKey || !baseUrl || !endpoint) {
    return { ok: true, status: "fallback", imageUrl: null, taskId };
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ taskId })
    });
    if (!response.ok) return { ok: true, status: "failed", imageUrl: null, taskId };
    const data = await response.json();
    return {
      ok: true,
      status: data?.status ?? data?.data?.status ?? "pending",
      imageUrl: data?.imageUrl ?? data?.data?.imageUrl ?? null,
      taskId
    };
  } catch {
    return { ok: true, status: "failed", imageUrl: null, taskId };
  }
}
