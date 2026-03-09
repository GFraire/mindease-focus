import type { FocusSession } from "../../domain/entities/focus-session";

interface StartFocusSessionRequest {
  userId: string;
  taskId: string;
}

interface StartFocusSessionResponse {
  session: FocusSession;
}

export class StartFocusSessionUseCase {
  async execute({
    userId,
    taskId,
  }: StartFocusSessionRequest): Promise<StartFocusSessionResponse> {
    const session: FocusSession = {
      id: crypto.randomUUID(),
      userId,
      taskId,
      cycle: 1,
      totalCycles: 4,
      focusDuration: 30,
      breakDuration: 5,
      startedAt: new Date().toISOString(),
      finished: false,
    };

    return {
      session,
    };
  }
}
