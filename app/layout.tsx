import type { Metadata, Viewport } from "next";
import { Orbitron, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DJ KPO | Frequency Control - Techno / Industrial / Underground",
  description:
    "DJ KPO - Produtor e DJ de Techno, Industrial e Underground. Reserve agora para seu evento e sinta a energia do som que domina as pistas.",
  keywords: [
    "DJ",
    "KPO",
    "Techno",
    "Industrial",
    "Underground",
    "Rave",
    "Festa",
    "Evento",
    "Música Eletrônica",
  ],
  authors: [{ name: "DJ KPO" }],
  openGraph: {
    title: "DJ KPO | Frequency Control",
    description: "Techno / Industrial / Underground",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#00ff00",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=0.8, viewport-fit=cover"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="email=no" />
      </head>
      <body
        className={`${orbitron.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
