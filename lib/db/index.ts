import { insertIntoSupabase } from "./supabase";

export * from "./local";

export async function saveGroupBuyInterest(payload: unknown) {
  const inserted = await insertIntoSupabase("groupbuy_interests", payload);
  if (inserted.ok) return { ok: true, source: "supabase" };
  return { ok: true, source: "mock", warning: inserted.error };
}

export async function saveLead(payload: unknown) {
  const inserted = await insertIntoSupabase("leads", payload);
  if (inserted.ok) return { ok: true, source: "supabase" };
  return { ok: true, source: "mock", warning: inserted.error };
}
