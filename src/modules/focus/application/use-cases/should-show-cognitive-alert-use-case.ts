import { COGNITIVE_ALERT_CYCLES } from "../../domain/constants/cognitive-alert-cycles";

interface Request {
  totalFocusCycles: number;
  focusMinutes: 15 | 30 | 45 | 60;
}

export function shouldShowCognitiveAlertUseCase({
  totalFocusCycles,
  focusMinutes,
}: Request) {
  const limit = COGNITIVE_ALERT_CYCLES[focusMinutes];

  return totalFocusCycles === limit;
}
