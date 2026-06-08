import { insertIntoSupabase, upsertChatSession } from "./supabase";

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

export async function saveFeedbackEntry(payload: unknown) {
  const inserted = await insertIntoSupabase("branch_feedback_entries", payload);
  if (inserted.ok) return { ok: true, source: "supabase" };
  return { ok: true, source: "mock", warning: inserted.error };
}

export async function saveChatSession(sessionKey: string, payload: unknown) {
  const inserted = await upsertChatSession(sessionKey, payload);
  if (inserted.ok) return { ok: true, source: "supabase" };
  return { ok: true, source: "mock", warning: inserted.error };
}

export async function saveChatMessage(payload: unknown) {
  const inserted = await insertIntoSupabase("branch_chat_messages", payload);
  if (inserted.ok) return { ok: true, source: "supabase" };
  return { ok: true, source: "mock", warning: inserted.error };
}
