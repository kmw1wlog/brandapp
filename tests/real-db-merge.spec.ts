import { execSync } from "node:child_process";
import { expect, test } from "playwright/test";

test("real DB audit, build, validate scripts pass", async () => {
  test.setTimeout(120000);
  const audit = execSync("node scripts/audit-real-db.mjs", { encoding: "utf8" });
  const build = execSync("node scripts/build-real-branch-db.mjs", { encoding: "utf8" });
  const validate = execSync("node scripts/validate-real-branch-db.mjs", { encoding: "utf8" });

  expect(audit).toContain("wrote docs/real-db-audit.md");
  expect(build).toContain("built real branch db");
  expect(validate).toContain("ok: franchise direct cohort에 최소 7개 브랜드 존재");
});
