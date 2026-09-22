import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d";

    let dateFilter: Date | null = null;
    const now = new Date();
    if (period === "today") {
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "7d") {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "30d") {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Try fetching from Supabase
    let queryLeads = supabase.from("leads").select("*").order("updated_at", { ascending: false });
    let queryEvents = supabase.from("lead_events").select("*");

    if (dateFilter) {
      queryLeads = queryLeads.gte("created_at", dateFilter.toISOString());
      queryEvents = queryEvents.gte("created_at", dateFilter.toISOString());
    }

    const [leadsRes, eventsRes] = await Promise.all([queryLeads, queryEvents]);

    let leads = leadsRes.data || [];
    let events = eventsRes.data || [];

    // If database is empty or not yet seeded, provide preview sample data for instant visualization
    const isMock = leads.length === 0;
    if (isMock) {
      leads = [
        { id: 101, name: "Mariana Silva", status_name: "Consulta Realizada", status_id: 111396583, price: 650, specialist: "Dr. Luis Eduardo", is_rescued: false, created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
        { id: 102, name: "Carlos Eduardo Costa", status_name: "Consulta Agendada", status_id: 111396579, price: 500, specialist: "Dr. Luis Eduardo", is_rescued: true, created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
        { id: 103, name: "Beatriz Oliveira", status_name: "Resgatados", status_id: 111394691, price: 0, specialist: "Dra. Dayse", is_rescued: true, created_at: new Date(Date.now() - 3600000 * 14).toISOString() },
        { id: 104, name: "Fernanda Ribeiro", status_name: "Em Atendimento", status_id: 111394683, price: 0, specialist: "Leticia", is_rescued: false, created_at: new Date(Date.now() - 3600000 * 1).toISOString() },
        { id: 105, name: "Roberto Martins", status_name: "Contato Futuro", status_id: 111394687, price: 0, specialist: "Carla", is_rescued: false, created_at: new Date(Date.now() - 3600000 * 20).toISOString() },
        { id: 106, name: "Juliana Santos", status_name: "Perdidos", status_id: 143, price: 0, specialist: "Leticia", is_rescued: false, created_at: new Date(Date.now() - 3600000 * 48).toISOString() },
        { id: 107, name: "Lucas Mendes", status_name: "Consulta Realizada", status_id: 111396583, price: 800, specialist: "Dr. Luis Eduardo", is_rescued: true, created_at: new Date(Date.now() - 3600000 * 72).toISOString() },
        { id: 108, name: "Patricia Lima", status_name: "Consulta Agendada", status_id: 111396579, price: 500, specialist: "Dr. Luis Eduardo", is_rescued: false, created_at: new Date(Date.now() - 3600000 * 30).toISOString() },
      ];
    }

    // Counts
    const totalCriados = isMock ? 84 : leads.length;
    const totalResgatados = isMock ? 23 : leads.filter((l: any) => l.is_rescued || l.status_id === 111394691).length;
    const totalAgendados = isMock ? 38 : leads.filter((l: any) => l.status_id === 111396579).length;
    const totalRealizados = isMock ? 29 : leads.filter((l: any) => l.status_id === 111396583).length;
    const totalPerdidos = isMock ? 17 : leads.filter((l: any) => l.status_id === 143).length;
    const totalContatoFuturo = isMock ? 9 : leads.filter((l: any) => l.status_id === 111394687).length;

    const taxaResgate = totalCriados > 0 ? ((totalResgatados / totalCriados) * 100).toFixed(1) : "0";
    const taxaAgendamento = totalCriados > 0 ? ((totalAgendados / totalCriados) * 100).toFixed(1) : "0";
    const taxaComparecimento = totalAgendados > 0 ? ((totalRealizados / totalAgendados) * 100).toFixed(1) : "0";
    const taxaPerda = totalCriados > 0 ? ((totalPerdidos / totalCriados) * 100).toFixed(1) : "0";

    const funnelData = [
      { step: "1. Leads Criados", count: totalCriados, color: "#3B82F6" },
      { step: "2. Leads Resgatados", count: totalResgatados, color: "#F59E0B" },
      { step: "3. Consultas Agendadas", count: totalAgendados, color: "#8B5CF6" },
      { step: "4. Consultas Realizadas", count: totalRealizados, color: "#10B981" },
      { step: "5. Leads Perdidos", count: totalPerdidos, color: "#EF4444" },
    ];

    return NextResponse.json({
      is_preview: isMock,
      metrics: {
        criados: { value: totalCriados, label: "Leads Criados", change: "+14%" },
        resgatados: { value: totalResgatados, label: "Leads Resgatados", rate: `${taxaResgate}% taxa de recuperação` },
        agendados: { value: totalAgendados, label: "Consultas Agendadas", rate: `${taxaAgendamento}% taxa de agendamento` },
        realizados: { value: totalRealizados, label: "Consultas Realizadas", rate: `${taxaComparecimento}% taxa de show-up` },
        perdidos: { value: totalPerdidos, label: "Leads Perdidos", rate: `${taxaPerda}% de perda total` },
        contato_futuro: { value: totalContatoFuturo, label: "Contato Futuro", rate: "Acompanhamentos agendados" },
      },
      funnel: funnelData,
      recentLeads: leads.slice(0, 15),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
