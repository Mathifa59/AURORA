import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const slug = process.env.DEFAULT_BUSINESS_SLUG || "demo";

  // Wipe demo tenant for idempotency
  const existing = await prisma.business.findUnique({ where: { slug } });
  if (existing) {
    console.log(`Cleaning up existing demo business "${slug}"...`);
    await prisma.business.delete({ where: { slug } });
  }

  const business = await prisma.business.create({
    data: {
      slug,
      name: "Bistro Aurora",
      description: "Restaurante de cocina de autor",
      timezone: "America/Mexico_City",
      locale: "es-MX",
      currency: "MXN",
      phone: "+52 55 5555 5555",
      email: "hola@bistroaurora.mx",
      address: "Av. Reforma 123, CDMX",
      brandColor: "#6366f1",
    },
  });

  console.log(`Created business: ${business.name} (${business.id})`);

  // Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "Cena para 2",
        description: "Mesa para dos en horario de cena",
        durationMinutes: 90,
        capacity: 6, // 6 mesas simultáneas
        priceCents: 0,
        color: "#6366f1",
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "Cena para 4",
        description: "Mesa para cuatro personas",
        durationMinutes: 120,
        capacity: 4,
        priceCents: 0,
        color: "#8b5cf6",
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "Brunch dominical",
        description: "Buffet de brunch los domingos",
        durationMinutes: 90,
        capacity: 12,
        priceCents: 65000,
        color: "#ec4899",
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "Degustación del chef",
        description: "Menú de 7 tiempos · cupos limitados",
        durationMinutes: 150,
        capacity: 2,
        priceCents: 180000,
        color: "#f59e0b",
      },
    }),
  ]);

  console.log(`Created ${services.length} services.`);

  // Availability — Tue–Sun, two shifts (lunch & dinner)
  const rules = [];
  for (let day = 0; day < 7; day++) {
    if (day === 1) continue; // closed Mondays
    rules.push(
      prisma.availabilityRule.create({
        data: {
          businessId: business.id,
          dayOfWeek: day,
          startTime: "13:00",
          endTime: "16:00",
        },
      }),
      prisma.availabilityRule.create({
        data: {
          businessId: business.id,
          dayOfWeek: day,
          startTime: "19:00",
          endTime: "23:00",
        },
      })
    );
  }
  await Promise.all(rules);
  console.log(`Created ${rules.length} availability rules.`);

  // Sample reservations across the next few days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sampleCustomers = [
    { name: "María López", phone: "5215512345678", email: "maria@example.com" },
    { name: "Juan Pérez", phone: "5215587654321", email: "juan@example.com" },
    { name: "Ana García", phone: "5215555512345" },
    { name: "Carlos Ruiz", phone: "5215544455666" },
    { name: "Sofía Méndez", phone: "5215566677788" },
  ];

  const customers = await Promise.all(
    sampleCustomers.map((c) =>
      prisma.customer.create({ data: { businessId: business.id, ...c } })
    )
  );

  const sampleReservations = [
    { dayOffset: 0, hour: 20, minute: 0, serviceIdx: 0, customerIdx: 0, status: "CONFIRMED" as const, partySize: 2 },
    { dayOffset: 0, hour: 21, minute: 0, serviceIdx: 1, customerIdx: 1, status: "PENDING" as const, partySize: 4 },
    { dayOffset: 1, hour: 14, minute: 0, serviceIdx: 0, customerIdx: 2, status: "CONFIRMED" as const, partySize: 2 },
    { dayOffset: 2, hour: 20, minute: 30, serviceIdx: 3, customerIdx: 3, status: "CONFIRMED" as const, partySize: 2 },
    { dayOffset: 3, hour: 19, minute: 30, serviceIdx: 0, customerIdx: 4, status: "PENDING" as const, partySize: 2 },
    { dayOffset: -1, hour: 20, minute: 0, serviceIdx: 1, customerIdx: 0, status: "ATTENDED" as const, partySize: 4 },
  ];

  for (const r of sampleReservations) {
    const start = new Date(today);
    start.setDate(start.getDate() + r.dayOffset);
    start.setHours(r.hour, r.minute, 0, 0);
    const service = services[r.serviceIdx];
    const end = new Date(start.getTime() + service.durationMinutes * 60_000);
    const customer = customers[r.customerIdx];
    await prisma.reservation.create({
      data: {
        businessId: business.id,
        serviceId: service.id,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        startsAt: start,
        endsAt: end,
        partySize: r.partySize,
        status: r.status,
        source: "WEB",
      },
    });
  }

  console.log(`Created ${sampleReservations.length} sample reservations.`);
  console.log("\n✅ Seed complete.\n");
  console.log("Open http://localhost:3000 and click the chat bubble to talk to the agent.");
  console.log("Admin panel: http://localhost:3000/admin/dashboard\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
