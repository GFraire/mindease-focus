import { BringPendingTasksToTodayUseCase } from "./application/use-cases/bring-pending-tasks-to-today-use-case";
import { CreateTaskUseCase } from "./application/use-cases/create-task-use-case";
import { ListPendingTasksUseCase } from "./application/use-cases/list-pending-tasks-use-case";
import { ListTasksByDateUseCase } from "./application/use-cases/list-tasks-by-date-use-case";
import { FirebaseTaskRepository } from "./infrastructure/firebase/firebase-task-repository";

export function makeCreateTaskUseCase() {
  const repository = new FirebaseTaskRepository();

  return new CreateTaskUseCase(repository);
}

export function makeListTasksByDateUseCase() {
  const repository = new FirebaseTaskRepository();

  return new ListTasksByDateUseCase(repository);
}

export function makeListPendingTasksUseCase() {
  const repository = new FirebaseTaskRepository();

  return new ListPendingTasksUseCase(repository);
}

export function makeBringPendingTasksToTodayUseCase() {
  const repository = new FirebaseTaskRepository();

  return new BringPendingTasksToTodayUseCase(repository);
}
