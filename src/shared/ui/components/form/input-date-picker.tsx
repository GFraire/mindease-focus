import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/components/ui/button";
import { Calendar } from "@/shared/ui/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/components/ui/popover";

import { type Matcher } from "react-day-picker";
import { formatDate } from "../../../utils/date/date-helper";

export interface InputDatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  disabled?: Matcher | Matcher[];
}

export function InputDatePicker({
  value,
  onChange,
  disabled,
}: InputDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />

          {value ? formatDate(value) : "Escolha uma data"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
