import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard Comercial | Dr. Luis Eduardo Barbosa",
  description: "Monitoramento em tempo real do fluxo comercial e conversão de leads (Kommo CRM)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#0B0F19] text-slate-100">{children}</body>
    </html>
  );
}
