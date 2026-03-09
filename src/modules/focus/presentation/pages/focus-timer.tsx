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

import { FocusSession } from "@/modules/focus/domain/entities/focus-session";
import { getNextFocusPhaseUseCase } from "@/modules/focus/application/use-cases/get-next-focus-phase-use-case";
import { shouldShowCognitiveAlertUseCase } from "@/modules/focus/application/use-cases/should-show-cognitive-alert-use-case";

export function FocusTimer() {
  const getTaskByIdUseCase = useMemo(() => makeGetTaskByIdUseCase(), []);
  const toggleTaskCompletedUseCase = useMemo(
    () => makeToggleTaskCompletedUseCase(),
    [],
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = useParams();

  const muteNotifications = useCognitiveSettingsStore(
    (state) => state.muteNotifications,
  );

  const { playFocusEnd, playBreakEnd } = useTimerSounds();

  const stateTask = location.state as Task | undefined;

  const phaseEndingRef = useRef(false);

  const [task, setTask] = useState<Task | null>(stateTask ?? null);
  const [isLoading, setIsLoading] = useState(!stateTask);

  const [cycle, setCycle] = useState(1);
  const [totalFocusCycles, setTotalFocusCycles] = useState(1);

  const [phase, setPhase] = useState<"focus" | "break" | "longBreak">("focus");

  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const focusMinutes = task?.focusDuration ?? 30;

  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);

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
  }, [taskId]);

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

    const session = new FocusSession({
      phase,
      cycle,
      totalFocusCycles,
    });

    const result = getNextFocusPhaseUseCase({
      session,
      focusMinutes,
    });

    if (
      shouldShowCognitiveAlertUseCase({
        totalFocusCycles: result.totalFocusCycles,
        focusMinutes,
      })
    ) {
      toast.warning("Talvez esta tarefa esteja grande demais.", {
        description: "Dividir em subtarefas menores pode ajudar.",
        action: {
          label: "Editar tarefa",
          onClick: () => navigate(`/edit-task/${task?.id}`),
        },
      });
    }

    setPhase(result.phase);
    setCycle(result.cycle);
    setTotalFocusCycles(result.totalFocusCycles);
    setTimeLeft(result.duration);

    setHasStarted(false);
    setIsRunning(false);
  }

  function toggleTimer() {
    if (!hasStarted) setHasStarted(true);
    setIsRunning((r) => !r);
  }

  async function finish() {
    if (!task) return;

    await toggleTaskCompletedUseCase.execute(task.id, true);

    navigate("/");
  }

  if (isLoading || !task) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-muted-light text-sm">Carregando tarefa...</span>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <main
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

        <div className="flex border p-2 gap-2 border-primary/10 bg-primary/10 rounded-full">
          <Clock className="text-primary" size={20} />
          <span className="text-primary font-semibold text-body-sm">
            SESSÃO DE {focusMinutes} MINUTOS
          </span>
        </div>

        <div className="flex gap-4">
          <TimerBox value={minutes} label="MINUTOS" phase={phase} />
          <TimerBox value={seconds} label="SEGUNDOS" phase={phase} />
        </div>

        <div className="text-center">
          <h1 className="text-heading-lg font-bold text-high-contrast">
            {task.title}
          </h1>
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
          className="[&_svg]:size-5 flex items-center gap-2 mt-2"
          onClick={() => {
            setIsRunning(false);
            setIsExitModalOpen(true);
          }}
        >
          <LogOut />
          <span>Sair do foco</span>
        </BaseButton>

        <BaseButton
          variant="ghost"
          className="[&_svg]:size-5 flex items-center gap-2"
          onClick={() => setOpenSettings(true)}
        >
          <Settings />
          <span>Configurações</span>
        </BaseButton>
      </div>

      <ExitFocusModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={() => navigate("/")}
      />

      <CognitivePanel open={openSettings} onOpenChange={setOpenSettings} />
    </main>
  );
}
