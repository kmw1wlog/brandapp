import type { BrandAssetJob, BrandAssetKind, KieCreateTaskPayload } from "./kie-types";

function getBaseUrl() {
  return (process.env.KIE_BASE_URL || "https://api.kie.ai").replace(/\/$/, "");
}

export function buildKieCreateTaskPayload({ prompt, templateUrl }: { prompt: string; templateUrl?: string }): KieCreateTaskPayload {
  return {
    model: process.env.KIE_MODEL || "nano-banana-pro",
    callBackUrl: process.env.KIE_CALLBACK_URL,
    input: {
      prompt,
      image_input: templateUrl ? [templateUrl] : [],
      aspect_ratio: "16:9",
      resolution: "1K",
      output_format: "png"
    }
  };
}

export function kieEnabled() {
  return Boolean(process.env.KIE_API_KEY);
}

export async function createKieBrandImageJob({
  brandId,
  kind,
  templateUrl,
  prompt
}: {
  brandId: string;
  kind: BrandAssetKind;
  templateUrl: string;
  prompt: string;
}): Promise<BrandAssetJob> {
  const now = new Date().toISOString();
  if (!kieEnabled()) {
    return {
      id: crypto.randomUUID(),
      brandId,
      kind,
      templateUrl,
      prompt,
      provider: "kie",
      model: "nano-banana-pro",
      status: "template",
      selectedUrl: templateUrl,
      createdAt: now,
      updatedAt: now,
      mock: true
    };
  }

  const payload = buildKieCreateTaskPayload({ prompt, templateUrl });
  const response = await fetch(`${getBaseUrl()}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KIE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const json = await response.json();
  const taskId = json?.taskId ?? json?.data?.taskId ?? null;

  return {
    id: crypto.randomUUID(),
    brandId,
    kind,
    templateUrl,
    prompt,
    provider: "kie",
    model: "nano-banana-pro",
    taskId: taskId ?? undefined,
    status: taskId ? "queued" : "fail",
    selectedUrl: templateUrl,
    errorMessage: taskId ? undefined : "taskId missing",
    createdAt: now,
    updatedAt: now
  };
}

export async function fetchKieJobStatus(taskId: string) {
  if (!kieEnabled()) {
    return { status: "template", resultUrls: [] };
  }

  const response = await fetch(`${getBaseUrl()}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
    headers: {
      Authorization: `Bearer ${process.env.KIE_API_KEY}`
    }
  });
  const json = await response.json();
  const status = json?.status ?? json?.data?.status ?? "fail";
  const resultJson = parseResultJson(json?.resultJson ?? json?.data?.resultJson ?? {});
  const resultUrls = Array.isArray(resultJson?.resultUrls)
    ? resultJson.resultUrls
    : Array.isArray(resultJson?.resultUrlsJson)
      ? resultJson.resultUrlsJson
      : Array.isArray(resultJson?.urls)
        ? resultJson.urls
        : [];
  return { status, resultUrls };
}

function parseResultJson(value: unknown) {
  if (typeof value !== "string") return value as Record<string, unknown>;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}
