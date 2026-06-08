import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { BrandAssetJob, BrandAssetKind, KieCreateTaskPayload } from "./kie-types";

function getBaseUrl() {
  return (process.env.KIE_BASE_URL || "https://api.kie.ai").replace(/\/$/, "");
}

function getPublicAppOrigin() {
  return (process.env.PUBLIC_APP_ORIGIN || process.env.NEXT_PUBLIC_APP_URL || "https://brandapp-mu.vercel.app").replace(/\/$/, "");
}

function getKieApiKey() {
  return process.env.KIE_API_KEY || process.env.KIE_AI_API_KEY || process.env.KIE_TOKEN || "";
}

function getCacheFilePath() {
  return process.env.KIE_CACHE_FILE || "/tmp/brandapp-kie-cache.json";
}

function resolveTemplateUrl(templateUrl?: string) {
  if (!templateUrl) return "";
  if (/^https?:\/\//.test(templateUrl)) return templateUrl;
  return `${getPublicAppOrigin()}${templateUrl.startsWith("/") ? templateUrl : `/${templateUrl}`}`;
}

function getCacheKey({
  brandId,
  kind,
  templateUrl
}: {
  brandId: string;
  kind: BrandAssetKind;
  templateUrl: string;
}) {
  return `${brandId}:${kind}:${templateUrl}`;
}

type KieCacheState = {
  pendingByTaskId: Record<string, { brandId: string; kind: BrandAssetKind; templateUrl: string }>;
  successByAssetKey: Record<string, { taskId: string; generatedUrl: string; updatedAt: string }>;
};

function readCacheState(): KieCacheState {
  try {
    if (!existsSync(getCacheFilePath())) {
      return { pendingByTaskId: {}, successByAssetKey: {} };
    }
    return JSON.parse(readFileSync(getCacheFilePath(), "utf8")) as KieCacheState;
  } catch {
    return { pendingByTaskId: {}, successByAssetKey: {} };
  }
}

function writeCacheState(state: KieCacheState) {
  writeFileSync(getCacheFilePath(), JSON.stringify(state, null, 2));
}

function readSuccessfulAssetCache({
  brandId,
  kind,
  templateUrl
}: {
  brandId: string;
  kind: BrandAssetKind;
  templateUrl: string;
}) {
  return readCacheState().successByAssetKey[getCacheKey({ brandId, kind, templateUrl })];
}

function savePendingTask({
  taskId,
  brandId,
  kind,
  templateUrl
}: {
  taskId: string;
  brandId: string;
  kind: BrandAssetKind;
  templateUrl: string;
}) {
  const state = readCacheState();
  state.pendingByTaskId[taskId] = { brandId, kind, templateUrl };
  writeCacheState(state);
}

function saveSuccessfulTask(taskId: string, generatedUrl: string) {
  const state = readCacheState();
  const pending = state.pendingByTaskId[taskId];
  if (!pending) return;
  state.successByAssetKey[getCacheKey(pending)] = {
    taskId,
    generatedUrl,
    updatedAt: new Date().toISOString()
  };
  delete state.pendingByTaskId[taskId];
  writeCacheState(state);
}

export function buildKieCreateTaskPayload({ prompt, templateUrl }: { prompt: string; templateUrl?: string }): KieCreateTaskPayload {
  const resolvedTemplateUrl = resolveTemplateUrl(templateUrl);
  return {
    model: process.env.KIE_MODEL || "nano-banana-pro",
    callBackUrl: process.env.KIE_CALLBACK_URL,
    input: {
      prompt,
      image_input: resolvedTemplateUrl ? [resolvedTemplateUrl] : [],
      aspect_ratio: "16:9",
      resolution: "1K",
      output_format: "png"
    }
  };
}

export function kieEnabled() {
  return Boolean(getKieApiKey());
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
  const resolvedTemplateUrl = resolveTemplateUrl(templateUrl);
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

  const payload = buildKieCreateTaskPayload({ prompt, templateUrl: resolvedTemplateUrl });
  const response = await fetch(`${getBaseUrl()}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKieApiKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const json = await response.json();
  if (!response.ok || (typeof json?.code === "number" && json.code !== 200)) {
    return buildFailureOrCachedJob({
      brandId,
      kind,
      templateUrl,
      prompt,
      now,
      errorMessage: json?.msg ?? `KIE createTask failed (${response.status})`
    });
  }

  const taskId = json?.taskId ?? json?.data?.taskId ?? null;
  if (!taskId) {
    return buildFailureOrCachedJob({
      brandId,
      kind,
      templateUrl,
      prompt,
      now,
      errorMessage: "taskId missing"
    });
  }

  savePendingTask({ taskId, brandId, kind, templateUrl });

  return {
    id: crypto.randomUUID(),
    brandId,
    kind,
    templateUrl,
    prompt,
    provider: "kie",
    model: "nano-banana-pro",
    taskId: taskId ?? undefined,
    status: "queued",
    selectedUrl: templateUrl,
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
      Authorization: `Bearer ${getKieApiKey()}`
    }
  });
  const json = await response.json();
  if (!response.ok) {
    return { status: "fail", resultUrls: [], errorMessage: json?.msg ?? `KIE recordInfo failed (${response.status})` };
  }

  const rawStatus = json?.data?.state ?? json?.data?.status ?? json?.state ?? json?.status ?? "fail";
  const resultJson = parseResultJson(json?.data?.resultJson ?? json?.resultJson ?? {});
  const resultUrls = extractResultUrls(resultJson);
  if (normalizeStatus(rawStatus) === "success" && typeof resultUrls[0] === "string") {
    saveSuccessfulTask(taskId, resultUrls[0]);
  }
  return {
    status: normalizeStatus(rawStatus),
    resultUrls,
    errorMessage: json?.data?.failMsg ?? json?.failMsg ?? undefined
  };
}

function parseResultJson(value: unknown) {
  if (typeof value !== "string") return value as Record<string, unknown>;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function extractResultUrls(resultJson: Record<string, unknown>) {
  const candidates = [resultJson.resultUrls, resultJson.result_urls, resultJson.images, resultJson.urls, resultJson.output];
  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    const urls = candidate.filter((item): item is string => typeof item === "string");
    if (urls.length > 0) return urls;
  }
  return [];
}

function normalizeStatus(status: string) {
  if (status === "success" || status === "completed") return "success";
  if (status === "waiting" || status === "queued" || status === "submitted") return "queued";
  if (status === "running" || status === "processing" || status === "generating") return "generating";
  if (status === "template") return "template";
  return "fail";
}

function buildFailureOrCachedJob({
  brandId,
  kind,
  templateUrl,
  prompt,
  now,
  errorMessage
}: {
  brandId: string;
  kind: BrandAssetKind;
  templateUrl: string;
  prompt: string;
  now: string;
  errorMessage: string;
}): BrandAssetJob {
  const cached = readSuccessfulAssetCache({ brandId, kind, templateUrl });
  if (cached) {
    return {
      id: crypto.randomUUID(),
      brandId,
      kind,
      templateUrl,
      prompt,
      provider: "kie",
      model: "nano-banana-pro",
      taskId: cached.taskId,
      status: "success",
      generatedUrl: cached.generatedUrl,
      selectedUrl: cached.generatedUrl,
      createdAt: now,
      updatedAt: cached.updatedAt
    };
  }

  return {
    id: crypto.randomUUID(),
    brandId,
    kind,
    templateUrl,
    prompt,
    provider: "kie",
    model: "nano-banana-pro",
    status: "fail",
    selectedUrl: templateUrl,
    errorMessage,
    createdAt: now,
    updatedAt: now
  };
}
