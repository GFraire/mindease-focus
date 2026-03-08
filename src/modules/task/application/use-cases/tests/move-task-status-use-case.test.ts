import { describe, it, expect, vi, beforeEach } from "vitest";
import { MoveTaskStatusUseCase } from "../move-task-status-use-case";
import type { TaskRepository } from "../../../domain/repositories/task-repository";

describe("MoveTaskStatusUseCase", () => {
  let taskRepository: TaskRepository;

  let moveTaskStatusUseCase: MoveTaskStatusUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn().mockResolvedValue(undefined),
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findLateTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    moveTaskStatusUseCase = new MoveTaskStatusUseCase(taskRepository);
  });

  it("should move task to pending", async () => {
    await moveTaskStatusUseCase.execute("task-1", "pending");

    expect(taskRepository.update).toHaveBeenCalledTimes(1);
    expect(taskRepository.update).toHaveBeenCalledWith("task-1", {
      completed: false,
      inProgress: false,
    });
  });

  it("should move task to inProgress", async () => {
    await moveTaskStatusUseCase.execute("task-1", "inProgress");

    expect(taskRepository.update).toHaveBeenCalledTimes(1);
    expect(taskRepository.update).toHaveBeenCalledWith("task-1", {
      completed: false,
      inProgress: true,
    });
  });

  it("should move task to completed", async () => {
    await moveTaskStatusUseCase.execute("task-1", "completed");

    expect(taskRepository.update).toHaveBeenCalledTimes(1);
    expect(taskRepository.update).toHaveBeenCalledWith("task-1", {
      completed: true,
      inProgress: false,
    });
  });
});
