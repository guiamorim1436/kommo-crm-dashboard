# Kommo CRM Dashboard Comercial - Clínica Dr. Luis Eduardo Barbosa

Dashboard moderno e em tempo real para acompanhamento do funil de vendas e métricas de leads integradas ao Kommo CRM e Supabase.

## Métricas Monitoradas
1. **Leads Criados**
2. **Leads Resgatados** (após régua de ativações 1 a 5)
3. **Consultas Agendadas**
4. **Consultas Realizadas**
5. **Leads Perdidos**
6. **Contato Futuro**

## Webhook Endpoint
- **URL**: `https://<seu-app>.vercel.app/api/webhook/kommo`
- Aceita requisições POST do Kommo CRM (`application/x-www-form-urlencoded`).
