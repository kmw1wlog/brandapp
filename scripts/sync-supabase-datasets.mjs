import { datasetMetaFromPayload, readJson, withSupabaseClient } from "./lib/supabase-admin.mjs";

const root = process.cwd();

async function main() {
  const manifest = readJson(root, "supabase/branch_dataset_manifest.json");
  const startedAt = new Date().toISOString();

  await withSupabaseClient(async (client) => {
    const runId = await client.query(
      `insert into public.branch_sync_runs (run_type, status, summary)
       values ($1, $2, $3::jsonb)
       returning id`,
      ["dataset_sync", "running", JSON.stringify({ startedAt, datasetCount: manifest.length })]
    ).then((result) => result.rows[0]?.id);

    try {
      for (const dataset of manifest) {
        const payload = readJson(root, dataset.source_path);
        const meta = datasetMetaFromPayload(payload);
        const sourceTimestamp = new Date().toISOString();

        await client.query(
          `insert into public.branch_dataset_registry (
             dataset_id, dataset_name, domain, source_path, description, json_version,
             tags, row_count, byte_size, checksum, latest_source_timestamp, synced_at, metadata
           )
           values ($1, $2, $3, $4, $5, $6, $7::text[], $8, $9, $10, $11, now(), $12::jsonb)
           on conflict (dataset_id) do update set
             dataset_name = excluded.dataset_name,
             domain = excluded.domain,
             source_path = excluded.source_path,
             description = excluded.description,
             json_version = excluded.json_version,
             tags = excluded.tags,
             row_count = excluded.row_count,
             byte_size = excluded.byte_size,
             checksum = excluded.checksum,
             latest_source_timestamp = excluded.latest_source_timestamp,
             synced_at = excluded.synced_at,
             metadata = excluded.metadata`,
          [
            dataset.dataset_id,
            dataset.dataset_name,
            dataset.domain,
            dataset.source_path,
            dataset.description,
            dataset.json_version,
            dataset.tags,
            meta.rowCount,
            meta.byteSize,
            meta.checksum,
            sourceTimestamp,
            JSON.stringify({ syncedFrom: dataset.source_path })
          ]
        );

        await client.query(
          `insert into public.branch_dataset_snapshots (
             dataset_id, version_tag, payload, row_count, byte_size, checksum, source_timestamp, metadata
           )
           values ($1, $2, $3::jsonb, $4, $5, $6, $7, $8::jsonb)
           on conflict (dataset_id, version_tag) do update set
             payload = excluded.payload,
             row_count = excluded.row_count,
             byte_size = excluded.byte_size,
             checksum = excluded.checksum,
             source_timestamp = excluded.source_timestamp,
             synced_at = now(),
             metadata = excluded.metadata`,
          [
            dataset.dataset_id,
            dataset.json_version,
            JSON.stringify(payload),
            meta.rowCount,
            meta.byteSize,
            meta.checksum,
            sourceTimestamp,
            JSON.stringify({ dataset_name: dataset.dataset_name, tags: dataset.tags })
          ]
        );
      }

      await client.query(
        `update public.branch_sync_runs
         set status = 'success',
             summary = $2::jsonb,
             finished_at = now()
         where id = $1`,
        [runId, JSON.stringify({ syncedAt: new Date().toISOString(), datasetCount: manifest.length })]
      );
    } catch (error) {
      await client.query(
        `update public.branch_sync_runs
         set status = 'failed',
             error_message = $2,
             finished_at = now()
         where id = $1`,
        [runId, error instanceof Error ? error.message : "unknown sync error"]
      );
      throw error;
    }
  });

  console.log(JSON.stringify({ ok: true, synced: manifest.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
