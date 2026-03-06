import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { Calendar } from "@/shared/ui/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/components/ui/popover";
import { cn } from "@/shared/lib/utils";

type DateFilterType = "today" | "tomorrow" | "custom";

interface DateFilterProps {
  value: DateFilterType;
  customDate?: Date;
  onChange: (filter: DateFilterType, date?: Date) => void;
}

export function DateFilter({ value, customDate, onChange }: DateFilterProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  function handleDateChange(newDate: DateFilterType) {
    if (newDate === "today") {
      onChange("today", new Date());
      return;
    }

    if (newDate === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      onChange("tomorrow", tomorrow);
      return;
    }

    if (newDate === "custom") {
      setCalendarOpen(true);
      onChange("custom", customDate);
    }
  }

  function handleCustomDateSelect(date?: Date) {
    setCalendarOpen(false);

    if (!date) {
      onChange("custom", date);
      return;
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isToday = isSameDay(date, today);
    const isTomorrow = isSameDay(date, tomorrow);

    if (isToday) {
      onChange("today", date);
    } else if (isTomorrow) {
      onChange("tomorrow", date);
    } else {
      onChange("custom", date);
    }
  }

  function isSameDay(a: Date, b: Date) {
    return a.toDateString() === b.toDateString();
  }

  return (
    <div className="flex gap-2">
      <BaseButton
        className={cn(
          "text-muted bg-card border border-border hover:bg-card/10 cursor-pointer",
          value === "today" &&
            "bg-primary text-white! border-primary hover:bg-primary",
        )}
        onClick={() => handleDateChange("today")}
      >
        Hoje
      </BaseButton>

      <BaseButton
        className={cn(
          "text-muted bg-card border border-border hover:bg-card/10 cursor-pointer",
          value === "tomorrow" &&
            "bg-primary text-white! border-primary hover:bg-primary",
        )}
        onClick={() => handleDateChange("tomorrow")}
      >
        Amanhã
      </BaseButton>

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <BaseButton
            className={cn(
              "text-muted bg-card border border-border hover:bg-card/10 cursor-pointer",
              value === "custom" &&
                "bg-primary text-white! border-primary hover:bg-primary",
            )}
            onClick={() => handleDateChange("custom")}
          >
            <CalendarIcon className="h-5 w-5" />
            Outro dia
          </BaseButton>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={customDate}
            onSelect={handleCustomDateSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
