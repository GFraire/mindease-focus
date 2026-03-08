import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../domain/repositories/task-repository";

export class ListLateTasksUseCase {
  private tasksRepository: TaskRepository;

  constructor(tasksRepository: TaskRepository) {
    this.tasksRepository = tasksRepository;
  }

  async execute(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.tasksRepository.findLateTasks(userId, formatDateIsoString(today));
  }
}
