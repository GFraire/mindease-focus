import type {
  EnergyLevel,
  FocusDuration,
} from "../../application/dtos/create-task-dto";

export interface Task {
  id: string;
  userId: string;
  title: string;
  subtasks: string[];
  energy: EnergyLevel;
  focusDuration: FocusDuration;
  scheduledFor: string; // YYYY-MM-DD
  completed: boolean;
  inProgress: boolean;
  createdAt: string; // YYYY-MM-DD
}
