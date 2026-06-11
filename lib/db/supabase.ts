type InsertResult = { ok: true } | { ok: false; error: string };

export async function insertIntoSupabase(table: string, payload: unknown): Promise<InsertResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return { ok: false, error: "supabase env not configured" };

  try {
    const endpoint = `${url.replace(/\/rest\/v1\/?$/, "")}/rest/v1/${table}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: secret,
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return { ok: false, error: `supabase insert failed: ${response.status}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "supabase insert failed" };
  }
}
