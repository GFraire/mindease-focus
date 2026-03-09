import { BaseButton } from "@/shared/ui/components/form/base-button";
import { CircleCheck, Pause, Play, SkipForward } from "lucide-react";
import type { Phase } from "../pages/focus-timer";

interface Props {
  phase: Phase;
  isRunning: boolean;
  hasStarted: boolean;
  onToggle: () => void;
  onFinish: () => void;
  onSkip: () => void;
}

export function FocusControls({
  phase,
  isRunning,
  hasStarted,
  onToggle,
  onFinish,
  onSkip,
}: Props) {
  const toggleLabel = !hasStarted
    ? "Iniciar temporizador"
    : isRunning
      ? "Pausar temporizador"
      : "Retomar temporizador";

  return (
    <div
      className="flex gap-4"
      role="group"
      aria-label="Controles do temporizador de foco"
    >
      <BaseButton
        type="button"
        onClick={onToggle}
        aria-label={toggleLabel}
        aria-pressed={isRunning}
        className="[&_svg]:size-5 flex items-center gap-2 rounded-md bg-muted/10! px-8 py-2 w-42 cursor-pointer hover:bg-muted/15!"
      >
        {isRunning ? (
          <Pause className="text-muted" aria-hidden="true" />
        ) : (
          <Play className="text-muted" aria-hidden="true" />
        )}

        <span className="text-muted text-body-lg font-medium">
          {!hasStarted ? "Iniciar" : isRunning ? "Pausar" : "Retomar"}
        </span>
      </BaseButton>

      {phase === "focus" && (
        <BaseButton
          type="button"
          onClick={onFinish}
          aria-label="Finalizar tarefa atual"
          className="[&_svg]:size-5! flex items-center gap-2 w-42 cursor-pointer rounded-md bg-primary px-8 py-2"
        >
          <CircleCheck className="text-white! " aria-hidden="true" />

          <span className="text-white! text-body-lg font-medium">
            Finalizar
          </span>
        </BaseButton>
      )}

      {phase !== "focus" && (
        <BaseButton
          type="button"
          onClick={onSkip}
          aria-label="Pular intervalo atual"
          variant="ghost"
          className="[&_svg]:size-5! flex items-center gap-2 w-42 cursor-pointer rounded-md px-8 py-2 hover:bg-transparent hover:opacity-80"
        >
          <SkipForward className="text-muted " aria-hidden="true" />

          <span className="text-muted text-body-lg font-medium">
            Pular intervalo
          </span>
        </BaseButton>
      )}
    </div>
  );
}
