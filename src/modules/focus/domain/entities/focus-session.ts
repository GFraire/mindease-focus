import { TOTAL_CYCLES } from "../constants/focus-config";

export type Phase = "focus" | "break" | "longBreak";

interface Props {
  phase: Phase;
  cycle: number;
  totalFocusCycles: number;
}

export class FocusSession {
  phase: Phase;
  cycle: number;
  totalFocusCycles: number;

  constructor(props: Props) {
    this.phase = props.phase;
    this.cycle = props.cycle;
    this.totalFocusCycles = props.totalFocusCycles;
  }

  isLastCycle() {
    return this.cycle === TOTAL_CYCLES;
  }

  nextTotalCycles() {
    return this.totalFocusCycles + 1;
  }
}
