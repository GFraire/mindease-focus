import { Checkbox } from "@/shared/ui/components/ui/checkbox";
import type { Task } from "@/modules/task/domain/entities/task";

interface Props {
  task: Task;
}

export function FocusTaskCard({ task }: Props) {
  const subtasks = task.subtasks.filter((s) => s.trim() !== "");

  if (!subtasks.length) return null;

  return (
    <div
      className="flex flex-col gap-2 bg-card p-4 w-full rounded-md border border-border"
      role="group"
      aria-label="Subtarefas da tarefa atual"
    >
      {subtasks.map((subtask, index) => {
        const id = `subtask-${index}`;

        return (
          <label
            htmlFor={id}
            className="flex items-center gap-4 p-3 bg-background rounded-md"
            key={index}
          >
            <Checkbox
              id={id}
              className="border-muted-light size-5 border-2 cursor-pointer"
            />

            <span id={`${id}-label`} className="text-body text-high-contrast">
              {subtask}
            </span>
          </label>
        );
      })}
    </div>
  );
}
