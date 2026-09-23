"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  RefreshCw,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Search,
  Calendar,
  Layers
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `/api/metrics?period=${period}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Erro ao carregar metricas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const handleApplyCustomDates = () => {
    if (startDate && endDate) {
      setPeriod("custom");
      fetchData();
    }
  };

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
    setPeriod("all");
  };

  const metrics = data?.metrics || {};
  const funnel = data?.funnel || [];
  const leads = data?.recentLeads || [];

  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "criados") return matchesSearch;
    if (statusFilter === "resgatados") return matchesSearch && lead.is_rescued;
    if (statusFilter === "agendados") return matchesSearch && lead.has_scheduled;
    if (statusFilter === "realizados") return matchesSearch && lead.has_completed;
    if (statusFilter === "perdidos") return matchesSearch && lead.category === "perdidos";
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#090D16] text-slate-100 p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Principal */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Cl{"\u00ED"}nica Dr. Luis Eduardo Barbosa
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Kommo CRM Ao Vivo
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Dashboard Comercial &bull; Performance e Convers{"\u00E3"}o de Leads
              </p>
            </div>
          </div>

          {/* Badges de Funil e Atualizar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-200">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Funil Upscale Unificado</span>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Atualizar dados agora"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
          </div>
        </header>

        {/* Barra de Filtro de Datas */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Per{"\u00ED"}odo:
            </span>
            {[
              { id: "all", label: "Tudo" },
              { id: "today", label: "Hoje" },
              { id: "7d", label: "7 Dias" },
              { id: "15d", label: "15 Dias" },
              { id: "30d", label: "30 Dias" },
              { id: "this_month", label: "Este M\u00EAs" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setPeriod(btn.id);
                  setStartDate("");
                  setEndDate("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  period === btn.id
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                    : "bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs text-slate-500">at{"\u00E9"}</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleApplyCustomDates}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition"
            >
              Filtrar
            </button>
            {(startDate || endDate || period !== "all") && (
              <button
                onClick={handleClearDates}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Limpar
              </button>
            )}
          </div>
        </section>

        {/* Grid de Cards KPI */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Leads Criados */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">1. LEADS CRIADOS</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.criados?.value ?? 0}
            </div>
            <p className="text-xs text-blue-400 mt-2 font-medium">
              Persistente (Total criado)
            </p>
          </div>

          {/* 2. Em Ativacao */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">EM ATIVA{"\u00C7"}{"\u00C3"}O (1-5)</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.ativacoes?.value ?? 0}
            </div>
            <p className="text-xs text-cyan-400/90 mt-2 font-medium">
              R{"\u00E9"}gua de follow-up
            </p>
          </div>

          {/* 3. Leads Resgatados */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-amber-500/40 transition ring-1 ring-amber-500/20">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">2. RESGATADOS</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.resgatados?.value ?? 0}
            </div>
            <p className="text-xs text-amber-400/90 mt-2 font-medium">
              {metrics.resgatados?.rate || "100.0% de resgate"} (persistente)
            </p>
          </div>

          {/* 4. Consultas Agendadas */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-purple-500/40 transition ring-1 ring-purple-500/20">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">3. AGENDADAS</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.agendados?.value ?? 0}
            </div>
            <p className="text-xs text-purple-400/90 mt-2 font-medium">
              {metrics.agendados?.rate || "0.0% agendados"} (persistente)
            </p>
          </div>

          {/* 5. Consultas Realizadas */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">4. REALIZADAS</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.realizados?.value ?? 0}
            </div>
            <p className="text-xs text-emerald-400/90 mt-2 font-medium">
              {metrics.realizados?.rate || "0.0% show-up"} (persistente)
            </p>
          </div>

          {/* 6. Leads Perdidos */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 hover:border-rose-500/40 transition">
            <div className="flex items-center justify-between text-rose-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">5. PERDIDOS</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {metrics.perdidos?.value ?? 0}
            </div>
            <p className="text-xs text-rose-400/90 mt-2 font-medium">
              {metrics.perdidos?.rate || "0.0% de perda"}
            </p>
          </div>
        </section>

        {/* Funil Visual Persistente */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Funil de Convers{"\u00E3"}o Comercial
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualiza{"\u00E7"}{"\u00E3"}o do fluxo de leads do Funil Upscale Unificado
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

        {/* Tabela de Leads com Historico */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Leads do Funil ({filteredLeads.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Contatos sincronizados do Funil Upscale Unificado
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
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
                <option value="resgatados">J{"\u00E1"} foram Resgatados</option>
                <option value="agendados">J{"\u00E1"} Agendaram Consulta</option>
                <option value="realizados">Realizaram Consulta</option>
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
                  <th className="px-4 py-3">Hist{"\u00F3"}rico de Passagem</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhum lead encontrado neste per{"\u00ED"}odo no Funil Upscale Unificado.
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
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {lead.is_rescued && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Passou por Resgate
                              </span>
                            )}
                            {lead.has_scheduled && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                J{"\u00E1"} Agendou
                              </span>
                            )}
                            {lead.has_completed && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Consulta Conclu{"\u00ED"}da
                              </span>
                            )}
                            {!lead.is_rescued && !lead.has_scheduled && !lead.has_completed && (
                              <span className="text-slate-500 text-[11px]">-</span>
                            )}
                          </div>
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