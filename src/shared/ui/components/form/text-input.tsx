import { forwardRef, useId } from "react";
import { Input } from "@/shared/ui/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showLabel?: boolean;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { label, showLabel = true, className, id, error, ...props },
    ref,
  ) {
    const inputId = id ?? useId();

    return (
      <div className="flex flex-col gap-2">
        {showLabel && label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-emphasis"
          >
            {label}
          </label>
        )}

        <div className="flex flex-col gap-0.5">
          <Input
          ref={ref}
          id={inputId}
          className={cn(
            "border-border rounded-md text-high-contrast placeholder:text-muted-light py-5",
            error && "border-red-500 focus-visible:ring-red-500",
            className,
          )}
          {...props}
        />

        {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>
    );
  },
);
