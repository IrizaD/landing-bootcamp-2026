import type { Metadata } from "next";
import { Outfit, Poppins } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-head",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bootcamp de Aceleración de Emprendimiento 2026 — Sinergéticos",
  description:
    "3 días en vivo con más de 20 speakers internacionales. 100% gratis. La fórmula, la mentalidad y el ecosistema para llevar tu negocio al siguiente nivel. 5, 6 y 7 de Junio de 2026.",
  openGraph: {
    title: "Bootcamp de Aceleración de Emprendimiento 2026",
    description:
      "3 días en vivo con más de 20 speakers internacionales. 100% gratis. 5, 6 y 7 de Junio de 2026.",
    siteName: "Sinergéticos",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${outfit.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
