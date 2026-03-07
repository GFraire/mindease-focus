import { describe, it, expect, vi, beforeEach } from "vitest";
import { ToggleTaskCompletedUseCase } from "../toggle-task-completed-use-case";
import type { TaskRepository } from "../../../domain/repositories/task-repository";

describe("ToggleTaskCompletedUseCase", () => {
  let taskRepository: TaskRepository;
  let toggleTaskCompletedUseCase: ToggleTaskCompletedUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn().mockResolvedValue(undefined),
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findPendingTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    toggleTaskCompletedUseCase = new ToggleTaskCompletedUseCase(taskRepository);
  });

  it("should mark task as completed and set inProgress to false", async () => {
    const taskId = "task-1";

    await toggleTaskCompletedUseCase.execute(taskId, true);

    expect(taskRepository.update).toHaveBeenCalledWith(taskId, {
      completed: true,
      inProgress: false,
    });
  });

  it("should mark task as not completed and not change inProgress", async () => {
    const taskId = "task-1";

    await toggleTaskCompletedUseCase.execute(taskId, false);

    expect(taskRepository.update).toHaveBeenCalledWith(taskId, {
      completed: false,
    });
  });

  it("should call repository.update once", async () => {
    const taskId = "task-1";

    await toggleTaskCompletedUseCase.execute(taskId, true);

    expect(taskRepository.update).toHaveBeenCalledTimes(1);
  });
});
