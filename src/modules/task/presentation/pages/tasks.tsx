import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/shared/ui/components/sidebar";
import { TaskFilters } from "../components/task-filters";

import {
  makeBringLateTasksToTodayUseCase,
  makeDeleteTaskUseCase,
  makeListLateTasksUseCase,
  makeListTasksByDateUseCase,
  makeMoveTaskStatusUseCase,
  makeToggleTaskCompletedUseCase,
} from "../../container";

import { useAuthStore } from "@/shared/ui/store/auth-store";
import type { Task } from "../../domain/entities/task";
import { useCognitiveSettingsStore } from "@/shared/ui/store/cognitive-settings-store";

import {
  sortTasksByEnergy,
  sortTasksByStatusAndEnergy,
} from "../utils/sort-tasks";

import { isToday } from "@/shared/utils/date/date-helper";
import { toast } from "sonner";

import { TaskListView } from "./task-list-view";
import { TasksHeader } from "../components/task-header";
import { TaskKanbanView } from "./task-kanban-view";

export type DateFilter = "today" | "tomorrow" | "custom";
export type TaskViewMode = "list" | "kanban";
export type TaskStatus = "pending" | "inProgress";

export function Tasks() {
  const listTasksByDateUseCase = useMemo(
    () => makeListTasksByDateUseCase(),
    [],
  );

  const ListLateTasksUseCase = useMemo(() => makeListLateTasksUseCase(), []);

  const BringLateTasksToTodayUseCase = useMemo(
    () => makeBringLateTasksToTodayUseCase(),
    [],
  );

  const toggleTaskCompletedUseCase = useMemo(
    () => makeToggleTaskCompletedUseCase(),
    [],
  );

  const moveTaskStatusUseCase = useMemo(() => makeMoveTaskStatusUseCase(), []);
  const deleteTaskUseCase = useMemo(() => makeDeleteTaskUseCase(), []);

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const energyLevel = useCognitiveSettingsStore((state) => state.energy);
  const reduceNotifications = useCognitiveSettingsStore(
    (state) => state.reduceNotifications,
  );

  const [viewMode, setViewMode] = useState<TaskViewMode>("list");
  const [taskTitle, setTaskTitle] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [customDate, setCustomDate] = useState<Date>(new Date());

  const [lateTasks, setLateTasks] = useState<Task[]>([]);
  const [dateTasks, setDateTasks] = useState<Task[]>([]);
  const [filteredLateTasks, setFilteredLateTasks] = useState<Task[]>([]);
  const [filteredDateTasks, setFilteredDateTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(false);
  const [bringingToToday, setBringingToToday] = useState(false);

  const showLateTasks = isToday(customDate) && lateTasks.length > 0;
  const showDateTasks = true;

  useEffect(() => {
    async function loadTasks() {
      if (!user || !customDate) return;

      try {
        setLoading(true);

        const dateTasks = await listTasksByDateUseCase.execute({
          userId: user.id,
          date: customDate,
        });

        let lateTasks: Task[] = [];

        if (isToday(customDate)) {
          lateTasks = await ListLateTasksUseCase.execute(user.id);
        }

        const sortedDate = sortTasksByStatusAndEnergy(dateTasks, energyLevel);
        const sortedLate = sortTasksByStatusAndEnergy(lateTasks, energyLevel);

        setDateTasks(sortedDate);
        setLateTasks(sortedLate);
      } catch {
        toast.error("Erro ao carregar tarefas", {
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [customDate, user]);

  useEffect(() => {
    const sortedDateTasks = sortTasksByStatusAndEnergy(dateTasks, energyLevel);
    const sortedLateTasks = sortTasksByStatusAndEnergy(lateTasks, energyLevel);

    setDateTasks(sortedDateTasks);
    setLateTasks(sortedLateTasks);
  }, [energyLevel]);

  useEffect(() => {
    const filteredDateTasks = dateTasks.filter((task) =>
      task.title.toLowerCase().includes(taskTitle.toLowerCase()),
    );

    const filteredLateTasks = lateTasks.filter((task) =>
      task.title.toLowerCase().includes(taskTitle.toLowerCase()),
    );

    setFilteredDateTasks(
      sortTasksByStatusAndEnergy(filteredDateTasks, energyLevel),
    );

    setFilteredLateTasks(
      sortTasksByStatusAndEnergy(filteredLateTasks, energyLevel),
    );
  }, [taskTitle, dateTasks, lateTasks]);

  async function handleBringAllToToday() {
    if (lateTasks.length === 0) return;

    try {
      setBringingToToday(true);

      await BringLateTasksToTodayUseCase.execute(
        lateTasks.map((task) => task.id),
      );

      setDateTasks((prev) =>
        sortTasksByEnergy([...lateTasks, ...prev], energyLevel),
      );

      setLateTasks([]);

      if (!reduceNotifications) {
        toast.success("Tarefas movidas para hoje", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      console.error(err);

      toast.error("Erro ao atualizar tarefas", {
        position: "bottom-center",
      });
    } finally {
      setBringingToToday(false);
    }
  }

  async function handleBringTaskToToday(taskId: string) {
    try {
      await BringLateTasksToTodayUseCase.execute([taskId]);

      const task = lateTasks.find((t) => t.id === taskId);
      if (!task) return;

      setLateTasks((prev) => prev.filter((t) => t.id !== taskId));
      setDateTasks((prev) => sortTasksByEnergy([task, ...prev], energyLevel));

      if (!reduceNotifications) {
        toast.success("Tarefa movida para hoje", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      console.error(err);

      toast.error("Erro ao atualizar tarefa", {
        position: "bottom-center",
      });
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTaskUseCase.execute(taskId);

      setDateTasks((prev) => prev.filter((task) => task.id !== taskId));
      setLateTasks((prev) => prev.filter((task) => task.id !== taskId));

      if (!reduceNotifications) {
        toast.success("Tarefa removida", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      console.error(err);

      toast.error("Erro ao remover tarefa", {
        position: "bottom-center",
      });
    }
  }

  async function handleToggleCompleted(taskId: string, completed: boolean) {
    try {
      await toggleTaskCompletedUseCase.execute(taskId, completed);

      setDateTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed, inProgress: false } : task,
        ),
      );

      setLateTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed, inProgress: false } : task,
        ),
      );
    } catch (err) {
      console.error(err);

      toast.error("Erro ao atualizar tarefa", {
        position: "bottom-center",
      });
    }
  }

  async function handleMoveTaskStatus(taskId: string, status: TaskStatus) {
    try {
      await moveTaskStatusUseCase.execute(taskId, status);

      setDateTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                inProgress: status === "inProgress",
                completed: status !== "pending" && status !== "inProgress",
              }
            : task,
        ),
      );

      setLateTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                inProgress: status === "inProgress",
                completed: status !== "pending" && status !== "inProgress",
              }
            : task,
        ),
      );

      if (!reduceNotifications) {
        toast.success("Tarefa atualizada", {
          description: "O status da tarefa foi atualizado com sucesso.",
          position: "bottom-center",
        });
      }
    } catch {
      toast.error("Erro ao mover tarefa", {
        description: "Não foi possível atualizar o status da tarefa.",
        position: "bottom-center",
      });
    }
  }

  function handleEditTask(task: Task) {
    navigate(`/edit-task/${task.id}`, { state: task });
  }

  function handleFocusTask(task: Task) {
    navigate(`/focus-task/${task.id}`, { state: task });
  }

  function handleChangeViewMode(viewMode: TaskViewMode) {
    setViewMode(viewMode);
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main
        className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full h-screen overflow-auto
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-muted/40
        [&::-webkit-scrollbar-thumb]:rounded-full"
        aria-labelledby="tasks-page-title"
      >
        <h1 id="tasks-page-title" className="sr-only">
          Página de tarefas
        </h1>

        <header>
          <TasksHeader
            viewMode={viewMode}
            onCreateTask={() => navigate("/create-task")}
            onChangeViewMode={handleChangeViewMode}
          />
        </header>

        <section aria-label="Filtros de tarefas">
          <TaskFilters
            search={taskTitle}
            onSearchChange={setTaskTitle}
            dateFilter={dateFilter}
            customDate={customDate}
            onDateChange={(filter, date) => {
              setDateFilter(filter);
              if (date) setCustomDate(date);
            }}
          />
        </section>

        <section
          aria-live="polite"
          aria-busy={loading}
          aria-label="Lista de tarefas"
          className="flex-1 w-full"
        >
          {viewMode === "list" && (
            <TaskListView
              dateFilter={dateFilter}
              customDate={customDate}
              loading={loading}
              dateTasks={dateTasks}
              filteredLateTasks={filteredLateTasks}
              filteredDateTasks={filteredDateTasks}
              bringingToToday={bringingToToday}
              showLateTasks={showLateTasks}
              showDateTasks={showDateTasks}
              onBringAllToToday={handleBringAllToToday}
              onBringToToday={handleBringTaskToToday}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onStartFocus={handleFocusTask}
              onToggleComplete={handleToggleCompleted}
            />
          )}

          {viewMode === "kanban" && (
            <TaskKanbanView
              filteredLateTasks={filteredLateTasks}
              filteredDateTasks={filteredDateTasks}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onStartFocus={handleFocusTask}
              onToggleComplete={handleToggleCompleted}
              onMoveStatusTask={handleMoveTaskStatus}
            />
          )}
        </section>
      </main>
    </div>
  );
}
