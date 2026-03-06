export function getEnergyLabel(energy: "high" | "medium" | "low") {
  const map = {
    high: "Alta",
    medium: "Média",
    low: "Baixa",
  };

  return map[energy];
}
