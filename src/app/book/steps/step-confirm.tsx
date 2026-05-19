import { Button } from "@/components/ui/button";
import { formatDateTime, formatMoney } from "@/lib/utils";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

interface Props {
  serviceName: string;
  serviceColor: string;
  startsAt: string;
  durationMinutes: number;
  priceCents: number;
  customerName: string;
  currency: string;
  locale: string;
  onReset: () => void;
}

export function StepConfirm({
  serviceName,
  serviceColor,
  startsAt,
  durationMinutes,
  priceCents,
  customerName,
  currency,
  locale,
  onReset,
}: Props) {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
      </div>

      <h2 className="mt-4 text-2xl font-semibold">¡Reserva confirmada!</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Nos vemos pronto, <span className="font-medium text-foreground">{customerName}</span>.
      </p>

      {/* Summary card */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl shrink-0"
            style={{ backgroundColor: serviceColor }}
          />
          <div>
            <p className="font-semibold">{serviceName}</p>
            {priceCents > 0 && (
              <p className="text-xs text-muted-foreground">
                {formatMoney(priceCents, currency, locale)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDateTime(new Date(startsAt), locale)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{durationMinutes} minutos</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button onClick={onReset} variant="secondary" className="w-full">
          Hacer otra reserva
        </Button>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
