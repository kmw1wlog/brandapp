"use client";

import type { BrandAssetJob } from "./kie-types";

const KEY = "branch_brand_asset_jobs_v1";

function read() {
  if (typeof window === "undefined") return [] as BrandAssetJob[];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as BrandAssetJob[];
  } catch {
    return [];
  }
}

function write(value: BrandAssetJob[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(value));
}

export function listBrandImageJobs() {
  return read();
}

export function saveBrandImageJob(job: BrandAssetJob) {
  const jobs = read().filter((item) => item.id !== job.id);
  write([...jobs, job]);
}
