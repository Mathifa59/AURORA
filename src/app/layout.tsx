import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Reservalo — Tu recepcionista virtual con IA",
    template: "%s — Reservalo",
  },
  description:
    "Sistema de reservas con agente IA conversacional. Gestiona citas 24/7, sin sobrebooking y sin fricciones. Perfecto para restaurantes, salones, consultorios y más.",
  keywords: [
    "reservas online",
    "agente IA",
    "sistema de citas",
    "recepcionista virtual",
    "reservas inteligentes",
  ],
  authors: [{ name: "Reservalo" }],
  creator: "Reservalo",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: APP_URL,
    siteName: "Reservalo",
    title: "Reservalo — Tu recepcionista virtual con IA",
    description:
      "Agente IA que conversa con tus clientes, valida disponibilidad y agenda citas — sin sobrebooking, sin fricciones.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Reservalo — Sistema de reservas con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reservalo — Tu recepcionista virtual con IA",
    description:
      "Agente IA que conversa con tus clientes, valida disponibilidad y agenda citas — sin sobrebooking, sin fricciones.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  );
}
