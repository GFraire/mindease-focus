import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteTaskUseCase } from "../delete-task-use-case";
import type { TaskRepository } from "../../../domain/repositories/task-repository";

describe("DeleteTaskUseCase", () => {
  let taskRepository: TaskRepository;

  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findLateTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
  });

  it("should delete a task by id", async () => {
    const taskId = "task-1";

    await deleteTaskUseCase.execute(taskId);

    expect(taskRepository.delete).toHaveBeenCalledWith(taskId);
  });

  it("should call repository.delete once", async () => {
    const taskId = "task-1";

    await deleteTaskUseCase.execute(taskId);

    expect(taskRepository.delete).toHaveBeenCalledTimes(1);
  });
});
