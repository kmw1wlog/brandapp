import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "gpt_db", "gpt_db.txt");
const dataDir = path.join(root, "src", "data");

const requiredFiles = [
  "suppliers.json",
  "menus.json",
  "ingredients.json",
  "menuIngredients.json",
  "woosamgyupDetail.json",
  "brandReferences.json",
  "groupBuys.json",
  "promoProviders.json",
  "screenCopy.json",
  "prompts.json"
];

function readJson(file) {
  const target = path.join(dataDir, file);
  if (!existsSync(target)) return null;
  return JSON.parse(readFileSync(target, "utf8"));
}

function writeJson(file, data) {
  writeFileSync(path.join(dataDir, file), `${JSON.stringify(data, null, 2)}\n`);
}

if (!existsSync(source)) {
  throw new Error("gpt_db/gpt_db.txt not found");
}

mkdirSync(dataDir, { recursive: true });
const text = readFileSync(source, "utf8");
const summary = [];

for (const file of requiredFiles) {
  const existing = readJson(file);
  if (existing) {
    writeJson(file, existing);
    summary.push(`${file}: kept existing valid JSON`);
  } else {
    const fallback = file.endsWith(".json") ? [] : {};
    writeJson(file, fallback);
    summary.push(`${file}: created fallback`);
  }
}

console.log("gpt_db bootstrap complete");
console.log(`source chars: ${text.length}`);
console.log(summary.join("\n"));
