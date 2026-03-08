import { MoreHorizontal, Pencil, Trash, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/components/ui/dropdown-menu";

import type { Task } from "../../domain/entities/task";

interface Props {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
}

export function FocusNowTaskActions({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: Props) {
  const completeLabel = task.completed
    ? "Marcar tarefa como pendente"
    : "Concluir tarefa";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`Abrir ações da tarefa ${task.title}`}
          aria-haspopup="menu"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-48"
        aria-label={`Menu de ações da tarefa ${task.title}`}
      >
        <DropdownMenuItem
          onClick={() => onEdit?.(task)}
          className="cursor-pointer"
          aria-label={`Editar tarefa ${task.title}`}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Editar detalhes
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onToggleComplete?.(task.id, !task.completed)}
          className="cursor-pointer"
          aria-label={`${completeLabel}: ${task.title}`}
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {task.completed ? "Marcar como pendente" : "Concluir tarefa"}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete?.(task.id)}
          className="cursor-pointer text-destructive focus:text-destructive"
          aria-label={`Excluir tarefa ${task.title}`}
        >
          <Trash className="h-4 w-4 text-destructive" aria-hidden="true" />
          Excluir tarefa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
