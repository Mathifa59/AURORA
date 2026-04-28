"use client";

import { cn } from "@/lib/utils";
import type { ReservationStatus } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  color: string;
  startsAt: string;
  endsAt: string;
  status: ReservationStatus;
  phone: string | null;
};

const HOUR_HEIGHT = 56; // px per hour
const DAY_START = 7; // 7am
const DAY_END = 22; // 10pm

const DAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function CalendarView({
  weekStart,
  events,
  locale,
}: {
  weekStart: string;
  events: Event[];
  locale: string;
}) {
  const router = useRouter();
  const start = new Date(weekStart);

  function nav(deltaDays: number) {
    const d = new Date(start);
    d.setDate(d.getDate() + deltaDays);
    router.push(`/admin/calendar?week=${d.toISOString().slice(0, 10)}`);
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i);

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(days[3]);

  return (
    <div className="card-elevated overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => nav(-7)}
            className="btn-ghost h-8 w-8 p-0"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push(`/admin/calendar?week=${new Date().toISOString().slice(0, 10)}`)}
            className="btn-secondary h-8 px-3 text-xs"
          >
            Hoy
          </button>
          <button onClick={() => nav(7)} className="btn-ghost h-8 w-8 p-0" aria-label="Semana siguiente">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-sm font-semibold capitalize">{monthLabel}</h2>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <Legend dot="#10b981" label="Confirmada" />
          <Legend dot="#f59e0b" label="Pendiente" />
        </div>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] border-b border-border bg-muted/20">
        <div />
        {days.map((d, i) => {
          const isToday = isSameDay(d, new Date());
          return (
            <div
              key={i}
              className={cn(
                "px-2 py-2 text-center border-l border-border",
                isToday && "bg-primary/5"
              )}
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {DAYS_ES[i]}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-lg font-semibold",
                  isToday && "text-primary"
                )}
              >
                {d.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="relative grid grid-cols-[60px_repeat(7,minmax(0,1fr))]">
        {/* Hours column */}
        <div>
          {hours.map((h) => (
            <div
              key={h}
              style={{ height: HOUR_HEIGHT }}
              className="border-b border-border/60 px-2 text-right text-[10px] text-muted-foreground -translate-y-2"
            >
              {h.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((d, dayIdx) => {
          const dayEvents = events.filter((e) => isSameDay(new Date(e.startsAt), d));
          return (
            <div
              key={dayIdx}
              className="relative border-l border-border"
              style={{ height: hours.length * HOUR_HEIGHT }}
            >
              {/* hour grid lines */}
              {hours.map((h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 border-b border-border/40"
                  style={{ top: (h - DAY_START) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                />
              ))}

              {/* events */}
              {dayEvents.map((e) => {
                const start = new Date(e.startsAt);
                const end = new Date(e.endsAt);
                const top =
                  (start.getHours() - DAY_START) * HOUR_HEIGHT +
                  (start.getMinutes() / 60) * HOUR_HEIGHT;
                const height = Math.max(
                  24,
                  ((end.getTime() - start.getTime()) / (60 * 60 * 1000)) * HOUR_HEIGHT
                );
                return (
                  <div
                    key={e.id}
                    className="absolute left-1 right-1 rounded-md px-2 py-1 text-[11px] text-white shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all overflow-hidden"
                    style={{
                      top,
                      height,
                      backgroundColor: e.color,
                      opacity: e.status === "PENDING" ? 0.85 : 1,
                    }}
                    title={`${e.title} (${e.phone ?? "sin tel"})`}
                  >
                    <p className="font-semibold truncate">{formatHM(start)}</p>
                    <p className="truncate opacity-90">{e.title}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatHM(d: Date) {
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
      {label}
    </span>
  );
}
