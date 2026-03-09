import { cn } from "@/shared/lib/utils";
import type { Phase } from "../pages/focus-timer";

interface TimerBoxProps {
  value: string | number;
  label: string;
  phase: Phase;
}

export function TimerBox({ value, label, phase }: TimerBoxProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center justify-center rounded-xl bg-card size-40 shadow">
        <span
          className={cn(
            "text-7xl font-bold",
            phase === "focus" ? "text-high-contrast" : "text-success",
          )}
        >
          {value}
        </span>
      </div>

      <span
        className={cn(
          "text-body-sm! font-medium tracking-widest",
          phase === "focus" ? "text-muted" : "text-success",
        )}
      >
        {label}
      </span>
    </div>
  );
}
