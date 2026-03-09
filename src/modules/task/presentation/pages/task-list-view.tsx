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
  filteredLateTasks: Task[];
  filteredDateTasks: Task[];
  bringingToToday: boolean;
  showLateTasks: boolean;
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
  filteredLateTasks,
  filteredDateTasks,
  bringingToToday,
  showLateTasks,
  showDateTasks,
  onBringAllToToday,
  onBringToToday,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleComplete,
}: Props) {
  return (
    <div
      className="overflow-auto h-full flex flex-col gap-6"
      aria-live="polite"
      aria-busy={loading}
    >
      {showLateTasks && (
        <section
          className="flex flex-col gap-4"
          aria-labelledby="late-tasks-title"
        >
          <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <History className="text-muted" aria-hidden="true" />

              <h2
                id="late-tasks-title"
                className="text-muted font-semibold text-body"
              >
                Tarefas atrasadas
              </h2>

              {loading && (
                <span
                  className="text-xs text-muted animate-pulse"
                  role="status"
                >
                  atualizando...
                </span>
              )}
            </div>

            <BaseButton
              className="[&_svg]:size-5! text-primary rounded-full border-primary! font-bold cursor-pointer bg-primary/10! hover:bg-primary/20! hover:text-primary!"
              loading={bringingToToday}
              variant="outline"
              onClick={onBringAllToToday}
              aria-label="Trazer todas as tarefas atrasadas para hoje"
            >
              <CalendarArrowDown className="text-primary" aria-hidden="true" />

              <span className="text-body">
                {bringingToToday ? "Movendo..." : "Trazer todas para hoje"}
              </span>
            </BaseButton>
          </header>

          <ul role="list" className="flex flex-col gap-2">
            {filteredLateTasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  late
                  task={task}
                  onBringToToday={onBringToToday}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onStartFocus={onStartFocus}
                  onToggleComplete={onToggleComplete}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {showDateTasks && (
        <section
          className="flex flex-col gap-4"
          aria-labelledby="date-tasks-title"
        >
          <header className="flex flex-wrap items-center gap-2">
            <CalendarCheck className="text-muted" aria-hidden="true" />

            <h2
              id="date-tasks-title"
              className="text-muted font-semibold text-body"
            >
              Para {dateFilter === "today" ? "hoje" : formatDate(customDate)}
            </h2>

            {loading && (
              <span className="text-xs text-muted animate-pulse" role="status">
                atualizando...
              </span>
            )}
          </header>

          <ul role="list" className="flex flex-col gap-2">
            {filteredDateTasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onStartFocus={onStartFocus}
                  onToggleComplete={onToggleComplete}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {dateTasks.length === 0 && !loading && (
        <section
          className="flex items-center justify-center h-full flex-col gap-4 py-10"
          aria-live="polite"
        >
          <Sprout
            className="mb-4 h-24 w-24 sm:h-37.5 sm:w-37.5"
            aria-hidden="true"
          />

          <h2 className="text-heading font-bold text-high-contrast">
            Sua lista está limpa
          </h2>

          <p className="text-muted text-body text-center">
            Que tal aproveitar este momento para planejar algo novo? <br />
            Adicione sua próxima tarefa e continue avançando.
          </p>
        </section>
      )}
    </div>
  );
}
