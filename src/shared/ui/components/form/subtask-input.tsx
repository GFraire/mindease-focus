import { Checkbox } from "@/shared/ui/components/ui/checkbox";
import { Input } from "@/shared/ui/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface SubtaskInputProps {
  value: string;
  placeholder?: string;
  checked?: boolean;
  disabledCheckbox?: boolean;
  className?: string;
  onChange: (value: string) => void;
}

export function SubtaskInput({
  value,
  onChange,
  placeholder = "Primeiro passo...",
  checked = false,
  disabledCheckbox = false,
  className,
}: SubtaskInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-md  bg-background px-4 py-1",
        className,
      )}
    >
      <Checkbox
        className="border-muted-light"
        checked={checked}
        disabled={disabledCheckbox}
      />

      <Input
        className="border-0 bg-transparent! p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none placeholder:text-muted-light"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
