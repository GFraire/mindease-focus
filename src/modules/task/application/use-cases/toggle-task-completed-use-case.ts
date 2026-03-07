import type { Task } from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";

export class ToggleTaskCompletedUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId: string, completed: boolean): Promise<void> {
    const updateData: Partial<Task> = {
      completed,
    };

    if (completed) {
      updateData.inProgress = false;
    }

    await this.taskRepository.update(taskId, updateData);
  }
}
