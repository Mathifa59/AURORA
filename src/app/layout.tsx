import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Bistro Aurora — Cocina de autor · Ciudad de México",
    template: "%s · Bistro Aurora",
  },
  description:
    "Restaurante de cocina de autor en el corazón de la Ciudad de México. Reserva tu mesa en línea — confirmación inmediata, sin cargos.",
  keywords: [
    "restaurante CDMX",
    "cocina de autor",
    "reservar mesa",
    "Bistro Aurora",
    "restaurante Reforma",
    "cena romántica CDMX",
  ],
  authors: [{ name: "Bistro Aurora" }],
  creator: "Bistro Aurora",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: APP_URL,
    siteName: "Bistro Aurora",
    title: "Bistro Aurora — Cocina de autor · Ciudad de México",
    description:
      "Una experiencia gastronómica donde la cocina de autor se encuentra con los sabores más profundos de México. Reserva tu mesa hoy.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bistro Aurora — Restaurante de cocina de autor en CDMX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bistro Aurora — Cocina de autor · Ciudad de México",
    description:
      "Reserva tu mesa en Bistro Aurora. Confirmación inmediata, sin cargos.",
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
