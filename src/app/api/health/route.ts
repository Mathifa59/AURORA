import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      db: "connected",
      latencyMs: Date.now() - start,
    });
  } catch (err: any) {
    const message: string = err?.message ?? "Unknown error";
    const isPaused =
      message.includes("ENOTFOUND") ||
      message.includes("tenant") ||
      message.includes("ECONNREFUSED");

    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
        hint: isPaused
          ? "Supabase project may be paused. Visit https://supabase.com/dashboard to restore it."
          : message,
      },
      { status: 503 }
    );
  }
}
