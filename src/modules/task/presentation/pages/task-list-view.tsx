import {
  CalendarArrowDown,
  CalendarCheck,
  History,
  Sprout,
} from "lucide-react";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { TaskCard } from "../components/task-card";
import { formatDate } from "@/shared/utils/date/date-helper";
import type { Task } from "../../domain/entities/task";
import type { DateFilter } from "./tasks";

type Props = {
  dateFilter: DateFilter;
  customDate: Date;
  loading: boolean;
  dateTasks: Task[];
  filteredPendingTasks: Task[];
  filteredDateTasks: Task[];
  bringingToToday: boolean;
  showPendingTasks: boolean;
  showDateTasks: boolean;
  onBringAllToToday: () => void;
  onBringToToday: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
};

export function TaskListView({
  dateFilter,
  customDate,
  loading,
  dateTasks,
  filteredPendingTasks,
  filteredDateTasks,
  bringingToToday,
  showPendingTasks,
  showDateTasks,
  onBringAllToToday,
  onBringToToday,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleComplete,
}: Props) {
  return (
    <div className="overflow-auto h-full flex flex-col">
      {showPendingTasks && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <History className="text-muted" />

              <span className="text-muted font-semibold text-body">
                TAREFAS PENDENTES
              </span>

              {loading && (
                <span className="text-xs text-muted animate-pulse">
                  atualizando...
                </span>
              )}
            </div>

            <BaseButton
              className="[&_svg]:size-5! text-primary rounded-full border-primary! font-bold cursor-pointer bg-primary/10! hover:bg-primary/20! hover:text-primary! "
              loading={bringingToToday}
              variant="outline"
              onClick={onBringAllToToday}
            >
              <CalendarArrowDown className="text-primary" />

              <span className="text-body">
                {bringingToToday ? "Movendo..." : "Trazer todas para hoje"}
              </span>
            </BaseButton>
          </div>

          <div className="flex flex-col gap-2">
            {filteredPendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                pending
                task={task}
                onBringToToday={onBringToToday}
                onDelete={onDelete}
                onEdit={onEdit}
                onStartFocus={onStartFocus}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      )}

      {showDateTasks && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="text-muted" />

            <span className="text-muted font-semibold text-body">
              PARA {dateFilter === "today" ? "HOJE" : formatDate(customDate)}
            </span>

            {loading && (
              <span className="text-xs text-muted animate-pulse">
                atualizando...
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {filteredDateTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
                onStartFocus={onStartFocus}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      )}

      {dateTasks.length === 0 && !loading && (
        <div className="flex items-center justify-center h-full flex-col gap-4 py-10">
          <Sprout className="mb-4" size={150} />

          <span className="text-heading font-bold text-high-contrast">
            Sua lista está limpa
          </span>

          <span className="text-muted text-body text-center">
            Que tal aproveitar este momento para planejar algo novo? <br />
            Adicione sua próxima tarefa e continue avançando.
          </span>
        </div>
      )}
    </div>
  );
}
