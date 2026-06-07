import type { BranchStorageAdapter } from "./types";

export function createStorage(adapter: BranchStorageAdapter) {
  return adapter;
}
