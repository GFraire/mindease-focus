import type { TaskRepository } from "../../domain/repositories/task-repository";

type TaskStatus = "pending" | "inProgress" | "completed";

export class MoveTaskStatusUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId: string, status: TaskStatus) {
    const data = {
      completed: status === "completed",
      inProgress: status === "inProgress",
    };

    await this.taskRepository.update(taskId, data);
  }
}
