import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(cents: number, currency = "MXN", locale = "es-MX") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatTime(date: Date, locale = "es-MX") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDate(date: Date, locale = "es-MX") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatDateTime(date: Date, locale = "es-MX") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/** "09:30" -> 570 */
export function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** 570 -> "09:30" */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Combine a date (YYYY-MM-DD) with a time (HH:mm) into a Date object. */
export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`);
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60_000);
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Parse a local datetime string (YYYY-MM-DDTHH:mm) as if it were in
 * `timeZone`, and return the equivalent UTC Date.
 *
 * Why: `new Date("2026-04-29T20:30")` is parsed in the server's local TZ,
 * which is wrong for a multi-tenant SaaS where each business has its own TZ.
 * This helper makes the tenant's timezone authoritative.
 */
export function zonedTimeToUtc(localStr: string, timeZone: string): Date {
  // 1) Treat the local string as if it were UTC — call this the "fake UTC".
  const normalized = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(localStr)
    ? localStr + ":00"
    : localStr;
  const fakeUtc = new Date(normalized + "Z");
  if (Number.isNaN(fakeUtc.getTime())) {
    throw new Error(`Invalid datetime string: "${localStr}"`);
  }

  // 2) Format that instant as wall-clock in the target timezone.
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(fakeUtc);
  const get = (type: string) => parseInt(parts.find((p) => p.type === type)!.value, 10);
  const hour = get("hour") % 24; // some locales render midnight as 24
  const tzAsUtcMs = Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute"), get("second"));

  // 3) The difference is exactly the timezone offset. Subtract it from fakeUtc
  //    to get the true UTC instant for "localStr in timeZone".
  const offset = tzAsUtcMs - fakeUtc.getTime();
  return new Date(fakeUtc.getTime() - offset);
}
