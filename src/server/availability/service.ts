import { prisma } from "@/lib/prisma";
import {
  addMinutes,
  combineDateAndTime,
  endOfDay,
  isoDate,
  minutesToTimeString,
  startOfDay,
  timeStringToMinutes,
} from "@/lib/utils";

export type Slot = {
  startsAt: Date;
  endsAt: Date;
  label: string; // "10:30"
};

/**
 * Compute available slots for a given service on a given date.
 *
 * Algorithm:
 *  1. Load active weekly rules for that day-of-week.
 *  2. For each rule, generate candidate slots stepped by service duration.
 *  3. Reject any candidate whose [start, end) interval would push the
 *     concurrent reservation count over the service capacity.
 *
 * This is O(rules * slots * reservations-of-day), fine for a single business.
 * For scale we'd index reservations by interval or use a tsrange GIST.
 */
export async function getAvailableSlots(params: {
  businessId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  partySize?: number;
}): Promise<Slot[]> {
  const { businessId, serviceId, date, partySize = 1 } = params;

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId, active: true },
  });
  if (!service) return [];

  const day = new Date(`${date}T00:00:00`);
  const dayOfWeek = day.getDay();

  const rules = await prisma.availabilityRule.findMany({
    where: { businessId, dayOfWeek, active: true },
    orderBy: { startTime: "asc" },
  });
  if (rules.length === 0) return [];

  const reservations = await prisma.reservation.findMany({
    where: {
      businessId,
      serviceId,
      status: { in: ["PENDING", "CONFIRMED", "ATTENDED"] },
      startsAt: { gte: startOfDay(day), lte: endOfDay(day) },
    },
    select: { startsAt: true, endsAt: true, partySize: true },
  });

  const duration = service.durationMinutes;
  const capacity = service.capacity;
  const slots: Slot[] = [];
  const now = new Date();

  for (const rule of rules) {
    const start = timeStringToMinutes(rule.startTime);
    const end = timeStringToMinutes(rule.endTime);

    for (let t = start; t + duration <= end; t += duration) {
      const slotStart = combineDateAndTime(date, minutesToTimeString(t));
      const slotEnd = addMinutes(slotStart, duration);

      // Don't suggest past slots
      if (slotEnd <= now) continue;

      // Concurrent capacity check
      const overlapping = reservations.filter(
        (r) => r.startsAt < slotEnd && r.endsAt > slotStart
      );
      const used = overlapping.reduce((acc, r) => acc + r.partySize, 0);
      if (used + partySize > capacity) continue;

      slots.push({
        startsAt: slotStart,
        endsAt: slotEnd,
        label: minutesToTimeString(t),
      });
    }
  }

  return slots;
}

/**
 * Check whether a specific [startsAt, endsAt) is bookable for the service.
 * Used by createReservation to enforce no-overbooking at write time.
 */
export async function isSlotAvailable(params: {
  businessId: string;
  serviceId: string;
  startsAt: Date;
  endsAt: Date;
  partySize: number;
}): Promise<boolean> {
  const { businessId, serviceId, startsAt, endsAt, partySize } = params;

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId, active: true },
  });
  if (!service) return false;

  // Must fall inside an active opening rule
  const dayOfWeek = startsAt.getDay();
  const startMin = startsAt.getHours() * 60 + startsAt.getMinutes();
  const endMin = endsAt.getHours() * 60 + endsAt.getMinutes();

  const rules = await prisma.availabilityRule.findMany({
    where: { businessId, dayOfWeek, active: true },
  });
  const insideOpening = rules.some(
    (r) => startMin >= timeStringToMinutes(r.startTime) && endMin <= timeStringToMinutes(r.endTime)
  );
  if (!insideOpening) return false;

  const overlapping = await prisma.reservation.findMany({
    where: {
      businessId,
      serviceId,
      status: { in: ["PENDING", "CONFIRMED", "ATTENDED"] },
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
    select: { partySize: true },
  });
  const used = overlapping.reduce((acc, r) => acc + r.partySize, 0);
  return used + partySize <= service.capacity;
}

/**
 * Suggest the next N available slots starting from `fromDate`,
 * scanning up to `daysAhead` days. Used by the AI agent when a
 * specific time isn't given.
 */
export async function suggestNextSlots(params: {
  businessId: string;
  serviceId: string;
  fromDate?: Date;
  count?: number;
  daysAhead?: number;
}): Promise<Slot[]> {
  const { businessId, serviceId, fromDate = new Date(), count = 5, daysAhead = 14 } = params;
  const out: Slot[] = [];

  for (let i = 0; i < daysAhead && out.length < count; i++) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + i);
    const slots = await getAvailableSlots({
      businessId,
      serviceId,
      date: isoDate(d),
    });
    out.push(...slots.slice(0, count - out.length));
  }
  return out;
}
