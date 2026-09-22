import { NextRequest, NextResponse } from "next/server";

const KOMMO_TOKEN = process.env.KOMMO_ACCESS_TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0ZDY2YjhiZDc5YzkyYWZkYzg2N2Q2Njg2YWYxOGU0ODcxNzRmMmFmNzQ0YWQ2MTZmMDRlMzYxMTgxNjdkNDk4YmFjZjYzMmNmOWU3Y2VmIn0.eyJhdWQiOiIyZmVhMWEzYy1lZjFiLTQxYWQtYWY5Yi1lMTc3NjIyNGFiZDkiLCJqdGkiOiIzNGQ2NmI4YmQ3OWM5MmFmZGM4NjdkNjY4NmFmMThlNDg3MTc0ZjJhZjc0NGFkNjE2ZjA0ZTM2MTE4MTY3ZDQ5OGJhY2Y2MzJjZjllN2NlZiIsImlhdCI6MTc5MDEwMjcxMCwibmJmIjoxNzkwMTAyNzEwLCJleHAiOjE5NDc4MDE2MDAsInN1YiI6IjExNzQ0MDg3IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMzNTQwMjkxLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsImxpc3RfZXh0ZXJuYWxfbWVzc2FnZXMiLCJub3RpZmljYXRpb25zIiwicHVzaF9ub3RpZmljYXRpb25zIiwic2VuZF9leHRlcm5hbF9tZXNzYWdlcyIsInVzZXJzX2FjdGl2YXRlIiwidXNlcnNfYWRkIiwidXNlcnNfZGVhY3RpdmF0ZSJdLCJoYXNoX3V1aWQiOiIzMjM2NzI3Mi1jODNiLTRkMWMtYjU4NS03MWYxNjIzN2NiZjIiLCJhcGlfZG9tYWluIjoiYXBpLWMua29tbW8uY29tIn0.IPbXJPTe_sPjIIrumz_kuCVOMZy1mbXvhP95VVP1rYYAN6p-oaPjT_0DWqhx7EmOviD18tYtz5qZFqtiEQDBpn2FLlDvgbSOhbFGuVneP0o3Krre_zE3xbk6qyN9aG7IEhDN_NCTyXGCJErKp5m6FB67JYcibcDWlYTxBBMvesah86Vq8XKQql9uyEwTkBW1rkaeLXq13F2FfmLHpCGSLSg-hn0bh-ZI-YCC_8t4F-XXmXL2M5fhdB35fOmXsTvB-0LsJ_6bmXOY4gYICDKWoey-nDfoqgRm-jnM-6foHrWOqV976ZK7nGRkVpI9Fy5lsNf0uICrBQdlviHglikpwg";
const KOMMO_DOMAIN = "drluiseduardobarbosa.kommo.com";
const TARGET_PIPELINE_ID = 14421751; // Funil Upscale Unificado

// Estagios exclusivos do Funil Upscale Unificado
const STAGES: Record<number, { name: string; category: string }> = {
  111394679: { name: "Etapa de leads de entrada", category: "criados" },
  111394683: { name: "Em Atendimento & Para atender Hoje", category: "criados" },
  111394687: { name: "Contato Futuro", category: "contato_futuro" },
  111394691: { name: "Resgatados", category: "resgatados" },
  111396559: { name: "1a Ativacao", category: "ativacoes" },
  111396563: { name: "2a Ativacao", category: "ativacoes" },
  111396567: { name: "3a Ativacao", category: "ativacoes" },
  111396571: { name: "4a Ativacao", category: "ativacoes" },
  111396575: { name: "5a Ativacao", category: "ativacoes" },
  111396579: { name: "Consulta Agendada", category: "agendados" },
  111396583: { name: "Consulta Realizada", category: "realizados" },
  111396587: { name: "Outros Contatos (nao Pacientes)", category: "other" },
  142: { name: "Venda Ganha / Realizada", category: "realizados" },
  143: { name: "Perdidos", category: "perdidos" },
};

async function fetchPipelineLeads() {
  try {
    const url = `https://${KOMMO_DOMAIN}/api/v4/leads?limit=250&filter[pipeline_id]=${TARGET_PIPELINE_ID}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${KOMMO_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 5 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?._embedded?.leads || [];
  } catch (err) {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "all";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const allLeads = await fetchPipelineLeads();

    // Filtro por Data
    let startTimestamp: number | null = null;
    let endTimestamp: number | null = null;

    const now = new Date();
    if (startDateParam && endDateParam) {
      startTimestamp = Math.floor(new Date(startDateParam + "T00:00:00").getTime() / 1000);
      endTimestamp = Math.floor(new Date(endDateParam + "T23:59:59").getTime() / 1000);
    } else if (period === "today") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startTimestamp = Math.floor(startOfDay.getTime() / 1000);
    } else if (period === "7d") {
      startTimestamp = Math.floor((now.getTime() - 7 * 86400000) / 1000);
    } else if (period === "15d") {
      startTimestamp = Math.floor((now.getTime() - 15 * 86400000) / 1000);
    } else if (period === "30d") {
      startTimestamp = Math.floor((now.getTime() - 30 * 86400000) / 1000);
    } else if (period === "this_month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      startTimestamp = Math.floor(firstDay.getTime() / 1000);
    }

    const filteredLeads = allLeads.filter((l: any) => {
      const leadTime = Number(l.created_at || l.updated_at || 0);
      if (startTimestamp && leadTime < startTimestamp) return false;
      if (endTimestamp && leadTime > endTimestamp) return false;
      return true;
    });

    let criados = 0;
    let resgatados = 0;
    let agendados = 0;
    let realizados = 0;
    let perdidos = 0;
    let contatoFuturo = 0;
    let ativacoes = 0;

    const formattedLeads = filteredLeads.map((l: any) => {
      const statusId = Number(l.status_id);
      const stageInfo = STAGES[statusId] || { name: `Status ${statusId}`, category: "other" };

      if (stageInfo.category === "criados") criados++;
      else if (stageInfo.category === "resgatados") resgatados++;
      else if (stageInfo.category === "agendados") agendados++;
      else if (stageInfo.category === "realizados") realizados++;
      else if (stageInfo.category === "perdidos") perdidos++;
      else if (stageInfo.category === "contato_futuro") contatoFuturo++;
      else if (stageInfo.category === "ativacoes") ativacoes++;

      return {
        id: l.id,
        name: l.name || "Lead sem nome",
        status_id: statusId,
        status_name: stageInfo.name,
        category: stageInfo.category,
        pipeline_id: TARGET_PIPELINE_ID,
        price: l.price || 0,
        is_rescued: stageInfo.category === "resgatados",
        created_at: l.created_at ? new Date(l.created_at * 1000).toISOString() : new Date().toISOString(),
      };
    });

    const totalVolume = filteredLeads.length;
    // Total de leads criados = todos os leads que entraram no funil
    const totalCriados = totalVolume;

    const taxaResgate = ativacoes + resgatados > 0 ? ((resgatados / (ativacoes + resgatados)) * 100).toFixed(1) : "0";
    const taxaAgendamento = totalCriados > 0 ? ((agendados / totalCriados) * 100).toFixed(1) : "0";
    const taxaComparecimento = agendados > 0 ? ((realizados / agendados) * 100).toFixed(1) : "0";
    const taxaPerda = totalCriados > 0 ? ((perdidos / totalCriados) * 100).toFixed(1) : "0";

    const funnelData = [
      { step: "1. Leads Criados / Entrada", count: totalCriados, color: "#3B82F6" },
      { step: "2. Em Ativacoes (1 a 5)", count: ativacoes, color: "#06B6D4" },
      { step: "3. Leads Resgatados", count: resgatados, color: "#F59E0B" },
      { step: "4. Consultas Agendadas", count: agendados, color: "#8B5CF6" },
      { step: "5. Consultas Realizadas", count: realizados, color: "#10B981" },
      { step: "6. Leads Perdidos", count: perdidos, color: "#EF4444" },
    ];

    return NextResponse.json({
      pipeline_name: "Funil Upscale Unificado",
      pipeline_id: TARGET_PIPELINE_ID,
      total_crm_leads: totalVolume,
      metrics: {
        criados: { value: totalCriados, label: "Leads Criados", change: `${totalCriados} no funil` },
        resgatados: { value: resgatados, label: "Leads Resgatados", rate: `${taxaResgate}% de resgate` },
        agendados: { value: agendados, label: "Consultas Agendadas", rate: `${taxaAgendamento}% agendados` },
        realizados: { value: realizados, label: "Consultas Realizadas", rate: `${taxaComparecimento}% comparecimento` },
        perdidos: { value: perdidos, label: "Leads Perdidos", rate: `${taxaPerda}% perda` },
        contato_futuro: { value: contatoFuturo, label: "Contato Futuro", rate: `${contatoFuturo} agendados` },
        ativacoes: { value: ativacoes, label: "Em Ativacao (1 a 5)", rate: "Régua de follow-up" },
      },
      funnel: funnelData,
      recentLeads: formattedLeads,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}