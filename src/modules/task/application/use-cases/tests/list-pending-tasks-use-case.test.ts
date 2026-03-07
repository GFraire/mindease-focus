import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListPendingTasksUseCase } from "../list-pending-tasks-use-case";
import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../../domain/repositories/task-repository";
import type { Task } from "../../../domain/entities/task";

describe("ListPendingTasksUseCase", () => {
  let taskRepository: TaskRepository;

  let listPendingTasksUseCase: ListPendingTasksUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findPendingTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    listPendingTasksUseCase = new ListPendingTasksUseCase(taskRepository);
  });

  it("should return pending tasks for today", async () => {
    const userId = "user-1";

    const tasks: Task[] = [
      {
        id: "task-1",
        userId,
        title: "Task 1",
        subtasks: [],
        energy: "medium",
        focusDuration: 30,
        scheduledFor: "2026-03-04",
        completed: false,
        createdAt: "2026-03-04",
        inProgress: false
      },
    ];

    vi.mocked(taskRepository.findPendingTasks).mockResolvedValue(tasks);

    const result = await listPendingTasksUseCase.execute(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFormatted = formatDateIsoString(today);

    expect(taskRepository.findPendingTasks).toHaveBeenCalledWith(
      userId,
      todayFormatted,
    );

    expect(result).toEqual(tasks);
  });

  it("should return empty array when there are no pending tasks", async () => {
    const userId = "user-1";

    vi.mocked(taskRepository.findPendingTasks).mockResolvedValue([]);

    const result = await listPendingTasksUseCase.execute(userId);

    expect(result).toEqual([]);
  });
});
