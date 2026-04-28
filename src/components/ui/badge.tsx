import { cn } from "@/lib/utils";
import type { ReservationStatus } from "@prisma/client";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "muted";

const variantStyles: Record<Variant, string> = {
  default: "bg-primary/10 text-primary ring-primary/20",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  muted: "bg-muted text-muted-foreground ring-border",
};

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn("badge", variantStyles[variant], className)}>{children}</span>;
}

const STATUS_MAP: Record<ReservationStatus, { variant: Variant; label: string }> = {
  PENDING: { variant: "warning", label: "Pendiente" },
  CONFIRMED: { variant: "info", label: "Confirmada" },
  CANCELLED: { variant: "danger", label: "Cancelada" },
  ATTENDED: { variant: "success", label: "Atendida" },
  NO_SHOW: { variant: "muted", label: "No-show" },
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const cfg = STATUS_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
