export interface FocusSession {
  id: string;
  userId: string;
  taskId: string;
  cycle: number;
  totalCycles: number;
  focusDuration: number;
  breakDuration: number;
  startedAt: string;
  finished: boolean;
}
