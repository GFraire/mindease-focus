import { describe, it, expect } from "vitest";
import { shouldShowCognitiveAlertUseCase } from "../should-show-cognitive-alert-use-case";
import { COGNITIVE_ALERT_CYCLES } from "../../../domain/constants/cognitive-alert-cycles";

describe("shouldShowCognitiveAlertUseCase", () => {
  it("should return true when the cognitive cycle limit is reached", () => {
    const result = shouldShowCognitiveAlertUseCase({
      totalFocusCycles: COGNITIVE_ALERT_CYCLES[30],
      focusMinutes: 30,
    });

    expect(result).toBe(true);
  });

  it("should return false when the total cycles are below the limit", () => {
    const result = shouldShowCognitiveAlertUseCase({
      totalFocusCycles: COGNITIVE_ALERT_CYCLES[30] - 1,
      focusMinutes: 30,
    });

    expect(result).toBe(false);
  });

  it("should return false when the total cycles are above the limit", () => {
    const result = shouldShowCognitiveAlertUseCase({
      totalFocusCycles: COGNITIVE_ALERT_CYCLES[30] + 1,
      focusMinutes: 30,
    });

    expect(result).toBe(false);
  });

  it("should work correctly for all focus durations", () => {
    const focusTimes: Array<15 | 30 | 45 | 60> = [15, 30, 45, 60];

    focusTimes.forEach((focusMinutes) => {
      const limit = COGNITIVE_ALERT_CYCLES[focusMinutes];

      const result = shouldShowCognitiveAlertUseCase({
        totalFocusCycles: limit,
        focusMinutes,
      });

      expect(result).toBe(true);
    });
  });
});
