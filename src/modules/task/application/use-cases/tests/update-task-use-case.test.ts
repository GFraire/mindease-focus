import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateTaskUseCase } from "../update-task-use-case";
import { formatDateIsoString } from "@/shared/utils/date/date-helper";
import type { TaskRepository } from "../../../domain/repositories/task-repository";
import type { CreateTaskDTO } from "../../dtos/create-task-dto";

describe("UpdateTaskUseCase", () => {
  let taskRepository: TaskRepository;

  let updateTaskUseCase: UpdateTaskUseCase;

  beforeEach(() => {
    taskRepository = {
      update: vi.fn().mockResolvedValue(undefined),
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findPendingTasks: vi.fn(),
      listByDate: vi.fn(),
    };

    updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
  });

  it("should update a task with formatted scheduledFor date", async () => {
    const taskId = "task-1";

    const date = new Date("2026-03-04");

    const data = {
      title: "Updated task",
      subtasks: [],
      energy: "medium",
      focusDuration: 15,
      when: "custom",
      date,
    } as CreateTaskDTO;

    await updateTaskUseCase.execute(taskId, data);

    expect(taskRepository.update).toHaveBeenCalledWith(taskId, {
      ...data,
      scheduledFor: formatDateIsoString(date),
    });
  });

  it("should call repository.update once", async () => {
    const taskId = "task-1";

    const data = {
      title: "Updated task",
      subtasks: [],
      energy: "medium",
      focusDuration: 15,
      when: "custom",
      date: new Date("2026-03-04"),
    } as CreateTaskDTO;

    await updateTaskUseCase.execute(taskId, data);

    expect(taskRepository.update).toHaveBeenCalledTimes(1);
  });
});
