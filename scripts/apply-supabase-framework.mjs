import path from "path";
import { readText, withSupabaseClient } from "./lib/supabase-admin.mjs";

const root = process.cwd();

async function main() {
  const sql = readText(root, "supabase/branch_framework.sql");

  await withSupabaseClient(async (client) => {
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query(
        `insert into public.branch_sync_runs (run_type, status, summary, finished_at)
         values ($1, $2, $3::jsonb, now())`,
        ["framework_apply", "success", JSON.stringify({ source: "supabase/branch_framework.sql", appliedAt: new Date().toISOString() })]
      );
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    }
  });

  console.log(JSON.stringify({
    ok: true,
    applied: path.join(root, "supabase/branch_framework.sql")
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
