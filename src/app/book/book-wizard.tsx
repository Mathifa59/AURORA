"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import type { ServiceOption } from "./hooks/use-booking";
import { useBooking } from "./hooks/use-booking";
import { StepConfirm } from "./steps/step-confirm";
import { StepDate } from "./steps/step-date";
import { StepForm } from "./steps/step-form";
import { StepService } from "./steps/step-service";
import { StepSlot } from "./steps/step-slot";

const STEP_LABELS: Record<string, string> = {
  service:  "Servicio",
  datetime: "Fecha",
  slot:     "Horario",
  form:     "Tus datos",
  confirm:  "Confirmación",
};

const STEP_ORDER = ["service", "datetime", "slot", "form", "confirm"] as const;

interface Props {
  services: ServiceOption[];
  currency: string;
  locale: string;
}

export function BookWizard({ services, currency, locale }: Props) {
  const { state, pickService, pickDate, pickSlot, submit, reset, back } = useBooking();

  const stepIdx = STEP_ORDER.indexOf(state.step);
  const showBack = stepIdx > 0 && state.step !== "confirm";

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-3">
          {showBack && (
            <button onClick={back} className="btn-ghost h-8 w-8 p-0 -ml-1">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {STEP_LABELS[state.step]}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {stepIdx + 1} / {STEP_ORDER.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((stepIdx + 1) / STEP_ORDER.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content — slide-in desde la derecha al avanzar */}
      <div key={state.step} className="animate-slide-in-right">
        {state.step === "service" && (
          <StepService
            services={services}
            onPick={pickService}
            currency={currency}
            locale={locale}
          />
        )}

        {state.step === "datetime" && (
          <StepDate onPick={pickDate} loading={state.slotsLoading} />
        )}

        {state.step === "slot" && state.service && state.date && (
          <StepSlot
            slots={state.slots}
            date={state.date}
            serviceName={state.service.name}
            onPick={pickSlot}
          />
        )}

        {state.step === "form" && (
          <StepForm
            loading={state.submitLoading}
            error={state.error}
            onSubmit={submit}
          />
        )}

        {state.step === "confirm" && state.service && state.slot && (
          <StepConfirm
            serviceName={state.service.name}
            serviceColor={state.service.color}
            startsAt={state.slot.startsAt}
            durationMinutes={state.service.durationMinutes}
            priceCents={state.service.priceCents}
            customerName={state.customerName ?? ""}
            currency={currency}
            locale={locale}
            onReset={reset}
          />
        )}
      </div>

      {/* Generic error (not on form step, which has its own) */}
      {state.error && state.step !== "form" && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </div>
      )}
    </div>
  );
}
