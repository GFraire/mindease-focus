import { Search } from "lucide-react";
import { TextInput } from "@/shared/ui/components/form/text-input";
import { DateFilter } from "./date-filter";

type DateFilterType = "today" | "tomorrow" | "custom";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  dateFilter: DateFilterType;
  customDate?: Date;

  onDateChange: (filter: DateFilterType, date?: Date) => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  dateFilter,
  customDate,
  onDateChange,
}: TaskFiltersProps) {
  return (
    <section
      aria-labelledby="task-filters-title"
      className="flex flex-col gap-4"
    >
      <h2 id="task-filters-title" className="sr-only">
        Filtros de tarefas
      </h2>

      <TextInput
        label="Buscar tarefa"
        placeholder="Procurar tarefa..."
        leftIcon={<Search size={18} aria-hidden="true" />}
        value={search}
        aria-label="Buscar tarefas pelo título"
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div aria-label="Filtro de data das tarefas">
        <DateFilter
          value={dateFilter}
          customDate={customDate}
          onChange={onDateChange}
        />
      </div>
    </section>
  );
}
