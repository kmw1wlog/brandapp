"use client";

import { createLocalStorageAdapter } from "./local-storage-adapter";
import type { BranchStorageAdapter } from "./types";

export function createSupabaseStorageAdapter() {
  const local = createLocalStorageAdapter();

  return {
    ...local,
    async saveConsultationLead(input) {
      await local.saveConsultationLead(input);
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        });
      } catch {}
    },
    async saveFeedback(input) {
      await local.saveFeedback(input);
      try {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        });
      } catch {}
    }
  } satisfies BranchStorageAdapter;
}
