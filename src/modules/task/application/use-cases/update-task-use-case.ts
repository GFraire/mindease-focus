import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import type { CreateTaskDTO } from "../dtos/create-task-dto";

export class UpdateTaskUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId: string, data: CreateTaskDTO): Promise<void> {
    await this.taskRepository.update(taskId, {
      title: data.title,
      subtasks: data.subtasks,
      energy: data.energy,
      focusDuration: data.focusDuration,
      scheduledFor: formatDateIsoString(data.date),
    });
  }
}
