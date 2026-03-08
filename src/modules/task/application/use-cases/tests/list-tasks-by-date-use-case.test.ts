import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListTasksByDateUseCase } from "../list-tasks-by-date-use-case";
import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../../domain/repositories/task-repository";
import type { Task } from "../../../domain/entities/task";

describe("ListTasksByDateUseCase", () => {
  let taskRepository: TaskRepository;

  let listTasksByDateUseCase: ListTasksByDateUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findLateTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    listTasksByDateUseCase = new ListTasksByDateUseCase(taskRepository);
  });

  it("should list tasks by formatted date", async () => {
    const date = new Date("2026-03-04");
    const userId = "user-1";

    const tasks: Task[] = [
      {
        id: "task-1",
        userId,
        title: "Task 1",
        subtasks: [],
        energy: "medium",
        focusDuration: 15,
        scheduledFor: "2026-03-04",
        completed: false,
        createdAt: "2026-03-04",
        inProgress: false
      },
    ];

    vi.mocked(taskRepository.listByDate).mockResolvedValue(tasks);

    const result = await listTasksByDateUseCase.execute({
      userId,
      date,
    });

    expect(taskRepository.listByDate).toHaveBeenCalledWith({
      userId,
      date: formatDateIsoString(date),
    });

    expect(result).toEqual(tasks);
  });

  it("should return empty array when no tasks exist for the date", async () => {
    const date = new Date("2026-03-04");
    const userId = "user-1";

    vi.mocked(taskRepository.listByDate).mockResolvedValue([]);

    const result = await listTasksByDateUseCase.execute({
      userId,
      date,
    });

    expect(result).toEqual([]);
  });
});
