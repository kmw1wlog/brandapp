import crypto from "crypto";
import fs from "fs";
import path from "path";
import pg from "pg";

const { Client } = pg;
let envLoaded = false;

function ensureEnvLoaded() {
  if (envLoaded) return;
  envLoaded = true;
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function getSupabaseDbConfig() {
  ensureEnvLoaded();
  const password = process.env.SUPABASE_DB_PASSWORD;
  const host = process.env.SUPABASE_DB_HOST;
  const user = process.env.SUPABASE_DB_USER ?? "postgres";
  const database = process.env.SUPABASE_DB_NAME ?? "postgres";
  const port = Number(process.env.SUPABASE_DB_PORT ?? "5432");

  if (!password || !host) {
    throw new Error("SUPABASE_DB_PASSWORD or SUPABASE_DB_HOST is missing");
  }

  return {
    host,
    user,
    database,
    port,
    password,
    ssl: { rejectUnauthorized: false }
  };
}

export async function withSupabaseClient(callback) {
  const client = new Client(getSupabaseDbConfig());
  await client.connect();
  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

export function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

export function readText(root, relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

export function datasetMetaFromPayload(payload) {
  const rowCount = Array.isArray(payload) ? payload.length : payload && typeof payload === "object" ? Object.keys(payload).length : 1;
  const serialized = JSON.stringify(payload);
  return {
    rowCount,
    byteSize: Buffer.byteLength(serialized),
    checksum: crypto.createHash("sha256").update(serialized).digest("hex")
  };
}
