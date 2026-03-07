export function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function formatDateIsoString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function getWhenFromDate(date: Date): "today" | "tomorrow" | "custom" {
  if (isToday(date)) return "today";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate();

  if (isTomorrow) return "tomorrow";

  return "custom";
}
