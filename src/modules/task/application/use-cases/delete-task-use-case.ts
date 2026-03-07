import type { TaskRepository } from "../../domain/repositories/task-repository";

export class DeleteTaskUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId: string): Promise<void> {
    await this.taskRepository.delete(taskId);
  }
}
