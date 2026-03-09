import { Plus } from "lucide-react";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { ViewSwitcher } from "./view-switcher";
import type { TaskViewMode } from "../pages/tasks";

type Props = {
  viewMode: "list" | "kanban";
  onCreateTask: () => void;
  onChangeViewMode: (value: TaskViewMode) => void;
};

export function TasksHeader({
  viewMode,
  onCreateTask,
  onChangeViewMode,
}: Props) {
  const title = viewMode === "list" ? "Lista de tarefas" : "Quadro Kanban";

  const subtitle =
    viewMode === "list"
      ? "Sua lista organizada por prioridade de execução e energia."
      : "Gerencie suas tarefas de forma calma e organizada.";

  return (
    <header
      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 w-full"
      aria-labelledby="tasks-header-title"
    >
      <div className="flex flex-col flex-1 gap-1">
        <h2
          id="tasks-header-title"
          className="text-high-contrast text-heading-lg font-bold"
        >
          {title}
        </h2>

        <p className="text-body text-muted">{subtitle}</p>
      </div>

      <div
        aria-label="Modo de visualização das tarefas"
        className="flex items-center gap-2"
      >
        <ViewSwitcher value={viewMode} onChange={onChangeViewMode} />
      </div>

      <BaseButton
        className="bg-primary text-white! cursor-pointer w-full sm:w-auto"
        onClick={onCreateTask}
        aria-label="Criar nova tarefa"
      >
        <Plus aria-hidden="true" />
        Nova tarefa
      </BaseButton>
    </header>
  );
}
