import { useEffect, useCallback } from "react";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { generateProjectPremises, generateStrategicSummary } from "../lib/premisesEngine";
import { CheckCircle2, FileText, MessageSquare, AlertTriangle, Download, UserCircle } from "lucide-react";
import { questions } from "../data/questions";

function buildPremisesPdfHtml(
  caseProfile: any,
  premises: any[],
  strategicSummary: string,
  generalInterviewNotes: string,
  clientQualification: string,
  answers: Record<string, string>,
  questionNotes: Record<string, string>,
) {
  const moduleQuestions = questions.filter(q => q.moduleId === caseProfile.selectedModule);

  const questionsHtml = moduleQuestions.map(q => {
    const answer = answers[q.id];
    const notes = questionNotes[q.id];
    if (!answer && !notes) return "";
    const opt = q.options.find(o => o.value === answer);
    return `
      <div style="margin-bottom:16px;padding:12px 16px;border:1px solid #e2e2e2;border-radius:6px;">
        <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">${q.category}</div>
        <div style="font-weight:600;font-size:13px;color:#1a1a1a;margin-bottom:6px;">${q.title}</div>
        ${answer ? `<div style="font-size:12px;color:#333;"><strong>Resposta:</strong> ${opt ? opt.label : answer}</div>` : ""}
        ${notes ? `<div style="margin-top:6px;padding:8px 10px;background:#f8f7f4;border-radius:4px;font-size:11px;color:#555;font-style:italic;"><strong>Observações:</strong> ${notes}</div>` : ""}
      </div>
    `;
  }).filter(Boolean).join("");

  const premisesHtml = premises.map(p => `
    <div style="margin-bottom:14px;padding:14px 16px;border:1px solid #e2e2e2;border-radius:6px;">
      <div style="font-weight:600;font-size:13px;color:#1a1a1a;margin-bottom:4px;">${p.title}</div>
      <div style="display:inline-block;font-size:11px;font-weight:500;color:#6b5b3e;background:#f5f0e6;padding:2px 8px;border-radius:10px;margin-bottom:6px;">${p.value}</div>
      <div style="font-size:12px;color:#555;line-height:1.5;margin-top:6px;">${p.interpretation}</div>
      ${p.notesSummary ? `<div style="margin-top:8px;padding:8px 10px;background:#f8f7f4;border-radius:4px;font-size:11px;color:#666;font-style:italic;">"${p.notesSummary}"</div>` : ""}
    </div>
  `).join("");

  return `
    <html><head><meta charset="utf-8"><style>
      @page { size: A4; margin: 24mm 20mm; }
      body { font-family: 'Georgia', serif; color: #1a1a1a; margin: 0; padding: 0; }
      .header { text-align: center; border-bottom: 2px solid #6b5b3e; padding-bottom: 16px; margin-bottom: 24px; }
      .header h1 { font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0 0 4px 0; }
      .header p { font-size: 12px; color: #888; margin: 0; }
      .section-title { font-size: 14px; font-weight: 700; color: #6b5b3e; text-transform: uppercase; letter-spacing: 1px; margin: 28px 0 12px 0; border-bottom: 1px solid #e2e2e2; padding-bottom: 6px; }
      .summary-box { background: #f5f0e6; border: 1px solid #d4c9a8; border-radius: 8px; padding: 16px 18px; margin-top: 20px; }
      .summary-box p { font-size: 13px; color: #333; line-height: 1.6; margin: 0; }
      .notes-block { background: #fafaf8; border: 1px solid #e2e2e2; border-radius: 6px; padding: 14px 16px; font-size: 12px; color: #555; line-height: 1.6; white-space: pre-wrap; }
      .qual-block { background: #fafaf8; border: 1px solid #e2e2e2; border-radius: 6px; padding: 14px 16px; font-size: 12px; color: #333; line-height: 1.6; white-space: pre-wrap; }
      .footer { text-align: center; font-size: 10px; color: #aaa; margin-top: 40px; border-top: 1px solid #e2e2e2; padding-top: 10px; }
    </style></head><body>
      <div class="header">
        <h1>Premissas do Projeto</h1>
        <p>Arquiteto Patrimonial — ${caseProfile.name || "Caso"}</p>
        <p style="margin-top:4px;">Gerado em ${new Date().toLocaleDateString("pt-BR")}</p>
      </div>

      ${clientQualification ? `
        <div class="section-title">Qualificação do Cliente</div>
        <div class="qual-block">${clientQualification}</div>
      ` : ""}

      <div class="section-title">Respostas da Entrevista</div>
      ${questionsHtml || '<p style="font-size:12px;color:#888;">Nenhuma resposta registrada.</p>'}

      <div class="section-title">Premissas Consolidadas</div>
      ${premisesHtml}

      ${generalInterviewNotes ? `
        <div class="section-title">Notas Gerais da Entrevista</div>
        <div class="notes-block">${generalInterviewNotes}</div>
      ` : ""}

      <div class="section-title">Síntese Estratégica</div>
      <div class="summary-box"><p>${strategicSummary}</p></div>

      <div class="footer">Documento gerado automaticamente pelo Arquiteto Patrimonial. Uso exclusivo do advogado responsável.</div>
    </body></html>
  `;
}

export default function CasePremises() {
  const {
    caseProfile,
    setCaseProfile,
    answers,
    questionNotes,
    generalInterviewNotes,
    clientQualification,
  } = usePatrimonialBuilderStore();

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  const handleExportPdf = useCallback(() => {
    if (!caseProfile) return;
    const premises = generateProjectPremises(caseProfile, answers, questionNotes);
    const strategicSummary = generateStrategicSummary(caseProfile, answers, questionNotes, generalInterviewNotes);
    const html = buildPremisesPdfHtml(caseProfile, premises, strategicSummary, generalInterviewNotes, clientQualification, answers, questionNotes);

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 400);
    }
  }, [caseProfile, answers, questionNotes, generalInterviewNotes, clientQualification]);

  if (!caseProfile) return null;

  const premises = generateProjectPremises(caseProfile, answers, questionNotes);
  const strategicSummary = generateStrategicSummary(caseProfile, answers, questionNotes, generalInterviewNotes);

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Premissas do Projeto</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Consolidação da vontade da família e diretrizes do planejamento patrimonial e sucessório.
            </p>
          </div>
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors shrink-0"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </button>
        </div>

        {/* Client qualification */}
        {clientQualification && (
          <div className="border border-border rounded-lg bg-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Qualificação do cliente</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {clientQualification}
            </p>
          </div>
        )}

        {/* Premises grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {premises.map((premise) => (
            <div
              key={premise.id}
              className="border border-border rounded-lg bg-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">{premise.title}</h3>
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {premise.value}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {premise.interpretation}
              </p>

              {premise.notesSummary && (
                <div className="bg-muted/40 rounded-md p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Observações da entrevista
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "{premise.notesSummary}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* General interview notes */}
        {generalInterviewNotes && (
          <div className="border border-border rounded-lg bg-card p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Notas gerais da entrevista</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {generalInterviewNotes}
            </p>
          </div>
        )}

        {/* Strategic summary */}
        <div className="border border-primary/20 bg-primary/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">Síntese estratégica do caso</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {strategicSummary}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
