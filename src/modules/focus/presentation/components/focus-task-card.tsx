import { Checkbox } from "@/shared/ui/components/ui/checkbox";
import type { Task } from "@/modules/task/domain/entities/task";

interface Props {
  task: Task;
}

export function FocusTaskCard({ task }: Props) {
  const subtasks = task.subtasks.filter((s) => s.trim() !== "");

  if (!subtasks.length) return null;

  return (
    <div className="flex flex-col gap-2 bg-card p-4 w-full rounded-md border border-border">
      {subtasks.map((subtask, index) => (
        <div
          className="flex items-center gap-4 p-3 bg-background rounded-md"
          key={index}
        >
          <Checkbox className="border-muted-light size-5 border-2 cursor-pointer" />

          <span className="text-body text-high-contrast">{subtask}</span>
        </div>
      ))}
    </div>
  );
}
