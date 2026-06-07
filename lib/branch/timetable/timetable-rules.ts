import timetableRulesRaw from "@/src/data/branch/real/timetable_rules.json";
import type { TimetableRules } from "./timetable-types";

export function getTimetableRules() {
  return timetableRulesRaw as TimetableRules;
}
