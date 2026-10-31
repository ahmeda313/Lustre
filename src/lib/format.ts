import { brand } from "@/config/brand";

const numberFormatter = new Intl.NumberFormat(brand.locale, {
  maximumFractionDigits: 0,
});

export function formatINR(value: number): string {
  return numberFormatter.format(Math.round(value));
}

export function formatDateLabel(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function maxDateISO(daysAhead: number): string {
  const now = new Date();
  now.setDate(now.getDate() + daysAhead);
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function normalisePhone(value: string): string {
  return value.replace(/[\s()-]/g, "").replace(/^\+91/, "").replace(/^0/, "");
}
