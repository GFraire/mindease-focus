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

interface TaskCardProps {
  task: Task;
  pending?: boolean;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onBringToToday?: (taskId: string) => void;
}

export function TaskCard({
  task,
  pending = false,
  onToggleComplete,
  onEdit,
  onStartFocus,
  onDelete,
  onBringToToday,
}: TaskCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
      <div className={cn("flex items-center gap-4", pending && "opacity-70")}>
        <Checkbox
          className="cursor-pointer h-5 w-5"
          checked={task.completed}
          onCheckedChange={(checked) =>
            onToggleComplete(task.id, Boolean(checked))
          }
        />

        <div className="flex flex-col gap-1">
          <span
            className={`text-body font-bold text-high-contrast ${
              task.completed && "line-through opacity-50"
            }`}
          >
            {task.title}
          </span>

          <div className="flex items-center gap-4 text-xs text-muted">
            {pending && (
              <div className="flex gap-2 items-center bg-muted/15! py-0.5 px-2 rounded-full">
                <Clock className="text-muted" size={16} />

                <span className="text-muted font-semibold text-body-sm">
                  PENDENTE
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-body-sm text-muted">
              <Timer className="h-4 w-4" />
              {task.focusDuration}m
            </div>

            <div
              className={cn(
                "flex items-center gap-1 rounded-sm border px-2 py-1 font-bold  bg-transparent",
                task.energy === "high" && "border-error text-error",
                task.energy === "medium" && "border-warning text-warning",
                task.energy === "low" && "border-info text-info",
              )}
            >
              <Zap className="h-4 w-4" />
              <span className="text-body-sm">
                Energia: {getEnergyLabel(task.energy)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {pending && onBringToToday && (
          <ChevronsDown
            className="text-primary cursor-pointer hover:opacity-80"
            size={24}
            onClick={() => onBringToToday(task.id)}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="text-muted hover:text-high-contrast">
            <MoreVertical className="cursor-pointer" size={20} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEdit(task)}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Editar detalhes
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onStartFocus(task)}
            >
              <Play className="mr-1 h-4 w-4" />
              Iniciar foco
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-500 focus:text-red-500 cursor-pointer"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="mr-1 h-4 w-4 text-red-500" />
              Excluir tarefa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
