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

        <div className="relative flex flex-col gap-0.5">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light pointer-events-none">
              {leftIcon}
            </span>
          )}

          <Input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? "text" : "password") : type}
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
              className="absolute right-3 top-[50%] -translate-y-[50%] text-muted-light hover:text-high-contrast"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>
    );
  },
);
