import { BringPendingTasksToTodayUseCase } from "./application/use-cases/bring-pending-tasks-to-today-use-case";
import { CreateTaskUseCase } from "./application/use-cases/create-task-use-case";
import { DeleteTaskUseCase } from "./application/use-cases/delete-task-use-case";
import { GetTaskByIdUseCase } from "./application/use-cases/get-task-by-id-use-case";
import { ListPendingTasksUseCase } from "./application/use-cases/list-pending-tasks-use-case";
import { ListTasksByDateUseCase } from "./application/use-cases/list-tasks-by-date-use-case";
import { ToggleTaskCompletedUseCase } from "./application/use-cases/toggle-task-completed-use-case";
import { UpdateTaskUseCase } from "./application/use-cases/update-task-use-case";
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

export function makeDeleteTaskUseCase() {
  const repository = new FirebaseTaskRepository();

  return new DeleteTaskUseCase(repository);
}

export function makeGetTaskByIdUseCase() {
  const repository = new FirebaseTaskRepository();

  return new GetTaskByIdUseCase(repository);
}

export function makeUpdateTaskUseCase() {
  const repository = new FirebaseTaskRepository();

  return new UpdateTaskUseCase(repository);
}

export function makeToggleTaskCompletedUseCase() {
  const repository = new FirebaseTaskRepository();

  return new ToggleTaskCompletedUseCase(repository);
}
