import { FocusSession, type Phase } from "../../domain/entities/focus-session";
import {
  TOTAL_CYCLES,
  FOCUS_CONFIG,
} from "../../domain/constants/focus-config";

interface Request {
  session: FocusSession;
  focusMinutes: 15 | 30 | 45 | 60;
}

interface Response {
  phase: Phase;
  cycle: number;
  totalFocusCycles: number;
  duration: number;
}

export function getNextFocusPhaseUseCase({
  session,
  focusMinutes,
}: Request): Response {
  const config = FOCUS_CONFIG[focusMinutes];

  if (session.phase === "focus") {
    if (session.cycle === TOTAL_CYCLES) {
      return {
        phase: "longBreak",
        cycle: session.cycle,
        totalFocusCycles: session.totalFocusCycles,
        duration: config.longBreak * 60,
      };
    }

    return {
      phase: "break",
      cycle: session.cycle,
      totalFocusCycles: session.totalFocusCycles,
      duration: config.break * 60,
    };
  }

  const nextTotal = session.totalFocusCycles + 1;

  if (session.phase === "break") {
    return {
      phase: "focus",
      cycle: session.cycle + 1,
      totalFocusCycles: nextTotal,
      duration: focusMinutes * 60,
    };
  }

  return {
    phase: "focus",
    cycle: 1,
    totalFocusCycles: nextTotal,
    duration: focusMinutes * 60,
  };
}
