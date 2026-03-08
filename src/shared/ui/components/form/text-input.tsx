import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Input } from "@/shared/ui/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showLabel?: boolean;
  error?: string;
  leftIcon?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { label, showLabel = true, className, id, error, type, leftIcon, ...props },
    ref,
  ) {
    const inputId = id ?? useId();
    const errorId = `${inputId}-error`;

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

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

        {/* wrapper apenas do input */}
        <div className="relative">
          {leftIcon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <Input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "border-border rounded-md text-high-contrast placeholder:text-muted-light py-5",
              isPassword && "pr-10",
              leftIcon && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light hover:text-high-contrast"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {/* erro separado */}
        {error && (
          <span id={errorId} className="text-sm text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  },
);
