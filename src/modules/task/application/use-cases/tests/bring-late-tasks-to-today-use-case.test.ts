import { describe, it, expect, vi, beforeEach } from "vitest";
import { BringLateTasksToTodayUseCase } from "../bring-late-tasks-to-today-use-case";
import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../../domain/repositories/task-repository";

describe("BringLateTasksToTodayUseCase", () => {
  let taskRepository: TaskRepository;

  let bringLateTasksToTodayUseCase: BringLateTasksToTodayUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn().mockResolvedValue(undefined),
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findLateTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    bringLateTasksToTodayUseCase = new BringLateTasksToTodayUseCase(
      taskRepository,
    );
  });

  it("should update all tasks scheduledFor to today", async () => {
    const tasksId = ["task-1", "task-2", "task-3"];

    await bringLateTasksToTodayUseCase.execute(tasksId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayFormatted = formatDateIsoString(today);

    expect(taskRepository.update).toHaveBeenCalledTimes(3);

    for (const id of tasksId) {
      expect(taskRepository.update).toHaveBeenCalledWith(id, {
        scheduledFor: todayFormatted,
      });
    }
  });

  it("should not call update when tasksId is empty", async () => {
    await bringLateTasksToTodayUseCase.execute([]);

    expect(taskRepository.update).not.toHaveBeenCalled();
  });
});
