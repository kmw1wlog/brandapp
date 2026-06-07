import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "gpt_db", "ver2", "branch_gpt_db_package", "gpt_db");
const target = path.join(root, "src", "data", "branch");

if (!existsSync(source)) {
  throw new Error(`Missing ver2 source data: ${source}`);
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true, force: true });

function countJsonFiles(dir) {
  return readdirSync(dir).reduce((count, entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return count + countJsonFiles(full);
    return count + (entry.endsWith(".json") ? 1 : 0);
  }, 0);
}

console.log(`Synced Branch ver2 data to ${path.relative(root, target)}`);
console.log(`JSON files: ${countJsonFiles(target)}`);
