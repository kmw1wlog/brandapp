import type { OpeningTask } from "@/lib/branch/types";
import type { OpeningTarget } from "@/lib/branch/finance/finance-types";

export type TimetableVariant = "compressed" | "base" | "relaxed" | "research";

export type TimetableRuleTask = {
  id: string;
  offset: number;
  title: string;
  category: string;
  requires_consultation: boolean;
  consultation_category?: string;
};

export type TimetableRules = {
  variants: Array<{ id: TimetableVariant; label: string; min_days: number; max_days: number }>;
  base_tasks: TimetableRuleTask[];
};

export type GeneratedTimetable = {
  targetOpenDate: string;
  preparationDays: number;
  variant: TimetableVariant;
  variantLabel: string;
  tasks: OpeningTask[];
  openingTarget: OpeningTarget;
};
