import { formatMoney } from "@/lib/utils";
import type { ServiceOption } from "../hooks/use-booking";
import { Clock, Users } from "lucide-react";

interface Props {
  services: ServiceOption[];
  onPick: (s: ServiceOption) => void;
  currency: string;
  locale: string;
}

export function StepService({ services, onPick, currency, locale }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold">¿Qué servicio necesitas?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Selecciona para ver disponibilidad.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => onPick(s)}
            className="group text-left rounded-2xl border-2 border-border bg-card p-5 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <div
              className="h-10 w-10 rounded-xl mb-4 flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: s.color }}
            >
              {s.name.charAt(0)}
            </div>
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {s.name}
            </h3>
            {s.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{s.description}</p>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {s.durationMinutes} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {s.capacity}
              </span>
              {s.priceCents > 0 && (
                <span className="ml-auto font-semibold text-foreground">
                  {formatMoney(s.priceCents, currency, locale)}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
