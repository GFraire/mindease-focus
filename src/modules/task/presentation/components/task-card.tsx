import { Checkbox } from "@/shared/ui/components/ui/checkbox";
import {
  Clock,
  Zap,
  MoreVertical,
  Pencil,
  Play,
  Trash2,
  Timer,
  ChevronsDown,
  ArrowLeftRight,
  Dot,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/components/ui/dropdown-menu";

import type { Task } from "../../domain/entities/task";
import { cn } from "@/shared/lib/utils";
import { getEnergyLabel } from "@/shared/utils/translate/translate-label";
import type { TaskStatus, TaskViewMode } from "../pages/tasks";
import { useCognitiveSettingsStore } from "@/shared/ui/store/cognitive-settings-store";

interface TaskCardProps {
  task: Task;
  late?: boolean;
  viewMode?: TaskViewMode;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onBringToToday?: (taskId: string) => void;
  onMoveStatus?: (taskId: string, status: TaskStatus) => void;
}

export function TaskCard({
  task,
  late = false,
  viewMode,
  onToggleComplete,
  onEdit,
  onStartFocus,
  onDelete,
  onBringToToday,
  onMoveStatus,
}: TaskCardProps) {
  const interfaceComplexity = useCognitiveSettingsStore(
    (state) => state.interfaceComplexity,
  );

  const titleId = `task-title-${task.id}`;

  const showIntermediate =
    interfaceComplexity === "intermediate" ||
    interfaceComplexity === "advanced";
  const showAdvanced = interfaceComplexity === "advanced";

  const visibleSubtasks = task.subtasks
    ?.map((s) => s.trim())
    .filter((s) => s.length > 0);

  const statusOptions = [];

  if (viewMode === "kanban" && onMoveStatus) {
    if (task.completed) {
      statusOptions.push(
        {
          label: 'Mover para "Em progresso"',
          status: "inProgress",
        },
        {
          label: 'Mover para "Pendente"',
          status: "pending",
        },
      );
    } else if (task.inProgress) {
      statusOptions.push({
        label: 'Mover para "Pendente"',
        status: "pending",
      });
    } else {
      statusOptions.push({
        label: 'Mover para "Em progresso"',
        status: "inProgress",
      });
    }
  }

  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3  ">
        <div
          className={cn(
            "flex items-start sm:items-center gap-3 sm:gap-4",
            late && "opacity-70",
            task.completed && "opacity-60",
          )}
        >
          <Checkbox
            className="cursor-pointer h-5 w-5 border-muted-light mt-1 sm:mt-0"
            checked={task.completed}
            aria-labelledby={titleId}
            aria-label={
              task.completed
                ? `Marcar tarefa ${task.title} como pendente`
                : `Concluir tarefa ${task.title}`
            }
            onCheckedChange={(checked) =>
              onToggleComplete(task.id, Boolean(checked))
            }
          />

          <div className="flex flex-col gap-1">
            <span
              id={titleId}
              className={`text-body font-bold text-high-contrast ${
                task.completed && "line-through opacity-50"
              }`}
            >
              {task.title}
            </span>

            <div
              className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted"
              role="group"
              aria-label="Informações da tarefa"
            >
              {late && showIntermediate && (
                <div
                  className="flex gap-2 items-center bg-muted/15! py-0.5 px-2 rounded-full"
                  role="status"
                  aria-label="Tarefa atrasada"
                >
                  <Clock className="text-muted" size={16} aria-hidden="true" />

                  <span className="text-muted font-semibold text-body-sm">
                    ATRASADA
                  </span>
                </div>
              )}

              <div
                className="flex items-center gap-1 text-body-sm text-muted"
                aria-label={`Duração de foco ${task.focusDuration} minutos`}
              >
                <Timer className="h-4 w-4" aria-hidden="true" />
                {task.focusDuration}m
              </div>

              {showIntermediate && (
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-sm border px-2 py-1 font-bold bg-transparent",
                    task.energy === "high" && "border-error text-error",
                    task.energy === "medium" && "border-warning text-warning",
                    task.energy === "low" && "border-info text-info",
                  )}
                  aria-label={`Nível de energia necessário: ${getEnergyLabel(
                    task.energy,
                  )}`}
                >
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  <span className="text-body-sm">
                    Energia: {getEnergyLabel(task.energy)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {late && onBringToToday && (
            <button
              aria-label={`Trazer tarefa ${task.title} para hoje`}
              className="text-primary cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              onClick={() => onBringToToday(task.id)}
            >
              <ChevronsDown aria-hidden="true" size={24} />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              className="text-muted hover:text-high-contrast focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label={`Abrir ações da tarefa ${task.title}`}
            >
              <MoreVertical
                aria-hidden="true"
                className="cursor-pointer"
                size={20}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              aria-label={`Menu de ações da tarefa ${task.title}`}
            >
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.status}
                  className="cursor-pointer"
                  onClick={() =>
                    onMoveStatus?.(task.id, option.status as TaskStatus)
                  }
                  aria-label={`${option.label} para tarefa ${task.title}`}
                >
                  <ArrowLeftRight className="mr-1 h-4 w-4" aria-hidden="true" />
                  {option.label}
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onEdit(task)}
                aria-label={`Editar tarefa ${task.title}`}
              >
                <Pencil className="mr-1 h-4 w-4" aria-hidden="true" />
                Editar detalhes
              </DropdownMenuItem>

              {!task.completed && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onStartFocus(task)}
                  aria-label={`Iniciar foco na tarefa ${task.title}`}
                >
                  <Play className="mr-1 h-4 w-4" aria-hidden="true" />
                  Iniciar foco
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 cursor-pointer"
                onClick={() => onDelete(task.id)}
                aria-label={`Excluir tarefa ${task.title}`}
              >
                <Trash2
                  className="mr-1 h-4 w-4 text-red-500"
                  aria-hidden="true"
                />
                Excluir tarefa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showAdvanced && visibleSubtasks?.length > 0 && (
        <ul
          className="flex flex-col gap-1 text-body-sm text-muted mt-1"
          aria-label="Subtarefas"
        >
          {visibleSubtasks.map((subtask, index) => (
            <li key={index} className="flex items-center gap-2">
              <Dot className="h-6 w-6" aria-hidden="true" />
              {subtask}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
