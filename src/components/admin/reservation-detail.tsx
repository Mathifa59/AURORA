"use client";

import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatMoney } from "@/lib/utils";
import type { ReservationStatus } from "@prisma/client";
import {
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  User,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type ReservationDetailData = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  serviceName: string;
  serviceColor: string;
  priceCents: number;
  durationMinutes: number;
  startsAt: string;
  endsAt: string;
  partySize: number;
  status: ReservationStatus;
  source: string;
  notes: string | null;
  currency: string;
  locale: string;
};

const STATUS_ACTIONS: Array<{ status: ReservationStatus; label: string; variant: "primary" | "secondary" | "ghost" }> = [
  { status: "CONFIRMED",  label: "Confirmar",  variant: "primary"   },
  { status: "ATTENDED",   label: "Atendida",   variant: "secondary" },
  { status: "NO_SHOW",    label: "No-show",    variant: "ghost"     },
  { status: "CANCELLED",  label: "Cancelar",   variant: "ghost"     },
];

export function ReservationDetail({
  data,
  onClose,
}: {
  data: ReservationDetailData;
  onClose: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<ReservationStatus | null>(null);

  async function setStatus(status: ReservationStatus) {
    setBusy(status);
    try {
      await fetch(`/api/reservations/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
      onClose();
    } finally {
      setBusy(null);
    }
  }

  const available = STATUS_ACTIONS.filter((a) => a.status !== data.status);

  return (
    <div className="p-6 space-y-6">
      {/* Service badge */}
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: data.serviceColor }}
        >
          {data.customerName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">{data.customerName}</p>
          <StatusBadge status={data.status} />
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-3">
        <InfoRow icon={Wrench}   label="Servicio"   value={data.serviceName} />
        <InfoRow icon={Calendar} label="Fecha"      value={formatDateTime(new Date(data.startsAt), data.locale)} />
        <InfoRow icon={Clock}    label="Duración"   value={`${data.durationMinutes} min · ${data.partySize} persona(s)`} />
        {data.customerPhone && (
          <InfoRow icon={Phone}  label="Teléfono"   value={data.customerPhone} />
        )}
        {data.customerEmail && (
          <InfoRow icon={Mail}   label="Email"      value={data.customerEmail} />
        )}
        {data.priceCents > 0 && (
          <InfoRow icon={Wrench} label="Precio"     value={formatMoney(data.priceCents, data.currency, data.locale)} />
        )}
        <InfoRow icon={MessageSquare} label="Origen" value={
          data.source === "AI_AGENT" ? "🤖 Agente IA"
          : data.source === "WHATSAPP" ? "💬 WhatsApp"
          : data.source.toLowerCase()
        } />
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Notas</p>
          <p>{data.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-border pt-4 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Cambiar estado
        </p>
        <div className="grid grid-cols-2 gap-2">
          {available.map((a) => (
            <Button
              key={a.status}
              variant={a.variant}
              size="sm"
              loading={busy === a.status}
              onClick={() => setStatus(a.status)}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
