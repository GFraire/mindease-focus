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

  return (
    <div className="w-full flex rounded-md shadow overflow-hidden border border-border bg-card">
      <div className="flex items-center justify-center aspect-square bg-linear-to-b from-indigo-600 to-purple-600 px-10">
        <Target className="h-12 w-12 text-white" />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div className="flex flex-col gap-2">
          <span className="text-caption font-bold uppercase tracking-wide text-primary">
            Em foco agora
          </span>

          <h2 className="text-heading-lg font-bold text-high-contrast">
            {task.title}
          </h2>

          <p className="text-body text-muted">
            De acordo com o seu painel cognitivo, esta é a tarefa que mais
            merece sua atenção agora. <br />
            Concentre-se por{" "}
            <span className="text-primary">{duration} minutos</span> sem
            distrações e faça progresso real.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => onStart?.(task)}
            className="gap-2 bg-primary cursor-pointer text-white! hover:bg-primary/80 font-semibold"
          >
            <Play className="h-5 w-5" />
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
    </div>
  );
}