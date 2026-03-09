import Logo from "@/shared/ui/assets/logo.svg?react";
import { cn } from "@/shared/lib/utils";
import type { Phase } from "../pages/focus-timer";

interface Props {
  phase: Phase;
}

export function FocusHeader({ phase }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <Logo
        className={cn(
          "w-8 h-8",
          phase === "focus" ? "text-primary" : "text-success",
        )}
      />

      <span
        className={cn(
          "text-heading font-bold",
          phase === "focus" ? "text-primary" : "text-success",
        )}
      >
        MindEase Focus
      </span>
    </div>
  );
}
