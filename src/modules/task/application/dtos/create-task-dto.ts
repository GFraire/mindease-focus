export type EnergyLevel = "low" | "medium" | "high";
export type WhenToDo = "today" | "tomorrow" | "custom";
export type FocusDuration = 15 | 30 | 45 | 60;

export interface CreateTaskDTO {
  title: string;
  subtasks: string[];
  when: WhenToDo;
  energy: EnergyLevel;
  focusDuration: FocusDuration;
  date: Date;
}
