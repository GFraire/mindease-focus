import { cn } from "@/shared/lib/utils";
import type { Phase } from "../../domain/entities/focus-session";

interface TimerBoxProps {
  value: string | number;
  label: string;
  phase: Phase;
}

export function TimerBox({ value, label, phase }: TimerBoxProps) {
  const valueId = `timer-${label.toLowerCase()}-value`;

  return (
    <div
      className="flex flex-col items-center gap-3"
      role="group"
      aria-labelledby={valueId}
      aria-label={`${value} ${label.toLowerCase()}`}
    >
      <div className="flex flex-col items-center justify-center rounded-xl bg-card size-40 shadow">
        <span
          id={valueId}
          aria-live="off"
          className={cn(
            "text-7xl font-bold",
            phase === "focus" ? "text-high-contrast" : "text-success",
          )}
        >
          {value}
        </span>
      </div>

      <span
        aria-hidden="true"
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
