"use client";

import type { FinanceLocationAdjustment, LocationCandidateRanking } from "@/lib/branch/location-data";
import type { LocationFinanceContext } from "@/lib/branch/finance/finance-types";

export const BRANCH_SELECTED_LOCATION_KEY = "branch_selected_location_v1";
export const BRANCH_EXPERIENCE_CATEGORY_KEY = "branch_experience_category_v1";

export type SelectedExperienceCategory = {
  categoryId: string;
  displayName: string;
  updatedAt: string;
};

export type SelectedLocationState = LocationFinanceContext & {
  categoryDisplayName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  metrics: LocationCandidateRanking["metrics"];
};

export function resolveLocationScoreBand(score: number): "caution" | "neutral" | "strong" {
  if (score >= 70) return "strong";
  if (score >= 50) return "neutral";
  return "caution";
}

export function saveSelectedExperienceCategory(input: Omit<SelectedExperienceCategory, "updatedAt">) {
  writeJson(BRANCH_EXPERIENCE_CATEGORY_KEY, { ...input, updatedAt: new Date().toISOString() });
}

export function readSelectedExperienceCategory() {
  return readJson<SelectedExperienceCategory | null>(BRANCH_EXPERIENCE_CATEGORY_KEY, null);
}

export function buildSelectedLocationState(
  candidate: LocationCandidateRanking,
  adjustments: FinanceLocationAdjustment[]
): SelectedLocationState {
  const scoreBand = resolveLocationScoreBand(candidate.headline_score);
  const adjustment =
    adjustments.find((item) => item.category_id === candidate.category_id && item.location_score_band === scoreBand) ??
    adjustments.find((item) => item.category_id === candidate.category_id) ??
    null;

  return {
    candidateId: candidate.candidate_id,
    categoryId: candidate.category_id,
    categoryDisplayName: candidate.category_display_name,
    summary: candidate.summary,
    regionLabel: candidate.region_label,
    latitude: candidate.latitude,
    longitude: candidate.longitude,
    radiusMeters: candidate.radius_meters,
    headlineScore: candidate.headline_score,
    scoreBand,
    recommendedOperationType: candidate.recommended_operation_type,
    metrics: candidate.metrics,
    dailyOrderMultiplier: adjustment?.daily_order_multiplier ?? 1,
    deliveryShareAdjustment: adjustment?.delivery_share_adjustment ?? 0,
    rentGuardrailRatio: adjustment?.rent_guardrail_ratio ?? null,
    marketingRampAdjustment: adjustment?.marketing_ramp_adjustment ?? 1,
    confidenceLabel: adjustment?.confidence_label ?? "not_linked",
    updatedAt: new Date().toISOString()
  };
}

export function saveSelectedLocation(candidate: LocationCandidateRanking, adjustments: FinanceLocationAdjustment[]) {
  const next = buildSelectedLocationState(candidate, adjustments);
  writeJson(BRANCH_SELECTED_LOCATION_KEY, next);
  return next;
}

export function readSelectedLocation() {
  return readJson<SelectedLocationState | null>(BRANCH_SELECTED_LOCATION_KEY, null);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}
