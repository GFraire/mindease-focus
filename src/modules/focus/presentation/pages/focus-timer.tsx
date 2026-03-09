import { useEffect, useMemo, useState } from "react";
import {
  CircleCheck,
  Clock,
  LogOut,
  Medal,
  Pause,
  Play,
  SkipForward,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Logo from "@/shared/ui/assets/logo.svg?react";

import { TimerBox } from "../components/timer-box";
import { ExitFocusModal } from "../components/exit-focus-modal";

import { BaseButton } from "@/shared/ui/components/form/base-button";
import { Checkbox } from "@/shared/ui/components/ui/checkbox";

import type { Task } from "@/modules/task/domain/entities/task";
import {
  makeGetTaskByIdUseCase,
  makeToggleTaskCompletedUseCase,
} from "@/modules/task/container";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

const TOTAL_CYCLES = 4;

const FOCUS_CONFIG = {
  15: { break: 3 * 1, longBreak: 6 * 1 },
  30: { break: 5 * 1, longBreak: 10 * 1 },
  45: { break: 7 * 1, longBreak: 15 * 1 },
  60: { break: 10 * 1, longBreak: 20 * 1 },
};

const COGNITIVE_ALERT_CYCLES = {
  15: 8,
  30: 6,
  45: 5,
  60: 4,
};

export type Phase = "focus" | "break" | "longBreak";

export function FocusTimer() {
  const getTaskByIdUseCase = useMemo(() => makeGetTaskByIdUseCase(), []);

  const toggleTaskCompletedUseCase = useMemo(
    () => makeToggleTaskCompletedUseCase(),
    [],
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = useParams();

  const stateTask = location.state as Task | undefined;

  const [task, setTask] = useState<Task | null>(stateTask ?? null);
  const [isLoading, setIsLoading] = useState(!stateTask);
  const [cycle, setCycle] = useState(1);
  const [totalFocusCycles, setTotalFocusCycles] = useState(1);
  const [phase, setPhase] = useState<Phase>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const focusMinutes = task?.focusDuration ?? 30;
  const focusDuration = 2; // teste
  const breakDuration = FOCUS_CONFIG[focusMinutes].break;
  const longBreakDuration = FOCUS_CONFIG[focusMinutes].longBreak;
  const [timeLeft, setTimeLeft] = useState(focusDuration);

  useEffect(() => {
    if (!taskId || stateTask) return;

    async function loadTask() {
      const task = await getTaskByIdUseCase.execute(taskId!);
      if (!task) {
        navigate("/");
        return;
      }

      setTask(task);
      setIsLoading(false);
    }

    loadTask();
  }, [taskId, stateTask, getTaskByIdUseCase, navigate]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handlePhaseEnd();
          return prev;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  function handlePhaseEnd() {
    setHasStarted(false);
    setIsRunning(false);

    if (phase === "focus") {
      if (cycle === TOTAL_CYCLES) {
        setPhase("longBreak");
        setTimeLeft(longBreakDuration);
      } else {
        setPhase("break");
        setTimeLeft(breakDuration);
      }
      return;
    }

    const nextTotalCycles = totalFocusCycles + 1;

    if (phase === "break") {
      setCycle(cycle + 1);
      setTotalFocusCycles(nextTotalCycles);
      checkCognitiveLoadAlert(nextTotalCycles);
      setPhase("focus");
      setTimeLeft(focusDuration);
      return;
    }

    if (phase === "longBreak") {
      setCycle(1);
      setTotalFocusCycles(nextTotalCycles);
      checkCognitiveLoadAlert(nextTotalCycles);
      setPhase("focus");
      setTimeLeft(focusDuration);
    }
  }

  function toggleTimer() {
    if (!hasStarted) {
      setHasStarted(true);
    }

    setIsRunning((r) => !r);
  }

  async function finish() {
    if (!task) return;

    try {
      setIsRunning(false);

      await toggleTaskCompletedUseCase.execute(task.id, true);

      navigate("/");
    } catch (error) {
      console.error("Erro ao finalizar tarefa:", error);
    }
  }

  if (isLoading || !task) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-muted-light text-sm">Carregando tarefa...</span>
      </div>
    );
  }

  function checkCognitiveLoadAlert(nextTotalCycles: number) {
    if (!task) return;

    const limit = COGNITIVE_ALERT_CYCLES[focusMinutes];

    if (nextTotalCycles === limit) {
      toast.warning("Talvez esta tarefa esteja grande demais.", {
        description: "Dividir em subtarefas menores pode ajudar.",
        action: {
          label: "Editar tarefa",
          onClick: () => navigate(`/edit-task/${task.id}`),
        },
      });
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center",
        phase !== "focus" && "bg-success/15",
      )}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2 items-center">
          <Logo
            className={cn(
              "w-8 h-8",
              phase === "focus" ? "text-primary" : "text-success",
            )}
          />

          <span
            className={cn(
              "text-heading! font-bold",
              phase === "focus" ? "text-primary" : "text-success",
            )}
          >
            MindEase Focus
          </span>
        </div>

        {/* barras */}
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

        <div className="flex border p-2 gap-2 border-primary/10 bg-primary/10 rounded-full">
          <Clock className="text-primary" size={20} />
          <span className="text-primary font-semibold text-body-sm">
            SESSÃO DE {focusMinutes} MINUTOS
          </span>
        </div>

        <div className="flex gap-4">
          <TimerBox value={formattedMinutes} label="MINUTOS" phase={phase} />

          <TimerBox value={formattedSeconds} label="SEGUNDOS" phase={phase} />
        </div>

        <div className="text-center">
          <h1 className="text-heading-lg font-bold text-high-contrast">
            {task.title}
          </h1>

          <p className="mt-2 text-muted text-body">
            {phase === "longBreak"
              ? "Intervalo longo - Respire fundo e levante um pouco."
              : phase === "break"
                ? "Intervalo curto - Aproveite para se alongar ou beber água."
                : "Mantenha o foco. Você está indo bem."}
          </p>
        </div>

        {task.subtasks.some((s) => s.trim() !== "") && phase === "focus" && (
          <div className="flex flex-col gap-2 bg-card p-4 w-full rounded-md border border-border">
            {task.subtasks
              .filter((s) => s.trim() !== "")
              .map((subtask, index) => (
                <div
                  className="flex items-center gap-4 p-3 bg-background rounded-md"
                  key={index}
                >
                  <Checkbox className="border-muted-light size-5 border-2 cursor-pointer" />

                  <span className="text-body text-high-contrast">
                    {subtask}
                  </span>
                </div>
              ))}
          </div>
        )}

        <div className="flex gap-4">
          <BaseButton
            onClick={toggleTimer}
            className="[&_svg]:size-5! flex items-center gap-2 rounded-md bg-muted/10 px-8 py-2 w-42 cursor-pointer hover:bg-muted/15"
          >
            {isRunning ? (
              <Pause className="text-muted" />
            ) : (
              <Play className="text-muted" />
            )}
            <span className="text-muted text-body-lg font-medium">
              {!hasStarted ? "Iniciar" : isRunning ? "Pausar" : "Retomar"}
            </span>
          </BaseButton>

          {phase === "focus" && (
            <BaseButton
              onClick={finish}
              className="[&_svg]:size-5! flex items-center gap-2 w-42 cursor-pointer rounded-md bg-primary px-8 py-2"
            >
              <CircleCheck className="text-white! " />

              <span className="text-white! text-body-lg font-medium">
                Finalizar
              </span>
            </BaseButton>
          )}

          {phase !== "focus" && (
            <BaseButton
              onClick={handlePhaseEnd}
              variant="ghost"
              className="[&_svg]:size-5! flex items-center gap-2 w-42 cursor-pointer rounded-md px-8 py-2 hover:bg-transparent hover:opacity-80"
            >
              <SkipForward className="text-muted " />

              <span className="text-muted text-body-lg font-medium">
                Pular intervalo
              </span>
            </BaseButton>
          )}
        </div>

        <BaseButton
          variant="ghost"
          className="[&_svg]:size-5! flex items-center gap-2 mt-2 cursor-pointer hover:bg-transparent hover:opacity-60"
          onClick={() => {
            setIsRunning(false);
            setIsExitModalOpen(true);
          }}
        >
          <LogOut className="text-muted-light" />

          <span className="text-muted-light text-body-lg">Sair do foco</span>
        </BaseButton>
      </div>

      <ExitFocusModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={() => navigate("/")}
      />
    </div>
  );
}
