import { useEffect } from "react";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { clauses } from "../data/clauses";
import { documentTypeLabels, priorityLabels } from "../lib/labels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlertTriangle, CheckSquare, Lightbulb, ListChecks } from "lucide-react";

export default function CaseOutput() {
  const { caseProfile, setCaseProfile, output, generateOutput: genOutput, recommendations, risks, alerts } = usePatrimonialBuilderStore();

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  useEffect(() => {
    if (caseProfile && !output) genOutput();
  }, [caseProfile, output, genOutput]);

  if (!output) return <AppShell><div className="p-6 text-muted-foreground">Gerando saída...</div></AppShell>;

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Saída Final</h1>
        <p className="text-sm text-muted-foreground mb-6">Resumo executivo, cláusulas, documentos, memorandos e checklist.</p>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="summary" className="text-xs">Resumo</TabsTrigger>
            <TabsTrigger value="clauses" className="text-xs">Cláusulas</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">Documentos</TabsTrigger>
            <TabsTrigger value="memos" className="text-xs">Memorandos</TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">Checklist</TabsTrigger>
          </TabsList>

          {/* Summary */}
          <TabsContent value="summary" className="space-y-4">
            <div className="border border-border rounded-lg bg-card p-5">
              <h2 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Resumo Executivo
              </h2>
              <p className="text-sm text-foreground leading-relaxed">{output.executiveSummary}</p>
            </div>

            <div className="border border-border rounded-lg bg-card p-5">
              <h3 className="font-display text-base font-semibold text-foreground mb-3">Tensões-chave</h3>
              <div className="space-y-2">
                {output.keyTensions.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-gold font-semibold">{i + 1}.</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border rounded-lg bg-card p-5">
              <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-gold" />
                Estratégia recomendada
              </h3>
              <div className="space-y-2">
                {output.recommendedStrategy.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckSquare className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Residual risks */}
            {output.residualRisks.length > 0 && (
              <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-5">
                <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Riscos residuais ({output.residualRisks.length})
                </h3>
                <ul className="space-y-1">
                  {output.residualRisks.map((r, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          {/* Clauses by priority */}
          <TabsContent value="clauses" className="space-y-4">
            {(["essenciais", "recomendadas", "opcionais", "avancadas"] as const).map(priority => {
              const ids = output.clausesByPriority[priority];
              if (ids.length === 0) return null;
              return (
                <div key={priority} className="border border-border rounded-lg bg-card p-5">
                  <h3 className="font-display text-base font-semibold text-foreground mb-3 capitalize">
                    {priorityLabels[priority === "essenciais" ? "essencial" : priority === "recomendadas" ? "recomendada" : priority === "opcionais" ? "opcional" : "avancada"]} ({ids.length})
                  </h3>
                  <div className="space-y-2">
                    {ids.map(id => {
                      const cl = clauses.find(c => c.id === id);
                      return cl && (
                        <div key={id} className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-foreground">{cl.name}</span>
                          <span className="text-xs text-muted-foreground">{documentTypeLabels[cl.defaultSuggestedDocument]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-4">
            {Object.entries(output.clausesByDocument).map(([doc, ids]) => {
              if (ids.length === 0) return null;
              return (
                <div key={doc} className="border border-border rounded-lg bg-card p-5">
                  <h3 className="font-display text-base font-semibold text-foreground mb-3">
                    {documentTypeLabels[doc as keyof typeof documentTypeLabels]} ({ids.length})
                  </h3>
                  <div className="space-y-1.5">
                    {ids.map(id => {
                      const cl = clauses.find(c => c.id === id);
                      return cl && (
                        <div key={id} className="text-sm text-foreground py-1">
                          • {cl.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Memos */}
          <TabsContent value="memos" className="space-y-4">
            <div className="border border-border rounded-lg bg-card p-5">
              <h3 className="font-display text-base font-semibold text-foreground mb-3">Memorandos Sugeridos</h3>
              {output.suggestedMemos.length > 0 ? (
                <div className="space-y-2">
                  {output.suggestedMemos.map((memo, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      {documentTypeLabels[memo as keyof typeof documentTypeLabels] || memo}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum memorando adicional sugerido.</p>
              )}
            </div>
          </TabsContent>

          {/* Checklist */}
          <TabsContent value="checklist" className="space-y-4">
            <div className="border border-border rounded-lg bg-card p-5">
              <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                Pendências e decisões
              </h3>
              <div className="space-y-2">
                {output.pendingDecisions.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 rounded border border-border mt-0.5 shrink-0" />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {output.alerts.length > 0 && (
              <div className="border border-warning/20 bg-warning/5 rounded-lg p-5">
                <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Alertas finais ({output.alerts.length})
                </h3>
                <div className="space-y-1.5">
                  {output.alerts.map((a, i) => (
                    <p key={i} className="text-sm text-muted-foreground">• {a}</p>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
