import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/shared/ui/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/components/ui/dropdown-menu";

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FocusNowTaskActions({ onEdit, onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-42">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Pencil className="h-4 w-4" />
          Editar detalhes
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash className="h-4 w-4 text-destructive" />
          Excluir tarefa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
