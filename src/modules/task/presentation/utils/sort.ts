import type { EnergyLevel } from "@/shared/ui/store/cognitive-settings-store";
import type { Task } from "../../domain/entities/task";

export function sortTasksByEnergy(tasks: Task[], userEnergy: EnergyLevel) {
  const energyPriority: Record<EnergyLevel, EnergyLevel[]> = {
    high: ["high", "medium", "low"],
    medium: ["medium", "low", "high"],
    low: ["low", "medium", "high"],
  };

  const order = energyPriority[userEnergy];

  return [...tasks].sort(
    (a, b) => order.indexOf(a.energy) - order.indexOf(b.energy),
  );
}
