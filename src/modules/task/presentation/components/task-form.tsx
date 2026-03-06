import { useState } from "react";
import { SelectButton } from "@/shared/ui/components/form/select-button";
import { TextInput } from "@/shared/ui/components/form/text-input";
import { SubtaskInput } from "@/shared/ui/components/form/subtask-input";
import { Calendar, CircleCheck, Undo2 } from "lucide-react";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { InputDatePicker } from "@/shared/ui/components/form/input-date-picker";
import { addDays } from "@/shared/utils/date/date-helper";
import { useNavigate } from "react-router-dom";
import type { CreateTaskDTO } from "../../application/dtos/create-task-dto";

type EnergyLevel = "low" | "medium" | "high";
type FocusDuration = 15 | 30 | 45 | 60;
type WhenToDo = "today" | "tomorrow" | "custom";

export interface TaskFormValues {
  title: string;
  subtasks: string[];
  energy: EnergyLevel;
  when: WhenToDo;
  focusDuration: FocusDuration;
  date: Date | undefined;
}

interface TaskFormProps {
  title: string;
  subtitle: string;
  initialData?: TaskFormValues;
  submitLabel?: string;
  isLoading?: boolean;
  onSubmit: (data: CreateTaskDTO) => void;
}

export function TaskForm({
  title,
  subtitle,
  initialData,
  onSubmit,
  submitLabel = "Salvar tarefa",
  isLoading = false,
}: TaskFormProps) {
  const navigate = useNavigate();

  const [values, setValues] = useState<TaskFormValues>(
    initialData ?? {
      title: "",
      subtasks: ["", "", ""],
      energy: "medium",
      when: "today",
      focusDuration: 30,
      date: undefined,
    },
  );

  const [errors, setErrors] = useState<{ title?: string }>({});

  function validate() {
    const newErrors: { title?: string } = {};

    if (!values.title.trim()) {
      newErrors.title = "O título da tarefa é obrigatório";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function update<K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K],
  ) {
    if (key === "title") {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }

    setValues((prev) => {
      if (key === "when") {
        const when = value as WhenToDo;

        if (when === "custom") {
          return { ...prev, when, date: addDays(2) };
        }

        return { ...prev, when, date: undefined };
      }

      return { ...prev, [key]: value };
    });
  }

  function updateSubtask(index: number, value: string) {
    const updated = [...values.subtasks];
    updated[index] = value;
    setValues((prev) => ({ ...prev, subtasks: updated }));
  }

  function handleSubmit() {
    if (!validate()) return;

    onSubmit(values);
  }

  function goBack() {
    navigate(-1);
  }

  return (
    <div className="w-full max-w-lg space-y-6 rounded-md bg-card p-6 shadow relative">
      <div className="flex flex-col gap-1 items-center">
        <Undo2
          className="absolute left-6 top-6 cursor-pointer"
          onClick={goBack}
        />

        <h1 className="text-heading-lg font-bold text-high-contrast">
          {title}
        </h1>

        <p className="text-body text-muted">{subtitle}</p>
      </div>

      {/* Título */}
      <TextInput
        label="O que você quer realizar?"
        placeholder="Ex: Estudar matemática"
        value={values.title}
        error={errors.title}
        onChange={(e) => update("title", e.target.value)}
      />

      {/* Subtarefas */}
      <div className="flex flex-col gap-2">
        <span className="text-body-lg text-high-contrast font-bold mb-1">
          Sub-tarefas (máximo 3)
        </span>

        {values.subtasks.map((subtask, i) => (
          <SubtaskInput
            key={i}
            disabledCheckbox
            value={subtask}
            placeholder={`Passo ${i + 1}...`}
            onChange={(val) => updateSubtask(i, val)}
          />
        ))}
      </div>

      {/* Energia */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-lg text-high-contrast font-bold">
            Nível de energia necessário
          </span>

          <span className="text-muted text-body-sm">
            Quanto de esforço essa tarefa pede de você agora?
          </span>
        </div>

        <div className="flex gap-2">
          <SelectButton
            selected={values.energy === "low"}
            onClick={() => update("energy", "low")}
          >
            Baixa
          </SelectButton>

          <SelectButton
            selected={values.energy === "medium"}
            onClick={() => update("energy", "medium")}
          >
            Média
          </SelectButton>

          <SelectButton
            selected={values.energy === "high"}
            onClick={() => update("energy", "high")}
          >
            Alta
          </SelectButton>
        </div>
      </div>

      {/* Quando */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-lg text-high-contrast font-bold">
            Quando realizar?
          </span>

          <span className="text-muted text-body-sm">
            Defina uma data para manter o foco.
          </span>
        </div>

        <div className="flex gap-2">
          <SelectButton
            selected={values.when === "today"}
            onClick={() => update("when", "today")}
          >
            Hoje
          </SelectButton>

          <SelectButton
            selected={values.when === "tomorrow"}
            onClick={() => update("when", "tomorrow")}
          >
            Amanhã
          </SelectButton>

          <SelectButton
            selected={values.when === "custom"}
            onClick={() => update("when", "custom")}
          >
            <span className="flex gap-2 items-center">
              <Calendar className="h-5 w-5" />
              Outra data
            </span>
          </SelectButton>
        </div>

        {values.when === "custom" && (
          <InputDatePicker
            value={values.date}
            onChange={(date) => update("date", date)}
            disabled={{ before: addDays(2) }}
          />
        )}
      </div>

      {/* Duração */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-lg text-high-contrast font-bold">
            Duração de cada bloco de foco
          </span>

          <span className="text-muted text-body-sm">
            Escolha quanto tempo você quer manter o foco sem interrupções.
          </span>
        </div>

        <div className="flex gap-2">
          {[15, 30, 45, 60].map((duration) => (
            <SelectButton
              key={duration}
              selected={values.focusDuration === duration}
              onClick={() => update("focusDuration", duration as FocusDuration)}
            >
              {duration}m
            </SelectButton>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <BaseButton
          className="w-full text-white! cursor-pointer"
          type="submit"
          loading={isLoading}
          onClick={handleSubmit}
        >
          <CircleCheck />
          {submitLabel}
        </BaseButton>

        <BaseButton
          className="w-full text-muted-foreground cursor-pointer"
          type="button"
          variant="ghost"
          onClick={goBack}
        >
          Cancelar
        </BaseButton>
      </div>
    </div>
  );
}
