import { useMemo, useState } from "react";
import { useAuthStore } from "@/shared/ui/store/auth-store";
import { TaskForm, type TaskFormValues } from "../components/task-form";
import { makeCreateTaskUseCase } from "../../container";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function CreateTask() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const createTaskUseCase = useMemo(() => makeCreateTaskUseCase(), []);

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate(data: TaskFormValues) {
    if (!user) return;

    try {
      setIsLoading(true);

      await createTaskUseCase.execute(user.id, data);

      toast.success("Tarefa criada com sucesso!", {
        position: "bottom-center",
      });

      navigate(-1);
    } catch (error) {
      console.error(error);

      toast.error("Erro ao criar tarefa", {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center bg-background py-10 scroll-auto">
      <TaskForm
        title="Criar nova tarefa"
        subtitle="Dê um passo de cada vez."
        submitLabel="Salvar tarefa"
        isLoading={isLoading}
        onSubmit={handleCreate}
      />
    </div>
  );
}
