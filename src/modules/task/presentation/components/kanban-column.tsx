import { cn } from "@/shared/lib/utils";
import { CheckCircle2, ClipboardList, PlayCircle } from "lucide-react";

type Color = "muted-light" | "warning" | "success";

type Props = {
  title: string;
  count: number;
  color: Color;
  children: React.ReactNode;
};

export function KanbanColumn({ title, count, color, children }: Props) {
  const dotVariants: Record<Color, string> = {
    warning: "bg-warning",
    "muted-light": "bg-muted-light",
    success: "bg-success",
  };

  const badgeVariants: Record<Color, string> = {
    warning: "bg-warning/12",
    "muted-light": "bg-muted-light/12",
    success: "bg-success/12",
  };

  const emptyState = {
    warning: {
      icon: PlayCircle,
      message: "Nenhuma tarefa em progresso",
    },
    "muted-light": {
      icon: ClipboardList,
      message: "Nenhuma tarefa pendente",
    },
    success: {
      icon: CheckCircle2,
      message: "Nenhuma tarefa concluída ainda",
    },
  };

  const Icon = emptyState[color].icon;

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="flex gap-2 items-center">
        <div className={cn("size-2.5 rounded-full", dotVariants[color])} />

        <span className="font-semibold text-muted">{title}</span>

        <div
          className={cn(
            "size-5 rounded-full flex items-center justify-center",
            badgeVariants[color],
          )}
        >
          <span className={cn("font-bold text-body-sm!", `text-${color}`)}>
            {count}
          </span>
        </div>
      </div>

      <div
        className="h-full overflow-y-auto flex flex-col p-2 rounded-md border border-border bg-border/40
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-muted/40
        [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted gap-2 text-sm">
            <Icon size={22} className="opacity-70" />
            <span>{emptyState[color].message}</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
