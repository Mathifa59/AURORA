"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const DAYS_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

interface Props {
  onPick: (date: string) => void;
  loading: boolean;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getDaysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

// Monday-start offset
function firstDayOffset(d: Date) {
  const day = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function StepDate({ onPick, loading }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [month, setMonth] = useState(startOfMonth(today));
  const [selected, setSelected] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(month);
  const offset = firstDayOffset(month);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);

  function prevMonth() {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function nextMonth() {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  function pick(day: number) {
    const d = new Date(month.getFullYear(), month.getMonth(), day);
    if (d < today || d > maxDate) return;
    const iso = isoDate(d);
    setSelected(iso);
    onPick(iso);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">¿Qué día te viene bien?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Selecciona una fecha disponible.</p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 max-w-sm">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="btn-ghost h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold capitalize">
            {MONTHS_ES[month.getMonth()]} {month.getFullYear()}
          </span>
          <button onClick={nextMonth} className="btn-ghost h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_ES.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const d = new Date(month.getFullYear(), month.getMonth(), day);
            const iso = isoDate(d);
            const isPast = d < today;
            const isFuture = d > maxDate;
            const isDisabled = isPast || isFuture;
            const isSelected = selected === iso;
            const isToday = iso === isoDate(today);
            return (
              <button
                key={day}
                onClick={() => pick(day)}
                disabled={isDisabled || loading}
                className={cn(
                  "h-8 w-full rounded-lg text-sm transition-all",
                  isSelected && "bg-primary text-primary-foreground font-semibold",
                  !isSelected && isToday && "border border-primary text-primary font-semibold",
                  !isSelected && !isDisabled && "hover:bg-accent",
                  isDisabled && "opacity-30 cursor-not-allowed"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          Buscando horarios disponibles...
        </p>
      )}
    </div>
  );
}
