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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-48">
        <DropdownMenuItem
          onClick={() => onEdit?.(task)}
          className="cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
          Editar detalhes
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onToggleComplete?.(task.id, !task.completed)}
          className="cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4" />
          {task.completed ? "Marcar como pendente" : "Concluir tarefa"}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete?.(task.id)}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash className="h-4 w-4 text-destructive" />
          Excluir tarefa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
