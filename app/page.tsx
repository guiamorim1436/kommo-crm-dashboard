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
  Layers,
  Sun,
  Moon
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [period, setPeriod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const savedTheme = localStorage.getItem("crm_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("crm_theme", nextTheme);
  };

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

  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen p-4 md:p-8 font-sans antialiased transition-colors duration-200 ${
        isDark ? "bg-[#090D16] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Principal */}
        <header
          className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-6 transition-colors ${
            isDark ? "border-slate-800/80" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Cl{"\u00ED"}nica Dr. Luis Eduardo Barbosa
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    isDark
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Kommo CRM Ao Vivo
                </span>
              </div>
              <p className={`text-xs md:text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Dashboard Comercial &bull; Performance e Convers{"\u00E3"}o de Leads
              </p>
            </div>
          </div>

          {/* Badges de Funil, Modo Claro/Escuro e Atualizar */}
          <div className="flex items-center gap-2.5">
            {/* Indicador Fixo do Funil Upscale Unificado */}
            <div
              className={`flex items-center gap-2 border rounded-xl px-3.5 py-2 text-xs font-semibold ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-200"
                  : "bg-white border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Funil Upscale Unificado</span>
            </div>

            {/* Botao de Alternar Tema (Claro / Escuro) */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 text-xs font-medium ${
                isDark
                  ? "bg-slate-900/90 border-slate-800 text-amber-300 hover:text-amber-200 hover:border-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
              }`}
              title={isDark ? "Mudar para vers\u00E3o clara" : "Mudar para vers\u00E3o escura"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Vers{"\u00E3"}o Clara</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden sm:inline">Vers{"\u00E3"}o Escura</span>
                </>
              )}
            </button>

            {/* Botao Atualizar */}
            <button
              onClick={fetchData}
              disabled={loading}
              className={`p-2.5 border rounded-xl transition-all disabled:opacity-50 ${
                isDark
                  ? "bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
              }`}
              title="Atualizar dados agora"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-500" : ""}`} />
            </button>
          </div>
        </header>

        {/* Barra de Filtro de Datas */}
        <section
          className={`border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
            isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-xs font-semibold mr-2 flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Per{"\u00ED"}odo:
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
                    : isDark
                    ? "bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200/80"
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
              className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 ${
                isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-800"
              }`}
            />
            <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>at{"\u00E9"}</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 ${
                isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-800"
              }`}
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
                className={`px-2.5 py-1.5 text-xs rounded-lg transition ${
                  isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
              >
                Limpar
              </button>
            )}
          </div>
        </section>

        {/* Grid de Cards KPI */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Leads Criados */}
          <div
            className={`border rounded-2xl p-4 transition ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-blue-500/40"
                : "bg-white border-slate-200 shadow-sm hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between text-blue-500 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                1. LEADS CRIADOS
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {metrics.criados?.value ?? 0}
            </div>
            <p className="text-xs text-blue-500 mt-2 font-medium">Persistente (Total criado)</p>
          </div>

          {/* 2. Em Ativacao */}
          <div
            className={`border rounded-2xl p-4 transition ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40"
                : "bg-white border-slate-200 shadow-sm hover:border-cyan-400"
            }`}
          >
            <div className="flex items-center justify-between text-cyan-500 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                EM ATIVA{"\u00C7"}{"\u00C3"}O (1-5)
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-cyan-500" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {metrics.ativacoes?.value ?? 0}
            </div>
            <p className="text-xs text-cyan-600 mt-2 font-medium">R{"\u00E9"}gua de follow-up</p>
          </div>

          {/* 3. Leads Resgatados */}
          <div
            className={`border rounded-2xl p-4 transition ring-1 ring-amber-500/20 ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-amber-500/40"
                : "bg-white border-slate-200 shadow-sm hover:border-amber-400"
            }`}
          >
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                2. RESGATADOS
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {metrics.resgatados?.value ?? 0}
            </div>
            <p className="text-xs text-amber-600 mt-2 font-medium">
              {metrics.resgatados?.rate || "100.0% de resgate"} (persistente)
            </p>
          </div>

          {/* 4. Consultas Agendadas */}
          <div
            className={`border rounded-2xl p-4 transition ring-1 ring-purple-500/20 ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-purple-500/40"
                : "bg-white border-slate-200 shadow-sm hover:border-purple-400"
            }`}
          >
            <div className="flex items-center justify-between text-purple-500 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                3. AGENDADAS
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-purple-500" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {metrics.agendados?.value ?? 0}
            </div>
            <p className="text-xs text-purple-600 mt-2 font-medium">
              {metrics.agendados?.rate || "0.0% agendados"} (persistente)
            </p>
          </div>

          {/* 5. Consultas Realizadas */}
          <div
            className={`border rounded-2xl p-4 transition ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-emerald-500/40"
                : "bg-white border-slate-200 shadow-sm hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center justify-between text-emerald-500 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                4. REALIZADAS
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {metrics.realizados?.value ?? 0}
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">
              {metrics.realizados?.rate || "0.0% show-up"} (persistente)
            </p>
          </div>

          {/* 6. Leads Perdidos */}
          <div
            className={`border rounded-2xl p-4 transition ${
              isDark
                ? "bg-slate-900/80 border-slate-800 hover:border-rose-500/40"
                : "bg-white border-slate-200 shadow-sm hover:border-rose-400"
            }`}
          >
            <div className="flex items-center justify-between text-rose-500 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                5. PERDIDOS
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {metrics.perdidos?.value ?? 0}
            </div>
            <p className="text-xs text-rose-600 mt-2 font-medium">
              {metrics.perdidos?.rate || "0.0% de perda"}
            </p>
          </div>
        </section>

        {/* Funil Visual Persistente */}
        <section
          className={`border rounded-2xl p-6 transition-colors ${
            isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Funil de Convers{"\u00E3"}o Comercial
              </h2>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Visualiza{"\u00E7"}{"\u00E3"}o do fluxo de leads do Funil Upscale Unificado
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {funnel.map((item: any, idx: number) => {
              const baseCount = funnel[0]?.count || 1;
              const pctOfTotal = baseCount > 0 ? Math.round((item.count / baseCount) * 100) : 0;
              return (
                <div
                  key={idx}
                  className={`border rounded-xl p-4 relative overflow-hidden transition-colors ${
                    isDark ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {item.step}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: item.color }}>
                      {item.count}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full mt-3 overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(pctOfTotal, 100)}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {pctOfTotal}% do total
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tabela de Leads com Historico */}
        <section
          className={`border rounded-2xl p-6 space-y-4 transition-colors ${
            isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Users className="w-5 h-5 text-blue-500" />
                Leads do Funil ({filteredLeads.length})
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Contatos sincronizados do Funil Upscale Unificado
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`border rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 w-48 sm:w-60 ${
                    isDark
                      ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"
                  }`}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-300 text-slate-700"
                }`}
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
              <thead
                className={`uppercase font-semibold border-b ${
                  isDark
                    ? "bg-slate-950/80 text-slate-400 border-slate-800"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Lead / Paciente</th>
                  <th className="px-4 py-3">Status Atual no CRM</th>
                  <th className="px-4 py-3">Hist{"\u00F3"}rico de Passagem</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-slate-200"}`}>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className={`text-center py-8 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Nenhum lead encontrado neste per{"\u00ED"}odo no Funil Upscale Unificado.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead: any) => {
                    return (
                      <tr
                        key={lead.id}
                        className={`transition ${isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-50"}`}
                      >
                        <td className={`px-4 py-3 font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          #{lead.id}
                        </td>
                        <td className={`px-4 py-3 font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                          {lead.name}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                              lead.category === "realizados"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : lead.category === "agendados"
                                ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                : lead.category === "resgatados"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : lead.category === "ativacoes"
                                ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                                : lead.category === "perdidos"
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }`}
                          >
                            {lead.status_name}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {lead.is_rescued && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                                Passou por Resgate
                              </span>
                            )}
                            {lead.has_scheduled && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/20 text-purple-500 border border-purple-500/30">
                                J{"\u00E1"} Agendou
                              </span>
                            )}
                            {lead.has_completed && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                                Consulta Conclu{"\u00ED"}da
                              </span>
                            )}
                            {!lead.is_rescued && !lead.has_scheduled && !lead.has_completed && (
                              <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>-</span>
                            )}
                          </div>
                        </td>
                        <td className={`px-4 py-3 font-mono ${isDark ? "text-slate-200" : "text-slate-700"}`}>
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