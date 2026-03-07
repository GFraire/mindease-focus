import type { Task } from "../../domain/entities/task";
import { KanbanColumn } from "../components/kanban-column";
import { TaskCard } from "../components/task-card";

type Props = {
  filteredPendingTasks: Task[];
  filteredDateTasks: Task[];
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
};

export function TaskKanbanView({
  filteredPendingTasks,
  filteredDateTasks,
  onDelete,
  onEdit,
  onStartFocus,
  onToggleComplete,
}: Props) {
  const allTasks = [...filteredPendingTasks, ...filteredDateTasks];

  const pending = allTasks.filter((t) => !t.completed && !t.inProgress);

  const inProgress = allTasks.filter((t) => !t.completed && t.inProgress);

  const done = allTasks.filter((t) => t.completed);

  return (
    <div className="grid grid-cols-3 gap-6 h-full min-h-0 overflow-hidden">
      <KanbanColumn title="PENDENTE" count={pending.length} color="muted-light">
        {pending.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onStartFocus={onStartFocus}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </KanbanColumn>

      <KanbanColumn
        title="EM PROGRESSO"
        count={inProgress.length}
        color="warning"
      >
        {inProgress.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onStartFocus={onStartFocus}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </KanbanColumn>

      <KanbanColumn title="CONCLUÍDO" count={done.length} color="success">
        {done.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onStartFocus={onStartFocus}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </KanbanColumn>
    </div>
  );
}
