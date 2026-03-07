import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/shared/ui/store/auth-store";
import { TaskForm, type TaskFormValues } from "../components/task-form";
import { makeGetTaskByIdUseCase, makeUpdateTaskUseCase } from "../../container";
import { toast } from "sonner";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { CreateTaskDTO } from "../../application/dtos/create-task-dto";
import type { Task } from "../../domain/entities/task";
import { getWhenFromDate } from "@/shared/utils/date/date-helper";

export function EditTask() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateTask = location.state as Task | undefined;

  const { taskId } = useParams();

  const user = useAuthStore((state) => state.user);

  const getTaskByIdUseCase = useMemo(() => makeGetTaskByIdUseCase(), []);

  const updateTaskUseCase = useMemo(() => makeUpdateTaskUseCase(), []);

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<TaskFormValues | null>(() => {
    if (!stateTask) return null;

    const [year, month, day] = stateTask.scheduledFor.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    const when = getWhenFromDate(date);

    return {
      title: stateTask.title,
      subtasks: stateTask.subtasks ?? [],
      energy: stateTask.energy,
      when: when,
      focusDuration: stateTask.focusDuration,
      date: date,
    };
  });

  useEffect(() => {
    async function loadTask() {
      if (!taskId || stateTask) return;

      try {
        const task = await getTaskByIdUseCase.execute(taskId);

        if (!task) {
          toast.error("Tarefa não encontrada");
          navigate("/");
          return;
        }

        const [year, month, day] = task.scheduledFor.split("-").map(Number);

        const date = new Date(year, month - 1, day);

        const when = getWhenFromDate(date);

        setInitialData({
          title: task.title,
          subtasks: task.subtasks ?? [],
          energy: task.energy,
          when: when,
          focusDuration: task.focusDuration,
          date: date,
        });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar tarefa");
      }
    }

    loadTask();
  }, [taskId]);

  async function handleUpdate(data: CreateTaskDTO) {
    if (!user || !taskId) return;

    try {
      setIsLoading(true);

      await updateTaskUseCase.execute(taskId, data);

      toast.success("Tarefa atualizada com sucesso!", {
        position: "bottom-center",
      });

      navigate(-1);
    } catch (error) {
      console.error(error);

      toast.error("Erro ao atualizar tarefa", {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!initialData) return null;

  return (
    <div className="flex items-center justify-center bg-background py-10 scroll-auto">
      <TaskForm
        title="Editar tarefa"
        subtitle="Ajuste os detalhes da sua tarefa."
        submitLabel="Salvar alterações"
        initialData={initialData}
        isLoading={isLoading}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
