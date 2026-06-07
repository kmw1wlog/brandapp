import type { TimelineState, TimelineTaskStatus } from "@/lib/branch/types";

export function preserveTaskState(previous: TimelineState, taskIds: string[]) {
  return Object.fromEntries(
    taskIds.map((taskId) => {
      const current = previous.tasks[taskId];
      return [taskId, current ?? { taskId, status: "pending" as TimelineTaskStatus }];
    })
  );
}
