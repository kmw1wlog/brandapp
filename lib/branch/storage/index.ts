"use client";

import { createStorage } from "./storage-adapter";
import { createLocalStorageAdapter } from "./local-storage-adapter";
import { createSupabaseStorageAdapter } from "./supabase-storage-adapter";

export function getBranchStorage() {
  const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return createStorage(hasSupabaseConfig ? createSupabaseStorageAdapter() : createLocalStorageAdapter());
}

export type { BranchStorageAdapter } from "./types";
