import { useState } from "react";
import { useAuthStore } from "@/shared/ui/store/auth-store";
import { TaskForm } from "../components/task-form";
import { makeCreateTaskUseCase } from "../../container";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { CreateTaskDTO } from "../../application/dtos/create-task-dto";

export function CreateTask() {
  const navigate = useNavigate();

  const createTaskUseCase = makeCreateTaskUseCase();

  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate(data: CreateTaskDTO) {
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
