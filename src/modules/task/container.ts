import { BringLateTasksToTodayUseCase } from "./application/use-cases/bring-late-tasks-to-today-use-case";
import { CreateTaskUseCase } from "./application/use-cases/create-task-use-case";
import { DeleteTaskUseCase } from "./application/use-cases/delete-task-use-case";
import { GetTaskByIdUseCase } from "./application/use-cases/get-task-by-id-use-case";
import { ListLateTasksUseCase } from "./application/use-cases/list-late-tasks-use-case";
import { ListTasksByDateUseCase } from "./application/use-cases/list-tasks-by-date-use-case";
import { MoveTaskStatusUseCase } from "./application/use-cases/move-task-status-use-case";
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

export function makeListLateTasksUseCase() {
  const repository = new FirebaseTaskRepository();

  return new ListLateTasksUseCase(repository);
}

export function makeBringLateTasksToTodayUseCase() {
  const repository = new FirebaseTaskRepository();

  return new BringLateTasksToTodayUseCase(repository);
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

export function makeMoveTaskStatusUseCase() {
  const repository = new FirebaseTaskRepository();

  return new MoveTaskStatusUseCase(repository);
}
