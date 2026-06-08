type InsertResult = { ok: true } | { ok: false; error: string };

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return null;
  return { url, secret };
}

async function requestSupabase(table: string, method: "POST" | "PATCH", payload: unknown, query = ""): Promise<InsertResult> {
  const config = getSupabaseConfig();
  if (!config) return { ok: false, error: "supabase env not configured" };

  try {
    const endpoint = `${config.url.replace(/\/rest\/v1\/?$/, "")}/rest/v1/${table}${query}`;
    const response = await fetch(endpoint, {
      method,
      headers: {
        apikey: config.secret,
        Authorization: `Bearer ${config.secret}`,
        "Content-Type": "application/json",
        Prefer: method === "POST" ? "return=minimal" : "return=representation"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return { ok: false, error: `supabase ${method.toLowerCase()} failed: ${response.status}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : `supabase ${method.toLowerCase()} failed` };
  }
}

export async function insertIntoSupabase(table: string, payload: unknown): Promise<InsertResult> {
  return requestSupabase(table, "POST", payload);
}

export async function upsertChatSession(sessionKey: string, payload: unknown): Promise<InsertResult> {
  const inserted = await insertIntoSupabase("branch_chat_sessions", payload);
  if (inserted.ok) return inserted;
  return requestSupabase(
    "branch_chat_sessions",
    "PATCH",
    payload,
    `?session_key=eq.${encodeURIComponent(sessionKey)}`
  );
}
