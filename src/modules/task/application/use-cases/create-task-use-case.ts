import { addDays, formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import type { CreateTaskDTO } from "../dtos/create-task-dto";
import type { Task } from "../../domain/entities/task";

export class CreateTaskUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(userId: string, data: CreateTaskDTO) {
    let scheduledFor: string;

    if (data.when === "today") {
      scheduledFor = formatDateIsoString(new Date());
    } else if (data.when === "tomorrow") {
      scheduledFor = formatDateIsoString(addDays(1));
    } else {
      scheduledFor = data.date
        ? formatDateIsoString(data.date)
        : formatDateIsoString(addDays(2));
    }

    const task: Omit<Task, "id"> = {
      userId,
      title: data.title,
      subtasks: data.subtasks,
      energy: data.energy,
      focusDuration: data.focusDuration,
      scheduledFor,
      completed: false,
      createdAt: formatDateIsoString(new Date()),
      inProgress: false,
    };

    await this.taskRepository.create(task);

    return task;
  }
}
