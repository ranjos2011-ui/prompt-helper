import { useEffect } from "react";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { generateProjectPremises, generateStrategicSummary } from "../lib/premisesEngine";
import { CheckCircle2, FileText, MessageSquare, AlertTriangle } from "lucide-react";

export default function CasePremises() {
  const {
    caseProfile,
    setCaseProfile,
    answers,
    questionNotes,
    generalInterviewNotes,
  } = usePatrimonialBuilderStore();

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  if (!caseProfile) return null;

  const premises = generateProjectPremises(caseProfile, answers, questionNotes);
  const strategicSummary = generateStrategicSummary(caseProfile, answers, questionNotes, generalInterviewNotes);

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Premissas do Projeto</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consolidação da vontade da família e diretrizes do planejamento patrimonial e sucessório.
          </p>
        </div>

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
