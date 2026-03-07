import { Plus } from "lucide-react";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { ViewSwitcher } from "./view-switcher";
import type { TaskViewMode } from "../pages/tasks";

type Props = {
  viewMode: "list" | "kanban";
  onCreateTask: () => void;
  onChangeViewMode: (value: TaskViewMode) => void;
};

export function TasksHeader({ viewMode, onCreateTask, onChangeViewMode }: Props) {
  const title = viewMode === "list" ? "Lista de tarefas" : "Quadro Kanban";

  const subtitle =
    viewMode === "list"
      ? "Sua lista organizada por prioridade de execução e energia."
      : "Gerencie suas tarefas de forma calma e organizada.";

  return (
    <div className="flex gap-3 items-center w-full">
      <div className="flex flex-col flex-1 gap-1">
        <h3 className="text-high-contrast text-heading-lg font-bold">
          {title}
        </h3>

        <span className="text-body text-muted">{subtitle}</span>
      </div>

      <ViewSwitcher value={viewMode} onChange={onChangeViewMode} />

      <BaseButton
        className="bg-primary text-white! cursor-pointer"
        onClick={onCreateTask}
      >
        <Plus />
        Nova tarefa
      </BaseButton>
    </div>
  );
}
