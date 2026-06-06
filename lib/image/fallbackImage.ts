export function getFallbackImage(prompt: string) {
  return {
    ok: true,
    source: "fallback" as const,
    status: "fallback" as const,
    imageUrl: null,
    taskId: null,
    prompt
  };
}
