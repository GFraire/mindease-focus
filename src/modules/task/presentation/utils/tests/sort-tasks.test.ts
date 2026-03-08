import { describe, it, expect } from "vitest";
import {
  sortTasksByEnergy,
  sortTasksByCompleted,
  sortTasksByStatusAndEnergy,
} from "../sort-tasks";

import type { Task } from "@/modules/task/domain/entities/task";
import type { EnergyLevel } from "@/shared/ui/store/cognitive-settings-store";

function createTask(id: string, energy: EnergyLevel, completed = false): Task {
  return {
    id,
    title: `Task ${id}`,
    energy,
    completed,
    inProgress: false,
    focusDuration: 30,
    createdAt: "2026-03-07",
  } as Task;
}

describe("sortTasksByEnergy", () => {
  it("should sort tasks by energy priority when user energy is high", () => {
    const tasks = [
      createTask("1", "low"),
      createTask("2", "high"),
      createTask("3", "medium"),
    ];

    const result = sortTasksByEnergy(tasks, "high");

    expect(result.map((t) => t.energy)).toEqual(["high", "medium", "low"]);
  });

  it("should sort tasks by energy priority when user energy is medium", () => {
    const tasks = [
      createTask("1", "high"),
      createTask("2", "low"),
      createTask("3", "medium"),
    ];

    const result = sortTasksByEnergy(tasks, "medium");

    expect(result.map((t) => t.energy)).toEqual(["medium", "low", "high"]);
  });

  it("should not mutate the original array", () => {
    const tasks = [createTask("1", "low"), createTask("2", "high")];

    const original = [...tasks];

    sortTasksByEnergy(tasks, "high");

    expect(tasks).toEqual(original);
  });
});

describe("sortTasksByCompleted", () => {
  it("should place non-completed tasks first", () => {
    const tasks = [
      createTask("1", "high", true),
      createTask("2", "medium", false),
      createTask("3", "low", true),
      createTask("4", "high", false),
    ];

    const result = sortTasksByCompleted(tasks);

    expect(result.map((t) => t.completed)).toEqual([false, false, true, true]);
  });

  it("should not mutate the original array", () => {
    const tasks = [
      createTask("1", "high", true),
      createTask("2", "medium", false),
    ];

    const original = [...tasks];

    sortTasksByCompleted(tasks);

    expect(tasks).toEqual(original);
  });
});

describe("sortTasksByStatusAndEnergy", () => {
  it("should sort by energy first and then place completed tasks last", () => {
    const tasks = [
      createTask("1", "low", false),
      createTask("2", "high", true),
      createTask("3", "medium", false),
      createTask("4", "high", false),
    ];

    const result = sortTasksByStatusAndEnergy(tasks, "high");

    expect(
      result.map((t) => ({
        energy: t.energy,
        completed: t.completed,
      })),
    ).toEqual([
      { energy: "high", completed: false },
      { energy: "medium", completed: false },
      { energy: "low", completed: false },
      { energy: "high", completed: true },
    ]);
  });

  it("should not mutate the original array", () => {
    const tasks = [createTask("1", "low"), createTask("2", "high")];

    const original = [...tasks];

    sortTasksByStatusAndEnergy(tasks, "high");

    expect(tasks).toEqual(original);
  });
});
