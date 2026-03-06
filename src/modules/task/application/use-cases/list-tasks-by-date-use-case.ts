import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import type { ListTasksDTO } from "../dtos/list-tasks-dto";

export class ListTasksByDateUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(params: ListTasksDTO) {
    return this.taskRepository.listByDate({
      userId: params.userId,
      date: formatDateIsoString(params.date),
    });
  }
}
