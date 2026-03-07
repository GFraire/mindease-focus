import type { TaskRepository } from "../../domain/repositories/task-repository";
import type { Task } from "../../domain/entities/task";

export class GetTaskByIdUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId: string): Promise<Task | null> {
    return this.taskRepository.findById(taskId);
  }
}
