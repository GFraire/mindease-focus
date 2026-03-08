import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/shared/ui/components/sidebar";
import { FocusNowCard } from "../components/focus-now-card";
import { TaskCard } from "../components/task-card";
import { AlertTriangle, ClipboardList } from "lucide-react";

import {
  makeListTasksByDateUseCase,
  makeListLateTasksUseCase,
  makeToggleTaskCompletedUseCase,
  makeDeleteTaskUseCase,
} from "../../container";

import { useAuthStore } from "@/shared/ui/store/auth-store";
import { useCognitiveSettingsStore } from "@/shared/ui/store/cognitive-settings-store";

import { sortTasksByStatusAndEnergy } from "../utils/sort-tasks";

import type { Task } from "../../domain/entities/task";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Separator } from "@/shared/ui/components/ui/separator";

export function Home() {
  const listTasksByDateUseCase = useMemo(
    () => makeListTasksByDateUseCase(),
    [],
  );

  const listLateTasksUseCase = useMemo(() => makeListLateTasksUseCase(), []);

  const toggleTaskCompletedUseCase = useMemo(
    () => makeToggleTaskCompletedUseCase(),
    [],
  );

  const deleteTaskUseCase = useMemo(() => makeDeleteTaskUseCase(), []);

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const energyLevel = useCognitiveSettingsStore((state) => state.energy);

  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [nextTasks, setNextTasks] = useState<Task[]>([]);
  const [lateTasksCount, setLateTasksCount] = useState(0);

  useEffect(() => {
    reloadTasks();
  }, [user, energyLevel]);

  async function reloadTasks() {
    if (!user) return;

    try {
      const today = new Date();

      const [todayTasks, lateTasks] = await Promise.all([
        listTasksByDateUseCase.execute({
          userId: user.id,
          date: today,
        }),
        listLateTasksUseCase.execute(user.id),
      ]);

      setLateTasksCount(lateTasks.length);

      const pendingTasks = [...todayTasks, ...lateTasks].filter(
        (task) => !task.completed,
      );

      const sortedTasks = sortTasksByStatusAndEnergy(pendingTasks, energyLevel);

      const inProgressTask = sortedTasks.find((task) => task.inProgress);

      const focus = inProgressTask ?? sortedTasks[0] ?? null;

      setFocusTask(focus);

      const next = sortedTasks
        .filter((task) => task.id !== focus?.id)
        .slice(0, 3);

      setNextTasks(next);
    } catch (err) {
      console.error(err);

      toast.error("Erro ao carregar tarefas", {
        position: "bottom-center",
      });
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTaskUseCase.execute(taskId);

      toast.success("Tarefa removida", {
        position: "bottom-center",
      });

      setNextTasks((prev) => {
        const updated = prev.filter((task) => task.id !== taskId);

        if (updated.length < 3) reloadTasks();

        return updated;
      });

      if (focusTask?.id === taskId) {
        reloadTasks();
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

      toast.success(
        completed ? "Tarefa concluída 🎉" : "Tarefa marcada como pendente",
        {
          position: "bottom-center",
        },
      );

      if (focusTask?.id === taskId) {
        reloadTasks();
        return;
      }

      setNextTasks((prev) => {
        const updated = prev.filter((task) => task.id !== taskId);

        if (updated.length < 3) reloadTasks();

        return updated;
      });
    } catch (err) {
      console.error(err);

      toast.error("Erro ao atualizar tarefa", {
        position: "bottom-center",
      });
    }
  }

  function handleStartFocus(task: Task) {
    navigate(`/focus-task/${task.id}`, { state: task });
  }

  function handleEditTask(task: Task) {
    navigate(`/edit-task/${task.id}`, { state: task });
  }

  const hasTasks = focusTask || nextTasks.length > 0;

  return (
    <div className="flex h-full w-full">
      <Sidebar />

      <div className="w-full flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-heading-lg font-bold text-high-contrast">
              Olá, como você está hoje?
            </h1>

            <span className="text-body text-muted">
              Aqui está o seu foco para este momento.
            </span>
          </div>

          {lateTasksCount > 0 && (
            <div className="flex items-center justify-between bg-warning/10 border border-warning/30 rounded-lg px-4 py-3">
              <span className="flex gap-2 items-center text-sm text-warning font-medium">
                <AlertTriangle size={18} />
                Você tem {lateTasksCount} tarefa
                {lateTasksCount > 1 && "s"} atrasada
                {lateTasksCount > 1 && "s"}
              </span>

              <button
                onClick={() => navigate("/tasks")}
                className="text-sm font-semibold text-warning cursor-pointer hover:underline"
              >
                Ver tarefas
              </button>
            </div>
          )}
        </div>

        {!hasTasks && (
          <div className="flex flex-col items-center justify-center gap-2 p-12 border border-border rounded-md bg-card h-full">
            <ClipboardList size={32} className="text-muted" />

            <span className="font-semibold text-high-contrast">
              Nenhuma tarefa para hoje
            </span>

            <span className="text-sm text-muted">
              Adicione tarefas para começar seu dia com foco.
            </span>

            <button
              onClick={() => navigate("/create-task")}
              className="text-sm font-semibold text-primary cursor-pointer hover:underline"
            >
              Criar nova tarefa
            </button>
          </div>
        )}

        {focusTask && (
          <FocusNowCard
            task={focusTask}
            onStart={handleStartFocus}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleCompleted}
          />
        )}

        {focusTask && (
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between">
              <h2 className="text-heading font-bold text-high-contrast">
                Próximas tarefas
              </h2>

              <span
                className="text-primary font-semibold text-body-sm cursor-pointer hover:underline"
                onClick={() => navigate("/tasks")}
              >
                Ver todas
              </span>
            </div>

            <Separator  />

            {nextTasks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {nextTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={() => handleDeleteTask(task.id)}
                    onEdit={() => handleEditTask(task)}
                    onStartFocus={() => handleStartFocus(task)}
                    onToggleComplete={handleToggleCompleted}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-2 py-6 rounded-md border border-border bg-card">
                <ClipboardList size={20} className="text-muted" />

                <span className="text-body text-muted">
                  Nenhuma outra tarefa pendente agora
                </span>

                <span className="text-body-sm text-muted">
                  Continue focando na tarefa atual.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
