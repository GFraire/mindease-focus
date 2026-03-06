import { Button } from "@/shared/ui/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface SelectButtonProps {
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export function SelectButton({
  selected = false,
  className,
  onClick,
  children,
}: SelectButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      size="lg"
      className={cn(
        "flex-1 border-border text-muted font-semibold cursor-pointer bg-transparent",
        selected &&
          "text-primary bg-primary/15! border-primary hover:bg-primary/15 hover:text-primary",
        className,
      )}
    >
      {children}
    </Button>
  );
}
