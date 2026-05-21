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

  const isPrevDisabled =
    month.getFullYear() === today.getFullYear() &&
    month.getMonth() === today.getMonth();

  function prevMonth() {
    if (isPrevDisabled) return;
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
      <p className="mt-1 text-sm text-muted-foreground">
        Selecciona una fecha disponible.
      </p>

      {/* Calendario — full width en móvil, max-sm en escritorio */}
      <div className="mt-6 w-full rounded-2xl border border-border bg-card p-4 sm:max-w-sm sm:p-5">

        {/* Navegación de mes */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prevMonth}
            disabled={isPrevDisabled}
            className="btn-ghost h-9 w-9 p-0 disabled:opacity-30"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold capitalize">
            {MONTHS_ES[month.getMonth()]} {month.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="btn-ghost h-9 w-9 p-0"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Cabecera días */}
        <div className="mb-1 grid grid-cols-7">
          {DAYS_ES.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
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
                aria-label={iso}
                className={cn(
                  "aspect-square w-full rounded-lg text-sm font-medium transition-all",
                  "min-h-[2.25rem]", // garantiza área táctil mínima de 36px
                  isSelected &&
                    "bg-primary text-primary-foreground shadow-sm",
                  !isSelected &&
                    isToday &&
                    "border-2 border-primary text-primary",
                  !isSelected &&
                    !isDisabled &&
                    !isToday &&
                    "hover:bg-accent text-foreground",
                  isDisabled && "cursor-not-allowed text-muted-foreground/40"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Buscando horarios disponibles…
        </p>
      )}
    </div>
  );
}
