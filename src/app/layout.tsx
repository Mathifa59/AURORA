import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reservalo — Reservas inteligentes con agente IA",
  description:
    "Plataforma de reservas con agente IA conversacional. Recepción 24/7, sin sobrebooking.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  );
}
