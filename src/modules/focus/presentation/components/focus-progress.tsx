import { Medal } from "lucide-react";
import type { Phase } from "../../domain/entities/focus-session";

interface Props {
  cycle: number;
  totalFocusCycles: number;
  phase: Phase;
}

const TOTAL_CYCLES = 4;

export function FocusProgress({ cycle, totalFocusCycles, phase }: Props) {
  return (
    <div
      className="flex flex-col gap-2 items-center"
      role="group"
      aria-label="Progresso da sessão de foco"
    >
      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_CYCLES}
        aria-valuenow={cycle}
        aria-label={`Ciclo ${cycle} de ${TOTAL_CYCLES}`}
      >
        {Array.from({ length: TOTAL_CYCLES }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className={`h-2 w-14 rounded-full ${
                index < cycle ? "bg-primary" : "bg-muted-light/50"
              }`}
            />

            {index !== TOTAL_CYCLES - 1 && (
              <div
                aria-hidden="true"
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
          aria-hidden="true"
          className={`h-2 w-6 rounded-full ${
            phase === "longBreak" ? "bg-success" : "bg-muted-light/50"
          }`}
        />
      </div>

      <span className="sr-only" aria-live="polite">
        Você está no ciclo {cycle} de {TOTAL_CYCLES}. Total de sessões de foco
        concluídas: {totalFocusCycles}.
      </span>

      <div className="flex gap-4 items-center">
        <span className="text-body-small font-medium text-muted-light">
          CICLO {cycle} DE {TOTAL_CYCLES}
        </span>

        {totalFocusCycles > 4 && (
          <div
            className="flex gap-2 px-2 py-1 border border-muted-light rounded-full"
            role="status"
            aria-label={`${totalFocusCycles} ciclos de foco concluídos`}
          >
            <Medal className="text-muted-light" aria-hidden="true" />

            <span className="text-body-small font-medium text-muted-light">
              {totalFocusCycles}° CICLO DE FOCO
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
