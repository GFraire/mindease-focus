import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListLateTasksUseCase } from "../list-late-tasks-use-case";
import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../../domain/repositories/task-repository";
import type { Task } from "../../../domain/entities/task";

describe("ListLateTasksUseCase", () => {
  let taskRepository: TaskRepository;

  let listLateTasksUseCase: ListLateTasksUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findLateTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    listLateTasksUseCase = new ListLateTasksUseCase(taskRepository);
  });

  it("should return late tasks for today", async () => {
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
        inProgress: false,
      },
    ];

    vi.mocked(taskRepository.findLateTasks).mockResolvedValue(tasks);

    const result = await listLateTasksUseCase.execute(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFormatted = formatDateIsoString(today);

    expect(taskRepository.findLateTasks).toHaveBeenCalledWith(
      userId,
      todayFormatted,
    );

    expect(result).toEqual(tasks);
  });

  it("should return empty array when there are no late tasks", async () => {
    const userId = "user-1";

    vi.mocked(taskRepository.findLateTasks).mockResolvedValue([]);

    const result = await listLateTasksUseCase.execute(userId);

    expect(result).toEqual([]);
  });
});
