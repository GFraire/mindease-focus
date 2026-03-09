import { Medal } from "lucide-react";
import type { Phase } from "../pages/focus-timer";

interface Props {
  cycle: number;
  totalFocusCycles: number;
  phase: Phase;
}

const TOTAL_CYCLES = 4;

export function FocusProgress({ cycle, totalFocusCycles, phase }: Props) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_CYCLES }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`h-2 w-14 rounded-full ${
                index < cycle ? "bg-primary" : "bg-muted-light/50"
              }`}
            />

            {index !== TOTAL_CYCLES - 1 && (
              <div
                className={`h-2 w-3 rounded-full ${
                  index < cycle - 1 ||
                  (phase !== "focus" && index === cycle - 1)
                    ? "bg-success"
                    : "bg-muted-light/50"
                }`}
              />
            )}
          </div>
        ))}

        <div
          className={`h-2 w-6 rounded-full ${
            phase === "longBreak" ? "bg-success" : "bg-muted-light/50"
          }`}
        />
      </div>

      <div className="flex gap-4 items-center">
        <span className="text-body-small font-medium text-muted-light">
          CICLO {cycle} DE {TOTAL_CYCLES}
        </span>

        {totalFocusCycles > 4 && (
          <div className="flex gap-2 px-2 py-1 border border-muted-light rounded-full">
            <Medal className="text-muted-light" />

            <span className="text-body-small font-medium text-muted-light">
              {totalFocusCycles}° CICLO DE FOCO
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
