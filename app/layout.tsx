import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashboard Comercial | Dr. Luis Eduardo Barbosa",
  description: "Monitoramento em tempo real do fluxo comercial e conversao de leads (Kommo CRM)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased bg-[#090D16] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}