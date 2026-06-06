import { getPromptTemplate } from "@/lib/db/local";

export function buildPrompt(task: string, context: Record<string, unknown>) {
  let template = getPromptTemplate(task as Parameters<typeof getPromptTemplate>[0]) ?? `Task: ${task}`;
  for (const [key, value] of Object.entries(context)) {
    template = template.replaceAll(`{{${key}}}`, typeof value === "string" ? value : JSON.stringify(value));
  }
  return template;
}
