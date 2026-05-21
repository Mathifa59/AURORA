import { cn } from "@/lib/utils";
import type { SlotOption } from "../hooks/use-booking";
import { Clock } from "lucide-react";

interface Props {
  slots: SlotOption[];
  date: string;
  serviceName: string;
  onPick: (slot: SlotOption) => void;
}

export function StepSlot({ slots, date, serviceName, onPick }: Props) {
  const dateLabel = new Date(date + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (slots.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold">Sin disponibilidad</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No hay huecos libres para <span className="font-medium">{serviceName}</span> el{" "}
          <span className="font-medium capitalize">{dateLabel}</span>. Prueba otro día.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Elige un horario</h2>
      <p className="mt-1 text-sm text-muted-foreground capitalize">
        {serviceName} · {dateLabel}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => (
          <button
            key={slot.startsAt}
            onClick={() => onPick(slot)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl border border-border",
              "py-3.5 text-sm font-medium transition-all",
              "min-h-[3rem]", // mínimo 48px de altura para touch
              "hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-95"
            )}
          >
            <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
}
