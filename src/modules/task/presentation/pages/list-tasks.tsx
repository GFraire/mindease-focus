import { useEffect, useMemo, useState } from "react";
import {
  CalendarArrowDown,
  CalendarCheck,
  History,
  Plus,
  Sprout,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { Sidebar } from "@/shared/ui/components/sidebar";
import { TaskFilters } from "../components/task-filters";
import {
  makeBringPendingTasksToTodayUseCase,
  makeListPendingTasksUseCase,
  makeListTasksByDateUseCase,
} from "../../container";
import { useAuthStore } from "@/shared/ui/store/auth-store";
import type { Task } from "../../domain/entities/task";
import { TaskCard } from "../components/task-card";
import { useCognitiveSettingsStore } from "@/shared/ui/store/cognitive-settings-store";
import { sortTasksByEnergy } from "../utils/sort";
import { formatDate, isToday } from "@/shared/utils/date/date-helper";
import { toast } from "sonner";

type DateFilter = "today" | "tomorrow" | "custom";

export function ListTasks() {
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

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const energyLevel = useCognitiveSettingsStore((state) => state.energy);

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

  return (
    <div className="flex h-full w-full">
      <Sidebar />

      <div className="flex flex-col gap-6 p-8 w-full overflow-auto">
        <div className="flex gap-2 items-center w-full">
          <div className="flex flex-col flex-1 gap-1">
            <h3 className="text-high-contrast text-heading-lg font-bold">
              Lista de tarefas
            </h3>

            <span className="text-body text-muted">
              Sua lista organizada por prioridade de execução e energia.
            </span>
          </div>

          <BaseButton
            className="bg-primary text-white! cursor-pointer"
            onClick={() => navigate("/create-task")}
          >
            <Plus />
            Nova tarefa
          </BaseButton>
        </div>

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
                className="[&_svg]:size-5! text-primary rounded-full border-primary! font-bold cursor-pointer bg-primary/10! hover:bg-primary/20! hover:text-primary!"
                loading={bringingToToday}
                variant="outline"
                onClick={handleBringAllToToday}
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
                  onBringToToday={handleBringTaskToToday}
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
                <TaskCard key={task.id} task={task} />
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
    </div>
  );
}
