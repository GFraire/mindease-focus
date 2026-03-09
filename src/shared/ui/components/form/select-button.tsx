import { Button } from "@/shared/ui/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface SelectButtonProps extends ComponentProps<typeof Button> {
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
  ...props
}: SelectButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={onClick}
      size="lg"
      className={cn(
        "flex-1 border-border text-muted font-semibold cursor-pointer bg-transparent",
        selected &&
          "text-primary bg-primary/15! border-primary hover:bg-primary/15 hover:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
