import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/ui/components/ui/toggle-group";
import type { TaskViewMode } from "../pages/tasks";

interface ViewSwitcherProps {
  value: TaskViewMode;
  onChange: (value: TaskViewMode) => void;
}

export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div
      className="bg-muted/10 p-1 rounded-md w-fit"
      role="group"
      aria-label="Alternar modo de visualização das tarefas"
    >
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as TaskViewMode)}
        aria-label="Modo de visualização"
      >
        <ToggleGroupItem
          value="list"
          aria-label="Visualizar tarefas em lista"
          aria-pressed={value === "list"}
          className="px-6 py-1 rounded-md! cursor-pointer data-[state=on]:bg-card data-[state=on]:text-primary hover:data-[state=off]:bg-transparent"
        >
          Lista
        </ToggleGroupItem>

        <ToggleGroupItem
          value="kanban"
          aria-label="Visualizar tarefas em quadro Kanban"
          aria-pressed={value === "kanban"}
          className="px-6 py-1 rounded-md! cursor-pointer data-[state=on]:bg-card data-[state=on]:text-primary hover:data-[state=off]:bg-transparent"
        >
          Kanban
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
