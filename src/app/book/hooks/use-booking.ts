"use client";

import { useCallback, useState } from "react";

export type BookingStep = "service" | "datetime" | "slot" | "form" | "confirm";

export type SlotOption = {
  label: string;       // "20:30"
  startsAt: string;    // ISO string
  endsAt: string;
};

export type ServiceOption = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
  color: string;
  capacity: number;
};

export type BookingState = {
  step: BookingStep;
  service: ServiceOption | null;
  date: string | null;       // YYYY-MM-DD
  slot: SlotOption | null;
  slots: SlotOption[];
  slotsLoading: boolean;
  submitLoading: boolean;
  reservationId: string | null;
  customerName: string | null;
  error: string | null;
};

const INITIAL: BookingState = {
  step: "service",
  service: null,
  date: null,
  slot: null,
  slots: [],
  slotsLoading: false,
  submitLoading: false,
  reservationId: null,
  customerName: null,
  error: null,
};

export function useBooking() {
  const [state, setState] = useState<BookingState>(INITIAL);

  const update = useCallback(
    (patch: Partial<BookingState>) => setState((s) => ({ ...s, ...patch })),
    []
  );

  function pickService(service: ServiceOption) {
    update({ service, step: "datetime", date: null, slot: null, slots: [], error: null });
  }

  async function pickDate(date: string) {
    if (!state.service) return;
    update({ date, slotsLoading: true, slots: [], slot: null, error: null });
    try {
      const res = await fetch(
        `/api/availability?serviceId=${state.service.id}&date=${date}`
      );
      const data = await res.json();
      const slots: SlotOption[] = (data.slots ?? []).map((s: any) => ({
        label: s.label,
        startsAt: s.startsAt,
        endsAt: s.endsAt,
      }));
      update({ slots, slotsLoading: false, step: "slot" });
    } catch {
      update({ slotsLoading: false, error: "Error al cargar horarios. Intenta de nuevo." });
    }
  }

  function pickSlot(slot: SlotOption) {
    update({ slot, step: "form", error: null });
  }

  async function submit(customer: { name: string; phone: string; email?: string; notes?: string }) {
    if (!state.service || !state.slot) return;
    update({ submitLoading: true, error: null });
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: state.service.id,
          startsAt: state.slot.startsAt,
          customer,
          notes: customer.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear la reserva.");
      update({ reservationId: data.reservation.id, customerName: customer.name, step: "confirm", submitLoading: false });
    } catch (e: any) {
      update({ submitLoading: false, error: e.message });
    }
  }

  function reset() {
    setState(INITIAL);
  }

  function back() {
    const prev: Record<BookingStep, BookingStep | null> = {
      service: null,
      datetime: "service",
      slot: "datetime",
      form: "slot",
      confirm: null,
    };
    const prevStep = prev[state.step];
    if (prevStep) update({ step: prevStep, error: null });
  }

  return { state, pickService, pickDate, pickSlot, submit, reset, back };
}
