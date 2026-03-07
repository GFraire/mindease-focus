import type { Task } from "../entities/task";

export interface TaskRepository {
  listByDate(params: { userId: string; date: string }): Promise<Task[]>;
  create(task: Omit<Task, "id">): Promise<void>;
  update(id: string, data: Partial<Task>): Promise<void>;
  delete(taskId: string): Promise<void>;
  findPendingTasks(userId: string, beforeDate: string): Promise<Task[]>;
  findById(taskId: string): Promise<Task | null>;
}
