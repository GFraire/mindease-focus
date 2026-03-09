import { Play, Target } from "lucide-react";
import { Button } from "@/shared/ui/components/ui/button";
import { FocusNowTaskActions } from "./focus-now-task-action";
import type { Task } from "../../domain/entities/task";

interface FocusNowCardProps {
  task: Task;
  onStart?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
}

export function FocusNowCard({
  task,
  onStart,
  onEdit,
  onDelete,
  onToggleComplete,
}: FocusNowCardProps) {
  const duration = task.focusDuration ?? 60;

  const titleId = `focus-task-${task.id}`;

  return (
    <section
      aria-labelledby={titleId}
      aria-live="polite"
      className="w-full flex flex-col sm:flex-row rounded-md shadow overflow-hidden border border-border bg-card"
    >
      <div
        className="flex items-center justify-center h-28 sm:h-auto sm:w-50 bg-linear-to-b from-indigo-600 to-purple-600"
        aria-hidden="true"
      >
        <Target
          className="h-10 w-10 sm:h-12 sm:w-12 text-white"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-6">
        <header className="flex flex-col gap-2">
          <span className="text-caption font-bold uppercase tracking-wide text-primary">
            Em foco agora
          </span>

          <h2
            id={titleId}
            className="text-heading-lg font-bold text-high-contrast"
          >
            {task.title}
          </h2>

          <p className="text-body text-muted">
            De acordo com o seu painel cognitivo, esta é a tarefa que mais
            merece sua atenção agora.
            <br />
            Concentre-se por{" "}
            <strong className="text-primary">{duration} minutos</strong> sem
            distrações e faça progresso real.
          </p>
        </header>

        <div
          className="flex flex-row  items-center gap-3 sm:gap-4"
          role="group"
          aria-label={`Ações da tarefa ${task.title}`}
        >
          <Button
            onClick={() => onStart?.(task)}
            aria-label={`Iniciar foco na tarefa ${task.title} por ${duration} minutos`}
            className="gap-2 bg-primary cursor-pointer text-white! hover:bg-primary/80 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Play className="h-5 w-5" aria-hidden="true" />
            Iniciar foco
          </Button>

          <FocusNowTaskActions
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </div>
      </div>
    </section>
  );
}
