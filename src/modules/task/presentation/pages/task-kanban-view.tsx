import type { Task } from "../../domain/entities/task";
import { KanbanColumn } from "../components/kanban-column";
import { TaskCard } from "../components/task-card";
import type { TaskStatus } from "./tasks";

type Props = {
  filteredLateTasks: Task[];
  filteredDateTasks: Task[];
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onMoveStatusTask: (taskId: string, status: TaskStatus) => void;
};

export function TaskKanbanView({
  filteredLateTasks,
  filteredDateTasks,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleComplete,
  onMoveStatusTask,
}: Props) {
  const allTasks = [...filteredLateTasks, ...filteredDateTasks];

  const pending = allTasks.filter((t) => !t.completed && !t.inProgress);
  const inProgress = allTasks.filter((t) => !t.completed && t.inProgress);
  const done = allTasks.filter((t) => t.completed);

  function isLateTask(id: string) {
    return filteredLateTasks.some((task) => task.id === id);
  }

  return (
    <section
      aria-label="Quadro de tarefas em formato kanban"
      aria-live="polite"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-full min-h-0 overflow-auto"
    >
      {/* PENDENTE */}
      <div role="region" aria-labelledby="kanban-pending-title">
        <KanbanColumn
          title="PENDENTE"
          count={pending.length}
          color="muted-light"
        >
          <ul
            className="space-y-2"
            role="list"
            aria-labelledby="kanban-pending-title"
          >
            {pending.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  viewMode="kanban"
                  late={isLateTask(task.id)}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onStartFocus={onStartFocus}
                  onToggleComplete={onToggleComplete}
                  onMoveStatus={onMoveStatusTask}
                />
              </li>
            ))}
          </ul>
        </KanbanColumn>
      </div>

      {/* EM PROGRESSO */}
      <div role="region" aria-labelledby="kanban-progress-title">
        <KanbanColumn
          title="EM PROGRESSO"
          count={inProgress.length}
          color="warning"
        >
          <ul
            className="space-y-2"
            role="list"
            aria-labelledby="kanban-progress-title"
          >
            {inProgress.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  viewMode="kanban"
                  late={isLateTask(task.id)}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onStartFocus={onStartFocus}
                  onToggleComplete={onToggleComplete}
                  onMoveStatus={onMoveStatusTask}
                />
              </li>
            ))}
          </ul>
        </KanbanColumn>
      </div>

      {/* CONCLUÍDO */}
      <div role="region" aria-labelledby="kanban-done-title">
        <KanbanColumn title="CONCLUÍDO" count={done.length} color="success">
          <ul
            className="space-y-2"
            role="list"
            aria-labelledby="kanban-done-title"
          >
            {done.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  viewMode="kanban"
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onStartFocus={onStartFocus}
                  onToggleComplete={onToggleComplete}
                  onMoveStatus={onMoveStatusTask}
                />
              </li>
            ))}
          </ul>
        </KanbanColumn>
      </div>
    </section>
  );
}
