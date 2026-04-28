"use client";

import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import type { ReservationStatus } from "@prisma/client";
import { Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Row = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  serviceName: string;
  serviceColor: string;
  startsAt: string;
  endsAt: string;
  partySize: number;
  status: ReservationStatus;
  source: string;
};

const FILTERS: Array<{ key: ReservationStatus | "ALL"; label: string }> = [
  { key: "ALL", label: "Todas" },
  { key: "PENDING", label: "Pendientes" },
  { key: "CONFIRMED", label: "Confirmadas" },
  { key: "ATTENDED", label: "Atendidas" },
  { key: "CANCELLED", label: "Canceladas" },
  { key: "NO_SHOW", label: "No-show" },
];

export function ReservationsTable({
  initialReservations,
  locale,
}: {
  initialReservations: Row[];
  locale: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<ReservationStatus | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return initialReservations.filter((r) => {
      if (filter !== "ALL" && r.status !== filter) return false;
      if (q && !`${r.customerName} ${r.customerPhone ?? ""} ${r.serviceName}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [initialReservations, filter, q]);

  async function setStatus(id: string, status: ReservationStatus) {
    setBusyId(id);
    try {
      await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por cliente, teléfono o servicio..."
            className="input pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-4 w-4 text-muted-foreground mr-1" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Servicio</th>
                <th className="px-5 py-3 font-medium">Fecha y hora</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Origen</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 shrink-0 rounded-md flex items-center justify-center text-white font-semibold text-xs"
                        style={{ backgroundColor: r.serviceColor }}
                      >
                        {r.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{r.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.customerPhone ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: r.serviceColor }}
                      />
                      {r.serviceName}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {formatDateTime(new Date(r.startsAt), locale)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {r.source === "AI_AGENT" ? "🤖 IA" : r.source.toLowerCase()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      {r.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="primary"
                          loading={busyId === r.id}
                          onClick={() => setStatus(r.id, "CONFIRMED")}
                        >
                          Confirmar
                        </Button>
                      )}
                      {(r.status === "CONFIRMED" || r.status === "PENDING") && (
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={busyId === r.id}
                          onClick={() => setStatus(r.id, "ATTENDED")}
                        >
                          Atendida
                        </Button>
                      )}
                      {r.status !== "CANCELLED" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={busyId === r.id}
                          onClick={() => setStatus(r.id, "CANCELLED")}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">
                    No hay reservas que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
