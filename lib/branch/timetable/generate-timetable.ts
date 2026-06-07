import { daysUntilOpening, resolveOpeningTargetDate } from "@/lib/branch/user-input";
import type { OpeningTask } from "@/lib/branch/types";
import { getTimetableRules } from "./timetable-rules";
import type { GeneratedTimetable } from "./timetable-types";
import type { OpeningTarget } from "@/lib/branch/finance/finance-types";

export function generateTimetable(openingTarget: OpeningTarget): GeneratedTimetable {
  const rules = getTimetableRules();
  const preparationDays = daysUntilOpening(openingTarget);
  const targetOpenDate = resolveOpeningTargetDate(openingTarget);
  const variant = preparationDays < 21 ? "compressed" : preparationDays <= 45 ? "base" : preparationDays <= 90 ? "relaxed" : "research";
  const variantLabel = rules.variants.find((item) => item.id === variant)?.label ?? "기본형";
  const scale = variant === "compressed" ? Math.max(0.25, preparationDays / 45) : variant === "base" ? 1 : variant === "relaxed" ? Math.min(2, preparationDays / 45) : Math.min(3, preparationDays / 45);
  const tasks: OpeningTask[] = rules.base_tasks.map((task) => {
    const offset = task.offset === 0 ? 0 : Math.min(-1, Math.round(task.offset * scale));
    return {
      id: task.id,
      day: offset === 0 ? "D-day" : `D${offset}`,
      title: task.title,
      category: task.category,
      description: `${variantLabel} 일정 기준으로 ${task.title}을 준비합니다.`,
      estimated_cost_min: task.requires_consultation ? 300_000 : 0,
      estimated_cost_max: task.requires_consultation ? 2_000_000 : 300_000,
      requires_consultation: task.requires_consultation,
      consultation_category: task.consultation_category,
      output: task.requires_consultation ? "상담 요청 또는 견적서" : "확인 체크",
      status_default: "pending"
    };
  });
  return { targetOpenDate, preparationDays, variant, variantLabel, tasks, openingTarget };
}
