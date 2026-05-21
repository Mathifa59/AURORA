"use client";

import { formatDate, formatMoney, formatTime } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Phone,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "ATTENDED"
  | "NO_SHOW";

interface MyReservation {
  id: string;
  startsAt: string;
  endsAt: string;
  status: ReservationStatus;
  notes: string | null;
  service: { name: string; color: string; durationMinutes: number; priceCents: number };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING:   "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  ATTENDED:  "Atendida",
  NO_SHOW:   "No se presentó",
};

const STATUS_STYLE: Record<ReservationStatus, string> = {
  PENDING:   "bg-amber-50  text-amber-700  ring-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50    text-red-700    ring-red-200",
  ATTENDED:  "bg-blue-50   text-blue-700   ring-blue-200",
  NO_SHOW:   "bg-gray-50   text-gray-600   ring-gray-200",
};

function canCancel(status: ReservationStatus, startsAt: string) {
  if (status !== "PENDING" && status !== "CONFIRMED") return false;
  return new Date(startsAt) > new Date();
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function ReservationLookup() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [reservations, setReservations] = useState<MyReservation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError(null);
    setReservations(null);
    try {
      const res = await fetch(
        `/api/mis-reservas?phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al buscar.");
      setReservations(data.reservations);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    setCancelling(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "No se pudo cancelar.");
      }
      setReservations((prev) =>
        prev?.map((r) =>
          r.id === id ? { ...r, status: "CANCELLED" as ReservationStatus } : r
        ) ?? null
      );
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCancelling(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Search form */}
      <form onSubmit={handleSearch} className="card p-6 space-y-4">
        <div>
          <label htmlFor="phone" className="label">
            Número de teléfono
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+52 55 1234 5678"
              className="input pl-9"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Usa el mismo número con el que hiciste tu reserva.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !phone.trim()}
          className="btn-primary w-full h-10 gap-2 text-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {loading ? "Buscando…" : "Buscar mis reservas"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {reservations !== null && (
        <div className="space-y-3">
          {reservations.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-muted-foreground text-sm">
                No encontramos reservas para ese número.
              </p>
              <a href="/book" className="mt-4 inline-block btn-primary text-sm h-9 px-5">
                Hacer una reserva
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {reservations.length} reserva{reservations.length !== 1 ? "s" : ""} encontrada{reservations.length !== 1 ? "s" : ""}
              </p>
              {reservations.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  cancelling={cancelling === r.id}
                  onCancel={() => handleCancel(r.id)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ReservationCard                                                      */
/* ------------------------------------------------------------------ */

function ReservationCard({
  reservation: r,
  cancelling,
  onCancel,
}: {
  reservation: MyReservation;
  cancelling: boolean;
  onCancel: () => void;
}) {
  const isPast = new Date(r.startsAt) < new Date();
  const showCancel = canCancel(r.status, r.startsAt);

  return (
    <div className={`card p-5 space-y-4 ${isPast ? "opacity-70" : ""}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-10 w-10 rounded-lg shrink-0"
            style={{ backgroundColor: r.service.color + "33" }}
          >
            <div
              className="h-full w-full rounded-lg flex items-center justify-center"
              style={{ color: r.service.color }}
            >
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{r.service.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatMoney(r.service.priceCents, "MXN", "es-MX")}
              {" · "}
              {r.service.durationMinutes} min
            </p>
          </div>
        </div>
        <span className={`badge ring-1 shrink-0 ${STATUS_STYLE[r.status]}`}>
          {r.status === "CONFIRMED" && <CheckCircle2 className="h-3 w-3 mr-1" />}
          {r.status === "CANCELLED" && <XCircle className="h-3 w-3 mr-1" />}
          {STATUS_LABEL[r.status]}
        </span>
      </div>

      {/* Date & time */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {formatDate(new Date(r.startsAt), "es-MX")}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          {formatTime(new Date(r.startsAt))} – {formatTime(new Date(r.endsAt))}
        </div>
      </div>

      {/* Notes */}
      {r.notes && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
          {r.notes}
        </p>
      )}

      {/* Cancel */}
      {showCancel && (
        <button
          onClick={onCancel}
          disabled={cancelling}
          className="w-full btn-ghost text-sm h-9 gap-2 text-destructive hover:bg-destructive/10"
        >
          {cancelling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {cancelling ? "Cancelando…" : "Cancelar reserva"}
        </button>
      )}
    </div>
  );
}
