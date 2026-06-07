import assumptionsRaw from "@/src/data/branch/real/accounting_simulation_assumptions.json";
import type { FinanceAssumptions } from "./finance-types";

export function getFinanceAssumptions() {
  return assumptionsRaw as FinanceAssumptions;
}

export const scenarioLabels = {
  conservative: "보수적",
  base: "기준",
  optimistic: "낙관적"
} as const;

export const scenarioRamp = {
  conservative: [0, 0.55, 0.7, 0.82, 0.9],
  base: [0, 0.65, 0.85, 1, 1.08],
  optimistic: [0, 0.85, 1.05, 1.2, 1.3]
} as const;
