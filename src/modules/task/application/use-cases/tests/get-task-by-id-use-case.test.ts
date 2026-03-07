import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetTaskByIdUseCase } from "../get-task-by-id-use-case";
import type { TaskRepository } from "../../../domain/repositories/task-repository";
import type { Task } from "../../../domain/entities/task";

describe("GetTaskByIdUseCase", () => {
  let taskRepository: TaskRepository;

  let getTaskByIdUseCase: GetTaskByIdUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findPendingTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
  });

  it("should return a task when it exists", async () => {
    const taskId = "task-1";

    const task: Task = {
      id: taskId,
      userId: "user-1",
      title: "Test task",
      subtasks: [],
      energy: "medium",
      focusDuration: 30,
      scheduledFor: "2026-03-07",
      completed: false,
      createdAt: "2026-03-07",
      inProgress: false
    };

    vi.mocked(taskRepository.findById).mockResolvedValue(task);

    const result = await getTaskByIdUseCase.execute(taskId);

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(result).toEqual(task);
  });

  it("should return null when task does not exist", async () => {
    const taskId = "task-1";

    vi.mocked(taskRepository.findById).mockResolvedValue(null);

    const result = await getTaskByIdUseCase.execute(taskId);

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(result).toBeNull();
  });
});
