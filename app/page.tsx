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
  Check,
  Layers,
  Radio
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState("all");
  const [period, setPeriod] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/metrics?pipeline=${pipeline}&period=${period}`);
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
  }, [pipeline, period]);

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
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "criados") return matchesSearch && lead.category === "criados";
    if (statusFilter === "ativacoes") return matchesSearch && lead.category === "ativacoes";
    if (statusFilter === "resgatados") return matchesSearch && lead.category === "resgatados";
    if (statusFilter === "agendados") return matchesSearch && lead.category === "agendados";
    if (statusFilter === "realizados") return matchesSearch && lead.category === "realizados";
    if (statusFilter === "perdidos") return matchesSearch && lead.category === "perdidos";
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0A0E17] text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Clínica Dr. Luis Eduardo Barbosa
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Kommo CRM Ao Vivo
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Dashboard Comercial &bull; Dados sincronizados diretamente da sua conta Kommo CRM
              </p>
            </div>
          </div>

          {/* Controls: Pipeline filter & Refresh */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Pipeline Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={pipeline}
                onChange={(e) => setPipeline(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-slate-900 text-white">Todos os Funis UpScale (Consolidado)</option>
                <option value="14421751" className="bg-slate-900 text-white">Funil Upscale Unificado</option>
                <option value="13018635" className="bg-slate-900 text-white">UpScale Leticia</option>
                <option value="13018891" className="bg-slate-900 text-white">UpScale Carla</option>
              </select>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Atualizar dados agora"
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
              <p className="text-sm font-medium text-emerald-300">URL do Webhook para cadastro no Kommo CRM:</p>
              <code className="text-xs text-slate-300 font-mono bg-black/40 px-2 py-0.5 rounded border border-slate-800 inline-block mt-0.5">
                {webhookUrl || "https://kommo-crm-dashboard.vercel.app/api/webhook/kommo"}
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

        {/* KPI Cards Grid (5 Principais + Contato Futuro + Ativações) */}
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
            <p className="text-xs text-blue-400 mt-2 font-medium">
              {metrics.criados?.change || "Volume total no funil"}
            </p>
          </div>

          {/* 2. Em Ativações (1 a 5) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Em Ativação (1-5)</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.ativacoes?.value ?? 0}
            </div>
            <p className="text-xs text-cyan-400/90 mt-2 font-medium">
              Na régua de follow-up
            </p>
          </div>

          {/* 3. Leads Resgatados */}
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

          {/* 4. Consultas Agendadas */}
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

          {/* 5. Consultas Realizadas (Ganho) */}
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

          {/* 6. Leads Perdidos */}
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
        </section>

        {/* Funnel Progress Section */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Funil de Conversão Comercial (Kommo CRM)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Acompanhamento visual de todas as etapas de atendimento, ativações e consultas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {funnel.map((item: any, idx: number) => {
              const baseCount = funnel[0]?.count || 1;
              const pctOfTotal = baseCount > 0 ? Math.round((item.count / baseCount) * 100) : 0;
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
                    <span className="text-[10px] text-slate-400">{pctOfTotal}% do total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Real Leads Table */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Leads Reais do CRM ({filteredLeads.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Últimos contatos sincronizados diretamente da sua conta
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nome do lead..."
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
                <option value="criados">Entrada / Atendimento</option>
                <option value="ativacoes">Em Ativação (1-5)</option>
                <option value="resgatados">Resgatados</option>
                <option value="agendados">Consultas Agendadas</option>
                <option value="realizados">Consultas Realizadas</option>
                <option value="perdidos">Perdidos</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Lead / Paciente</th>
                  <th className="px-4 py-3">Status Atual no CRM</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhum lead encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead: any) => {
                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                        <td className="px-4 py-3 font-mono text-slate-400">
                          #{lead.id}
                        </td>
                        <td className="px-4 py-3 font-medium text-white">
                          {lead.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            lead.category === "realizados" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            lead.category === "agendados" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                            lead.category === "resgatados" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            lead.category === "ativacoes" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                            lead.category === "perdidos" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            {lead.status_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 capitalize text-slate-400">
                          {lead.category}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-200">
                          {lead.price ? `R$ ${Number(lead.price).toFixed(2)}` : "-"}
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
