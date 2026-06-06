"use client";

import { DEMO_SCENARIO } from "./constants";
import type { StartupScenario } from "./types";

const SCENARIO_KEY = "brandapp:scenario";
const SELECTED_MENU_KEY = "brandapp:selectedMenuId";
const SELECTED_BRAND_KEY = "brandapp:selectedBrandId";
const GROUPBUY_KEY = "brandapp:groupbuyInterest";
const CHECKLIST_KEY = "brandapp:operationChecklist";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getStoredScenario(): StartupScenario {
  return readJson(SCENARIO_KEY, DEMO_SCENARIO);
}

export function saveScenario(scenario: StartupScenario) {
  window.localStorage.setItem(SCENARIO_KEY, JSON.stringify(scenario));
}

export function getSelectedMenuId() {
  return readJson(SELECTED_MENU_KEY, "menu_001");
}

export function saveSelectedMenuId(menuId: string) {
  window.localStorage.setItem(SELECTED_MENU_KEY, JSON.stringify(menuId));
}

export function getSelectedBrandId() {
  return readJson(SELECTED_BRAND_KEY, "brand_001");
}

export function saveSelectedBrandId(brandId: string) {
  window.localStorage.setItem(SELECTED_BRAND_KEY, JSON.stringify(brandId));
}

export function getGroupBuyInterest() {
  return readJson(GROUPBUY_KEY, false);
}

export function saveGroupBuyInterestLocal(value: boolean) {
  window.localStorage.setItem(GROUPBUY_KEY, JSON.stringify(value));
}

export function getChecklistState() {
  return readJson<Record<string, boolean>>(CHECKLIST_KEY, {});
}

export function saveChecklistState(value: Record<string, boolean>) {
  window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(value));
}
