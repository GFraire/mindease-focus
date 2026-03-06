import { Play, Target } from "lucide-react";
import { Button } from "@/shared/ui/components/ui/button";
import { FocusNowTaskActions } from "./focus-now-task-action";

interface FocusNowCardProps {
  title: string;
  duration?: number;
  onStart?: () => void;
}

export function FocusNowCard({
  title,
  duration = 60,
  onStart,
}: FocusNowCardProps) {
  return (
    <div className="w-full flex rounded-md shadow overflow-hidden border-border bg-card">
      <div className="flex items-center justify-center aspect-square bg-linear-to-b from-indigo-600 to-purple-600 px-10">
        <Target className="h-12 w-12 text-white" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-col gap-2">
          <span className="text-caption font-bold uppercase tracking-wide text-primary">
            Em foco agora
          </span>

          <h2 className="text-heading-lg font-bold text-high-contrast">
            {title}
          </h2>

          <p className="text-body text-muted">
            De acordo com o seu painel cognitivo, esta é a tarefa que mais
            merece sua atenção agora. <br />
            Concentre-se por{" "}
            <span className="text-primary">{duration} minutos</span> sem
            distrações e faça progresso real.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={onStart}
            className="gap-2 bg-primary cursor-pointer text-white! hover:bg-primary/80 font-semibold"
          >
            <Play className="h-5 w-5" />
            Iniciar foco
          </Button>

          <FocusNowTaskActions />
        </div>
      </div>
    </div>
  );
}
