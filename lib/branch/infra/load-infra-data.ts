import missingBusinessInfraRaw from "@/src/data/branch/real/infra/missing_business_infra_db.json";
import busanExecutionInfraRaw from "@/src/data/branch/real/infra/busan_meatbowl_local_execution_db.json";

export function loadInfraData() {
  return {
    missingBusinessInfra: missingBusinessInfraRaw as Record<string, unknown>,
    busanExecutionInfra: busanExecutionInfraRaw as Record<string, unknown>
  };
}
