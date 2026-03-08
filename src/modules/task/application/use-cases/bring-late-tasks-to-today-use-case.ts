import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../domain/repositories/task-repository";

export class BringLateTasksToTodayUseCase {
  private tasksRepository: TaskRepository;

  constructor(tasksRepository: TaskRepository) {
    this.tasksRepository = tasksRepository;
  }

  async execute(tasksId: string[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Promise.all(
      tasksId.map((id) =>
        this.tasksRepository.update(id, {
          scheduledFor: formatDateIsoString(today),
        }),
      ),
    );
  }
}
