import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateTaskUseCase } from "../create-task-use-case";
import { addDays, formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../../domain/repositories/task-repository";
import type { CreateTaskDTO } from "../../dtos/create-task-dto";

describe("CreateTaskUseCase", () => {
  let taskRepository: TaskRepository;

  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn(),
      create: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      findById: vi.fn(),
      findLateTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    createTaskUseCase = new CreateTaskUseCase(taskRepository);
  });

  it("should create a task scheduled for today", async () => {
    const userId = "user-1";

    const today = new Date();

    const data = {
      title: "Test task",
      subtasks: [],
      when: "today",
      energy: "medium",
      focusDuration: 30,
      date: today,
    } as CreateTaskDTO;

    const result = await createTaskUseCase.execute(userId, data);

    expect(taskRepository.create).toHaveBeenCalledWith({
      userId,
      title: data.title,
      subtasks: data.subtasks,
      energy: data.energy,
      focusDuration: data.focusDuration,
      scheduledFor: formatDateIsoString(today),
      completed: false,
      createdAt: formatDateIsoString(today),
      inProgress: false,
    });

    expect(result.scheduledFor).toBe(formatDateIsoString(today));
  });

  it("should create a task scheduled for tomorrow", async () => {
    const userId = "user-1";

    const tomorrow = addDays(1);

    const data = {
      title: "Test task",
      when: "tomorrow",
      subtasks: [],
      energy: "medium",
      focusDuration: 30,
      date: tomorrow,
    } as CreateTaskDTO;

    const result = await createTaskUseCase.execute(userId, data);

    expect(taskRepository.create).toHaveBeenCalled();

    expect(result.scheduledFor).toBe(formatDateIsoString(tomorrow));
  });

  it("should create a task for a specific date", async () => {
    const userId = "user-1";

    const date = new Date("2026-01-10");

    const data = {
      title: "Test task",
      when: "custom",
      date,
      subtasks: [],
      energy: "medium",
      focusDuration: 15,
    } as CreateTaskDTO;

    const result = await createTaskUseCase.execute(userId, data);

    expect(result.scheduledFor).toBe(formatDateIsoString(date));
  });

  it("should call repository.create once", async () => {
    const userId = "user-1";

    const data = {
      title: "Test task",
      when: "today",
      subtasks: [],
      energy: "medium",
      focusDuration: 30,
      date: new Date(),
    } as CreateTaskDTO;

    await createTaskUseCase.execute(userId, data);

    expect(taskRepository.create).toHaveBeenCalledTimes(1);
  });
});
