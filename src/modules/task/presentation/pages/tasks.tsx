import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/shared/ui/components/sidebar";
import { TaskFilters } from "../components/task-filters";
import {
  makeBringPendingTasksToTodayUseCase,
  makeDeleteTaskUseCase,
  makeListPendingTasksUseCase,
  makeListTasksByDateUseCase,
  makeToggleTaskCompletedUseCase,
} from "../../container";
import { useAuthStore } from "@/shared/ui/store/auth-store";
import type { Task } from "../../domain/entities/task";
import { useCognitiveSettingsStore } from "@/shared/ui/store/cognitive-settings-store";
import { sortTasksByEnergy } from "../utils/sort";
import { isToday } from "@/shared/utils/date/date-helper";
import { toast } from "sonner";
import { TaskListView } from "./task-list-view";
import { TasksHeader } from "../components/task-header";
import { TaskKanbanView } from "./task-kanban-view";

export type DateFilter = "today" | "tomorrow" | "custom";

export type TaskViewMode = "list" | "kanban";

export function Tasks() {
  const listTasksByDateUseCase = useMemo(
    () => makeListTasksByDateUseCase(),
    [],
  );

  const listPendingTasksUseCase = useMemo(
    () => makeListPendingTasksUseCase(),
    [],
  );

  const bringPendingTasksToTodayUseCase = useMemo(
    () => makeBringPendingTasksToTodayUseCase(),
    [],
  );

  const toggleTaskCompletedUseCase = useMemo(
    () => makeToggleTaskCompletedUseCase(),
    [],
  );

  const deleteTaskUseCase = useMemo(() => makeDeleteTaskUseCase(), []);

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const energyLevel = useCognitiveSettingsStore((state) => state.energy);

  const [viewMode, setViewMode] = useState<TaskViewMode>("list");
  const [taskTitle, setTaskTitle] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [customDate, setCustomDate] = useState<Date>(new Date());
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [dateTasks, setDateTasks] = useState<Task[]>([]);
  const [filteredPendingTasks, setFilteredPendingTasks] = useState<Task[]>([]);
  const [filteredDateTasks, setFilteredDateTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [bringingToToday, setBringingToToday] = useState(false);

  const showPendingTasks = isToday(customDate) && pendingTasks.length > 0;

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

        let pendingTasks: Task[] = [];

        if (isToday(customDate)) {
          pendingTasks = await listPendingTasksUseCase.execute(user.id);
        }

        const sortedDate = sortTasksByEnergy(dateTasks, energyLevel);
        const sortedPending = sortTasksByEnergy(pendingTasks, energyLevel);

        setDateTasks(sortedDate);
        setPendingTasks(sortedPending);
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
    const sortedDateTasks = sortTasksByEnergy(dateTasks, energyLevel);
    const sortedPendingTasks = sortTasksByEnergy(pendingTasks, energyLevel);

    setDateTasks(sortedDateTasks);
    setPendingTasks(sortedPendingTasks);
  }, [energyLevel]);

  useEffect(() => {
    const filteredDateTasks = dateTasks.filter((task) =>
      task.title.toLowerCase().includes(taskTitle.toLowerCase()),
    );

    const filteredPendingTasks = pendingTasks.filter((task) =>
      task.title.toLowerCase().includes(taskTitle.toLowerCase()),
    );

    setFilteredDateTasks(filteredDateTasks);
    setFilteredPendingTasks(filteredPendingTasks);
  }, [taskTitle, dateTasks, pendingTasks]);

  async function handleBringAllToToday() {
    if (pendingTasks.length === 0) return;

    try {
      setBringingToToday(true);

      await bringPendingTasksToTodayUseCase.execute(
        pendingTasks.map((task) => task.id),
      );

      setDateTasks((prev) =>
        sortTasksByEnergy([...pendingTasks, ...prev], energyLevel),
      );

      setPendingTasks([]);

      toast.success("Tarefas movidas para hoje", {
        position: "bottom-center",
      });
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
      await bringPendingTasksToTodayUseCase.execute([taskId]);

      const task = pendingTasks.find((t) => t.id === taskId);
      if (!task) return;

      setPendingTasks((prev) => prev.filter((t) => t.id !== taskId));
      setDateTasks((prev) => sortTasksByEnergy([task, ...prev], energyLevel));

      toast.success("Tarefa movida para hoje", {
        position: "bottom-center",
      });
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
      setPendingTasks((prev) => prev.filter((task) => task.id !== taskId));

      toast.success("Tarefa removida", {
        position: "bottom-center",
      });
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
          task.id === taskId ? { ...task, completed } : task,
        ),
      );

      setPendingTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed } : task,
        ),
      );
    } catch (err) {
      console.error(err);

      toast.error("Erro ao atualizar tarefa", {
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

      <div className="flex flex-col gap-6 p-8 w-full h-screen">
        <TasksHeader
          viewMode={viewMode}
          onCreateTask={() => navigate("/create-task")}
          onChangeViewMode={handleChangeViewMode}
        />

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

        {viewMode === "list" && (
          <TaskListView
            dateFilter={dateFilter}
            customDate={customDate}
            loading={loading}
            dateTasks={dateTasks}
            filteredPendingTasks={filteredPendingTasks}
            filteredDateTasks={filteredDateTasks}
            bringingToToday={bringingToToday}
            showPendingTasks={showPendingTasks}
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
            filteredPendingTasks={filteredPendingTasks}
            filteredDateTasks={filteredDateTasks}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onStartFocus={handleFocusTask}
            onToggleComplete={handleToggleCompleted}
          />
        )}
      </div>
    </div>
  );
}
