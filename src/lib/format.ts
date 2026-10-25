const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateTimeFormatter.format(date);
}

export function formatPeso(value: number): string {
  return pesoFormatter.format(value);
}

/** "Nov 5, 2:30 PM" — used in dense lists. */
export function formatBookingSlot(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatSchedule(dates: string[]): string {
  if (dates.length === 0) return "—";
  const [first, ...rest] = dates;
  const firstLabel = formatBookingSlot(first);
  return rest.length > 0 ? `${firstLabel} +${rest.length}` : firstLabel;
}

/** Converts an ISO string to the value a <input type="datetime-local"> expects. */
export function toDateTimeLocal(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

/** Converts a <input type="datetime-local"> value to a timezone-aware ISO string. */
export function fromDateTimeLocal(value: string): string {
  return new Date(value).toISOString();
}

export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}
