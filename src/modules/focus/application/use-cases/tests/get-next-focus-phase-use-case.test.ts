import { describe, it, expect } from "vitest";
import { FocusSession } from "../../../domain/entities/focus-session";
import { getNextFocusPhaseUseCase } from "../get-next-focus-phase-use-case";
import {
  TOTAL_CYCLES,
  FOCUS_CONFIG,
} from "../../../domain/constants/focus-config";

describe("getNextFocusPhaseUseCase", () => {
  it("should transition from focus to break when it is not the last cycle", () => {
    const session = new FocusSession({
      phase: "focus",
      cycle: 1,
      totalFocusCycles: 1,
    });

    const result = getNextFocusPhaseUseCase({
      session,
      focusMinutes: 30,
    });

    expect(result).toEqual({
      phase: "break",
      cycle: 1,
      totalFocusCycles: 1,
      duration: FOCUS_CONFIG[30].break * 60,
    });
  });

  it("should transition from focus to longBreak on the last cycle", () => {
    const session = new FocusSession({
      phase: "focus",
      cycle: TOTAL_CYCLES,
      totalFocusCycles: 3,
    });

    const result = getNextFocusPhaseUseCase({
      session,
      focusMinutes: 30,
    });

    expect(result).toEqual({
      phase: "longBreak",
      cycle: TOTAL_CYCLES,
      totalFocusCycles: 3,
      duration: FOCUS_CONFIG[30].longBreak * 60,
    });
  });

  it("should transition from break to focus and increment the cycle", () => {
    const session = new FocusSession({
      phase: "break",
      cycle: 2,
      totalFocusCycles: 5,
    });

    const result = getNextFocusPhaseUseCase({
      session,
      focusMinutes: 30,
    });

    expect(result).toEqual({
      phase: "focus",
      cycle: 3,
      totalFocusCycles: 6,
      duration: 30 * 60,
    });
  });

  it("should transition from longBreak to focus and reset the cycle", () => {
    const session = new FocusSession({
      phase: "longBreak",
      cycle: TOTAL_CYCLES,
      totalFocusCycles: 7,
    });

    const result = getNextFocusPhaseUseCase({
      session,
      focusMinutes: 30,
    });

    expect(result).toEqual({
      phase: "focus",
      cycle: 1,
      totalFocusCycles: 8,
      duration: 30 * 60,
    });
  });

  it("should calculate the correct duration for different focus times", () => {
    const session = new FocusSession({
      phase: "focus",
      cycle: 1,
      totalFocusCycles: 1,
    });

    const result = getNextFocusPhaseUseCase({
      session,
      focusMinutes: 45,
    });

    expect(result.duration).toBe(FOCUS_CONFIG[45].break * 60);
  });
});
