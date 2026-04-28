import { prisma } from "@/lib/prisma";

export async function listServices(businessId: string, opts: { onlyActive?: boolean } = {}) {
  return prisma.service.findMany({
    where: {
      businessId,
      ...(opts.onlyActive ? { active: true } : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function createService(input: {
  businessId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  capacity: number;
  priceCents: number;
  color?: string;
}) {
  return prisma.service.create({ data: input });
}

export async function updateService(input: {
  businessId: string;
  id: string;
  data: Partial<{
    name: string;
    description: string;
    durationMinutes: number;
    capacity: number;
    priceCents: number;
    color: string;
    active: boolean;
  }>;
}) {
  // Tenant-scoped update — never trust the id alone.
  const found = await prisma.service.findFirst({
    where: { id: input.id, businessId: input.businessId },
  });
  if (!found) throw new Error("Servicio no encontrado.");
  return prisma.service.update({ where: { id: input.id }, data: input.data });
}

export async function deleteService(input: { businessId: string; id: string }) {
  const found = await prisma.service.findFirst({
    where: { id: input.id, businessId: input.businessId },
  });
  if (!found) throw new Error("Servicio no encontrado.");
  // Soft-delete via active=false to preserve historical reservations.
  return prisma.service.update({ where: { id: input.id }, data: { active: false } });
}
