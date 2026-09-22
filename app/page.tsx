"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  RefreshCw,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/metrics?period=${period}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error loading metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/webhook/kommo`);
    }
  }, [period]);

  const copyWebhook = () => {
    if (navigator.clipboard && webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const metrics = data?.metrics || {};
  const funnel = data?.funnel || [];
  const leads = data?.recentLeads || [];

  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.specialist?.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "rescued") return matchesSearch && (lead.is_rescued || lead.status_id === 111394691);
    if (statusFilter === "scheduled") return matchesSearch && lead.status_id === 111396579;
    if (statusFilter === "completed") return matchesSearch && lead.status_id === 111396583;
    if (statusFilter === "lost") return matchesSearch && lead.status_id === 143;
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0A0E17] text-slate-100 p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Clínica Dr. Luis Eduardo Barbosa
                </h1>
                <p className="text-xs md:text-sm text-slate-400">
                  Dashboard de Desempenho Comercial &bull; Funil Upscale Unificado (Kommo CRM)
                </p>
              </div>
            </div>
          </div>

          {/* Period selector & Refresh */}
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setPeriod("today")}
                className={`px-3 py-1.5 rounded-md transition-all ${period === "today" ? "bg-emerald-600 text-white font-medium" : "text-slate-400 hover:text-white"}`}
              >
                Hoje
              </button>
              <button
                onClick={() => setPeriod("7d")}
                className={`px-3 py-1.5 rounded-md transition-all ${period === "7d" ? "bg-emerald-600 text-white font-medium" : "text-slate-400 hover:text-white"}`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setPeriod("30d")}
                className={`px-3 py-1.5 rounded-md transition-all ${period === "30d" ? "bg-emerald-600 text-white font-medium" : "text-slate-400 hover:text-white"}`}
              >
                30 Dias
              </button>
              <button
                onClick={() => setPeriod("all")}
                className={`px-3 py-1.5 rounded-md transition-all ${period === "all" ? "bg-emerald-600 text-white font-medium" : "text-slate-400 hover:text-white"}`}
              >
                Tudo
              </button>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
          </div>
        </header>

        {/* Webhook Endpoint Banner */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-300">URL do Webhook para o Kommo CRM:</p>
              <code className="text-xs text-slate-300 font-mono bg-black/40 px-2 py-0.5 rounded border border-slate-800 inline-block mt-0.5">
                {webhookUrl || "https://sua-url.vercel.app/api/webhook/kommo"}
              </code>
            </div>
          </div>
          <button
            onClick={copyWebhook}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition shadow shadow-emerald-600/30 self-start md:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado!" : "Copiar URL"}
          </button>
        </div>

        {/* KPI Cards Grid (5 Principais + Contato Futuro) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Leads Criados */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">1. Leads Criados</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.criados?.value ?? 0}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="text-blue-400 font-medium">Entrada</span> no funil
            </p>
          </div>

          {/* 2. Leads Resgatados */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">2. Resgatados</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.resgatados?.value ?? 0}
            </div>
            <p className="text-xs text-amber-400/90 mt-2 font-medium">
              {metrics.resgatados?.rate ?? "0%"}
            </p>
          </div>

          {/* 3. Consultas Agendadas */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">3. Agendadas</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.agendados?.value ?? 0}
            </div>
            <p className="text-xs text-purple-400/90 mt-2 font-medium">
              {metrics.agendados?.rate ?? "0%"}
            </p>
          </div>

          {/* 4. Consultas Realizadas */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">4. Realizadas</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.realizados?.value ?? 0}
            </div>
            <p className="text-xs text-emerald-400/90 mt-2 font-medium">
              {metrics.realizados?.rate ?? "0%"}
            </p>
          </div>

          {/* 5. Leads Perdidos */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-rose-500/40 transition">
            <div className="flex items-center justify-between text-rose-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">5. Perdidos</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.perdidos?.value ?? 0}
            </div>
            <p className="text-xs text-rose-400/90 mt-2 font-medium">
              {metrics.perdidos?.rate ?? "0%"}
            </p>
          </div>

          {/* 6. Contato Futuro */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contato Futuro</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.contato_futuro?.value ?? 0}
            </div>
            <p className="text-xs text-cyan-400/90 mt-2 font-medium">
              Aguardando retorno
            </p>
          </div>
        </section>

        {/* Funnel Progress Section */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Conversão do Funil de Atendimento às Consultas
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualização linear do volume e eficiência em cada estágio
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {funnel.map((item: any, idx: number) => {
              const baseCount = funnel[0]?.count || 1;
              const pctOfTotal = Math.round((item.count / baseCount) * 100);
              return (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">{item.step}</span>
                    <span className="text-xs font-semibold" style={{ color: item.color }}>{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(pctOfTotal, 100)}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-[10px] text-slate-400">{pctOfTotal}% do volume inicial</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Leads Table */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Leads Recentes do CRM
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Últimas movimentações processadas pelo Kommo CRM
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar lead ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos os Status</option>
                <option value="rescued">Resgatados</option>
                <option value="scheduled">Agendadas</option>
                <option value="completed">Realizadas</option>
                <option value="lost">Perdidos</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Lead / Paciente</th>
                  <th className="px-4 py-3">Status Atual</th>
                  <th className="px-4 py-3">Resgatado?</th>
                  <th className="px-4 py-3">Responsável</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      Nenhum lead encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead: any) => {
                    const isRescued = lead.is_rescued || lead.status_id === 111394691;
                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                        <td className="px-4 py-3 font-medium text-white">
                          {lead.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            lead.status_id === 111396583 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            lead.status_id === 111396579 ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                            lead.status_id === 111394691 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            lead.status_id === 143 ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            {lead.status_name}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {isRescued ? (
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 animate-spin" /> Sim
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {lead.specialist || "Equipe Comercial"}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-200">
                          {lead.price ? `R$ ${Number(lead.price).toFixed(2)}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(lead.created_at || Date.now()).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
