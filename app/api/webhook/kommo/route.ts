import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const STATUS_MAP: Record<string, { name: string; type: string }> = {
  "111394679": { name: "Etapa de leads de entrada", type: "created" },
  "111394683": { name: "Em Atendimento & Para atender Hoje", type: "created" },
  "111394687": { name: "Contato Futuro", type: "future_contact" },
  "111394691": { name: "Resgatados", type: "rescued" },
  "111396559": { name: "1ª Ativação", type: "activation" },
  "111396563": { name: "2ª Ativação", type: "activation" },
  "111396567": { name: "3ª Ativação", type: "activation" },
  "111396571": { name: "4ª Ativação", type: "activation" },
  "111396575": { name: "5ª Ativação", type: "activation" },
  "111396579": { name: "Consulta Agendada", type: "scheduled" },
  "111396583": { name: "Consulta Realizada", type: "completed" },
  "111396587": { name: "Outros Contatos (não Pacientes)", type: "other" },
  "142": { name: "Ganho", type: "won" },
  "143": { name: "Perdidos", type: "lost" },
};

const ACTIVATION_STATUS_IDS = ["111396559", "111396563", "111396567", "111396571", "111396575"];

function parseKommoFormData(rawBody: string): any {
  const params = new URLSearchParams(rawBody);
  const result: any = {};

  for (const [key, value] of params.entries()) {
    const keys = key.replace(/\]/g, "").split("[");
    let current = result;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        current[k] = value;
      } else {
        if (!current[k]) {
          const nextKey = keys[i + 1];
          current[k] = /^\d+$/.test(nextKey) ? [] : {};
        }
        current = current[k];
      }
    }
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const metricParam = searchParams.get("metric");

    const contentType = req.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const rawText = await req.text();
      data = parseKommoFormData(rawText);
    } else if (contentType.includes("application/json")) {
      data = await req.json();
    } else {
      const rawText = await req.text();
      try {
        data = JSON.parse(rawText);
      } catch {
        data = parseKommoFormData(rawText);
      }
    }

    const leadsStatus = data?.leads?.status || [];
    const leadsAdd = data?.leads?.add || [];
    const allEvents = [
      ...leadsAdd.map((l: any) => ({ ...l, _action: "add" })),
      ...leadsStatus.map((l: any) => ({ ...l, _action: "status" }))
    ];

    if (allEvents.length === 0 && data?.leads?.update) {
      allEvents.push(...data.leads.update.map((l: any) => ({ ...l, _action: "update" })));
    }

    const processed = [];

    for (const lead of allEvents) {
      const leadId = Number(lead.id);
      if (!leadId) continue;

      const pipelineId = lead.pipeline_id ? Number(lead.pipeline_id) : 14421751;
      const statusId = String(lead.status_id || "");
      const oldStatusId = lead.old_status_id ? String(lead.old_status_id) : null;
      const leadName = lead.name || "Lead sem nome";
      const price = Number(lead.price || 0);
      const responsibleId = lead.responsible_user_id ? Number(lead.responsible_user_id) : null;

      const statusMeta = STATUS_MAP[statusId] || { name: `Status ${statusId}`, type: "unknown" };
      let eventType = metricParam || statusMeta.type;

      let isRescued = metricParam === "resgatados" || statusId === "111394691";
      if (!isRescued && oldStatusId && ACTIVATION_STATUS_IDS.includes(oldStatusId) && (statusId === "111394683" || statusId === "111394691")) {
        isRescued = true;
        eventType = "rescued";
      } else if (metricParam === "criados" || lead._action === "add" || statusId === "111394679" || statusId === "111394683") {
        eventType = "created";
      }

      await supabase.from("leads").upsert(
        {
          id: leadId,
          name: leadName,
          price: price,
          pipeline_id: pipelineId,
          status_id: Number(statusId) || null,
          status_name: statusMeta.name,
          previous_status_id: oldStatusId ? Number(oldStatusId) : null,
          responsible_user_id: responsibleId,
          is_rescued: isRescued,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      await supabase.from("lead_events").insert({
        lead_id: leadId,
        event_type: eventType,
        from_status_id: oldStatusId ? Number(oldStatusId) : null,
        to_status_id: Number(statusId) || null,
        metadata: {
          lead_name: leadName,
          price: price,
          metric_param: metricParam,
        },
      });

      processed.push({ id: leadId, eventType, statusName: statusMeta.name });
    }

    return NextResponse.json({
      success: true,
      processed_count: processed.length,
      processed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return NextResponse.json({
    status: "online",
    message: "Kommo CRM Webhook endpoint está ativo!",
    metric_received: searchParams.get("metric") || "all",
  });
}

