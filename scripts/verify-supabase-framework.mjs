import { withSupabaseClient } from "./lib/supabase-admin.mjs";

async function main() {
  const result = await withSupabaseClient(async (client) => {
    const registryCount = await client.query("select count(*)::int as count from public.branch_dataset_registry");
    const snapshotCount = await client.query("select count(*)::int as count from public.branch_dataset_snapshots");
    const latestRuns = await client.query(
      `select run_type, status, finished_at
       from public.branch_sync_runs
       order by started_at desc
       limit 5`
    );
    return {
      registryCount: registryCount.rows[0]?.count ?? 0,
      snapshotCount: snapshotCount.rows[0]?.count ?? 0,
      latestRuns: latestRuns.rows
    };
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
