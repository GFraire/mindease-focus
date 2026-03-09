import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, LogOut, Settings } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { FocusHeader } from "../components/focus-header";
import { FocusProgress } from "../components/focus-progress";
import { FocusTaskCard } from "../components/focus-task-card";
import { FocusControls } from "../components/focus-controls";
import { TimerBox } from "../components/timer-box";
import { ExitFocusModal } from "../components/exit-focus-modal";

import { BaseButton } from "@/shared/ui/components/form/base-button";

import type { Task } from "@/modules/task/domain/entities/task";

import {
  makeGetTaskByIdUseCase,
  makeToggleTaskCompletedUseCase,
} from "@/modules/task/container";

import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import { useTimerSounds } from "@/shared/ui/hooks/use-timer-sounds";
import { useCognitiveSettingsStore } from "@/shared/ui/store/cognitive-settings-store";
import { CognitivePanel } from "@/shared/ui/components/cognitive-panel";

const TOTAL_CYCLES = 4;

const FOCUS_CONFIG = {
  15: { break: 3, longBreak: 6 },
  30: { break: 5, longBreak: 10 },
  45: { break: 7, longBreak: 15 },
  60: { break: 10, longBreak: 20 },
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

  const muteNotifications = useCognitiveSettingsStore(
    (state) => state.muteNotifications,
  );

  const { taskId } = useParams();
  const { playFocusEnd, playBreakEnd } = useTimerSounds();

  const stateTask = location.state as Task | undefined;

  const phaseEndingRef = useRef(false);

  const [task, setTask] = useState<Task | null>(stateTask ?? null);
  const [isLoading, setIsLoading] = useState(!stateTask);

  const [cycle, setCycle] = useState(1);
  const [totalFocusCycles, setTotalFocusCycles] = useState(1);

  const [phase, setPhase] = useState<Phase>("focus");

  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

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
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  useEffect(() => {
    phaseEndingRef.current = false;
  }, [phase]);

  function handlePhaseEnd() {
    if (phaseEndingRef.current) return;

    phaseEndingRef.current = true;

    if (phase === "focus") {
      playFocusEnd(muteNotifications);
    } else {
      playBreakEnd(muteNotifications);
    }

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
        position: "bottom-center",
      });
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
        <FocusHeader phase={phase} />

        <FocusProgress
          cycle={cycle}
          totalFocusCycles={totalFocusCycles}
          phase={phase}
        />

        {/* sessão */}
        <div className="flex border p-2 gap-2 border-primary/10 bg-primary/10 rounded-full">
          <Clock className="text-primary" size={20} />

          <span className="text-primary font-semibold text-body-sm">
            SESSÃO DE {focusMinutes} MINUTOS
          </span>
        </div>

        {/* timer */}
        <div className="flex gap-4">
          <TimerBox value={formattedMinutes} label="MINUTOS" phase={phase} />

          <TimerBox value={formattedSeconds} label="SEGUNDOS" phase={phase} />
        </div>

        {/* título */}
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

        {phase === "focus" && <FocusTaskCard task={task} />}

        <FocusControls
          phase={phase}
          isRunning={isRunning}
          hasStarted={hasStarted}
          onToggle={toggleTimer}
          onFinish={finish}
          onSkip={handlePhaseEnd}
        />

        <BaseButton
          variant="ghost"
          className="[&_svg]:size-5 flex items-center gap-2 mt-2 cursor-pointer hover:bg-transparent hover:opacity-60"
          onClick={() => {
            setIsRunning(false);
            setIsExitModalOpen(true);
          }}
        >
          <LogOut className="text-muted-light" />

          <span className="text-muted-light text-body-lg">Sair do foco</span>
        </BaseButton>

        <BaseButton
          variant="ghost"
          className="[&_svg]:size-5 flex items-center gap-2 cursor-pointer hover:bg-transparent hover:opacity-60"
          onClick={() => setOpenSettings(true)}
        >
          <Settings className="text-muted-light" />

          <span className="text-muted-light text-body-lg">Configurações</span>
        </BaseButton>
      </div>

      <ExitFocusModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={() => navigate("/")}
      />

      <CognitivePanel open={openSettings} onOpenChange={setOpenSettings} />
    </div>
  );
}
