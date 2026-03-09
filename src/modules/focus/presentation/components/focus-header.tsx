import Logo from "@/shared/ui/assets/logo.svg?react";
import { cn } from "@/shared/lib/utils";
import type { Phase } from "../../domain/entities/focus-session";

interface Props {
  phase: Phase;
}

export function FocusHeader({ phase }: Props) {
  return (
    <header className="flex gap-2 items-center" aria-label="MindEase Focus">
      <Logo
        className={cn(
          "w-8 h-8",
          phase === "focus" ? "text-primary" : "text-success",
        )}
        aria-hidden="true"
        focusable="false"
      />

      <span
        className={cn(
          "text-heading font-bold",
          phase === "focus" ? "text-primary" : "text-success",
        )}
      >
        MindEase Focus
      </span>
    </header>
  );
}
