"use client";

import { createLocalStorageAdapter } from "./local-storage-adapter";

export function createSupabaseStorageAdapter() {
  return createLocalStorageAdapter();
}
