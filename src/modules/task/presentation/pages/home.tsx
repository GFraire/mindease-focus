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
import { BaseButton } from "@/shared/ui/components/form/base-button";

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
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex h-full w-full">
        <Sidebar />

        <main className="w-full flex items-center justify-center">
          <span className="text-muted text-body">Carregando tarefas...</span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <main
        className="flex-1 flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 mx-auto w-full"
        aria-labelledby="home-heading"
      >
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1
              id="home-heading"
              className="text-heading-lg font-bold text-high-contrast"
            >
              Olá, como você está hoje?
            </h1>

            <p className="text-body text-muted">
              Aqui está o seu foco para este momento.
            </p>
          </div>

          {lateTasksCount > 0 && (
            <div
              role="alert"
              aria-live="polite"
              className="flex flex-row sm:items-center justify-between gap-3 bg-warning/10 border border-warning/30 rounded-lg px-4 py-3"
            >
              <span className="flex gap-2 items-center text-body-sm text-warning font-medium">
                <AlertTriangle size={18} aria-hidden="true" />
                Você tem {lateTasksCount} tarefa
                {lateTasksCount > 1 && "s"} atrasada
                {lateTasksCount > 1 && "s"}
              </span>

              <BaseButton
                onClick={() => navigate("/tasks")}
                variant="link"
                aria-label="Ver lista de tarefas atrasadas"
                size="sm"
                className="text-body-sm font-semibold text-warning cursor-pointer focus:outline-none focus:ring-2 focus:ring-warning"
              >
                Ver tarefas
              </BaseButton>
            </div>
          )}
        </header>

        {!hasTasks && (
          <section
            aria-label="Nenhuma tarefa para hoje"
            className="flex flex-col items-center justify-center gap-2 p-8 sm:p-12 border border-border rounded-md bg-card flex-1"
          >
            <ClipboardList
              size={32}
              className="text-muted"
              aria-hidden="true"
            />

            <span className="font-semibold text-high-contrast">
              Nenhuma tarefa para hoje
            </span>

            <span className="text-sm text-muted text-center">
              Adicione tarefas para começar seu dia com foco.
            </span>

            <button
              onClick={() => navigate("/create-task")}
              aria-label="Criar nova tarefa"
              className="text-sm font-semibold text-primary cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Criar nova tarefa
            </button>
          </section>
        )}

        {focusTask && (
          <section aria-labelledby="focus-task-heading">
            <FocusNowCard
              task={focusTask}
              onStart={handleStartFocus}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleCompleted}
            />
          </section>
        )}

        {focusTask && (
          <section className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2
                id="next-tasks-heading"
                className="text-heading font-bold text-high-contrast"
              >
                Próximas tarefas
              </h2>

              <BaseButton
                onClick={() => navigate("/tasks")}
                aria-label="Ver todas as tarefas"
                variant="link"
                className="text-primary! font-semibold text-body-sm cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Ver todas
              </BaseButton>
            </div>

            <Separator />

            {nextTasks.length > 0 ? (
              <div
                role="list"
                aria-labelledby="next-tasks-heading"
                className="flex flex-col gap-3"
              >
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
              <div
                className="flex flex-col items-center justify-center flex-1 gap-2 py-6 rounded-md border border-border bg-card"
                aria-live="polite"
              >
                <ClipboardList
                  size={20}
                  className="text-muted"
                  aria-hidden="true"
                />

                <span className="text-body text-muted text-center">
                  Nenhuma outra tarefa pendente agora
                </span>

                <span className="text-body-sm text-muted text-center">
                  Continue focando na tarefa atual.
                </span>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
