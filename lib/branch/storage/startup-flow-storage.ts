"use client";

import { defaultStartupInput, normalizeStartupInput } from "@/lib/branch/user-input";
import type { FinanceScenarioKey, StartupUserInput } from "@/lib/branch/finance/finance-types";

export const BRANCH_USER_INPUT_KEY = "branch_user_input_v1";
export const BRANCH_SELECTED_BRAND_KEY = "branch_selected_brand_v1";
export const BRANCH_ACCOUNTING_SIMULATION_KEY = "branch_accounting_simulation_v1";
export const BRANCH_TIMELINE_KEY = "branch_timeline_v1";
export const BRANCH_OWNER_CONVERSION_KEY = "branch_owner_conversion_v1";

export type SavedFinanceSelection = {
  selectedScenario: FinanceScenarioKey;
  averageOrderValue: number;
  foodCostRate: number;
  targetDailyOrders: number;
  deliveryShare: number;
  endingCash: number;
  updatedAt: string;
};

export type OwnerConversionState = {
  accountStage: "visitor" | "pre_owner" | "opening_preparing" | "owner_demo" | "owner_active";
  updatedAt: string;
};

export function readStartupInput() {
  return normalizeStartupInput(readJson<StartupUserInput>(BRANCH_USER_INPUT_KEY, defaultStartupInput));
}

export function saveStartupInput(input: StartupUserInput) {
  writeJson(BRANCH_USER_INPUT_KEY, normalizeStartupInput(input));
}

export function readFinanceSelection(): SavedFinanceSelection | null {
  return readJson<SavedFinanceSelection | null>(BRANCH_ACCOUNTING_SIMULATION_KEY, null);
}

export function saveFinanceSelection(input: SavedFinanceSelection) {
  writeJson(BRANCH_ACCOUNTING_SIMULATION_KEY, input);
}

export function readOwnerConversion(): OwnerConversionState {
  return readJson<OwnerConversionState>(BRANCH_OWNER_CONVERSION_KEY, { accountStage: "pre_owner", updatedAt: new Date().toISOString() });
}

export function saveOwnerConversion(input: OwnerConversionState) {
  writeJson(BRANCH_OWNER_CONVERSION_KEY, input);
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
