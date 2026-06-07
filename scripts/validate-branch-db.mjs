import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "src", "data", "branch");

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(base, relativePath), "utf8"));
}

const checks = [
  ["브랜드 후보 3개 이상", () => readJson("brand/brand_options.json").length >= 3],
  ["메뉴 원가 4개 이상", () => readJson("cost/menu_costs.json").length >= 4],
  ["프랜차이즈 비교 데이터 1개 이상", () => readJson("franchise/franchise_benchmarks.json").length >= 1],
  ["공급처 후보 30개 이상", () => readJson("suppliers/supplier_candidates.json").length >= 30],
  ["공동구매 후보 5개 이상", () => readJson("suppliers/groupbuy_candidates.json").length >= 5],
  ["오프닝 태스크 10개 이상", () => readJson("timetable/opening_tasks.json").length >= 10],
  ["상담 카테고리 6개 이상", () => readJson("timetable/consultant_categories.json").length >= 6],
  ["상담 질문 카테고리 8개 이상", () => readJson("copy/consultation_questions.json").categories.length >= 8],
  ["카테고리별 상담 질문 10개 이상", () => readJson("copy/consultation_questions.json").categories.every((category) => category.questions.length >= 10)],
  ["화면 카피 10개 화면 이상", () => Object.keys(readJson("copy/dashboard_copy.json").screens).length >= 10]
];

let warnings = 0;
for (const [label, check] of checks) {
  try {
    if (check()) {
      console.log(`ok: ${label}`);
    } else {
      warnings += 1;
      console.warn(`warning: ${label}`);
    }
  } catch (error) {
    warnings += 1;
    console.warn(`warning: ${label} (${error instanceof Error ? error.message : "unknown error"})`);
  }
}

console.log(warnings === 0 ? "Branch DB validation passed" : `Branch DB validation completed with ${warnings} warning(s)`);
