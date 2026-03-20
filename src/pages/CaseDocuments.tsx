import { useEffect } from "react";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { clauses } from "../data/clauses";
import { documentTypeLabels } from "../lib/labels";
import { DocumentType } from "../types/enums";
import { FileText, AlertCircle } from "lucide-react";

const documentOrder: DocumentType[] = [
  "contrato_social",
  "acordo_socios",
  "instrumento_doacao",
  "protocolo_familiar",
  "memorando_estrategico",
  "memorando_riscos",
  "memorando_tributario",
  "documento_internacional",
  "ambos",
];

export default function CaseDocuments() {
  const { caseProfile, setCaseProfile, recommendations } = usePatrimonialBuilderStore();

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  // Group recommendations by document
  const byDocument = documentOrder.map(docType => {
    const recs = recommendations.filter(r => r.suggestedDocument === docType);
    const clauseDetails = recs.map(r => {
      const clause = clauses.find(c => c.id === r.clauseId);
      return { rec: r, clause };
    }).filter(x => x.clause);

    return { docType, recs, clauseDetails };
  }).filter(group => group.recs.length > 0);

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Arquitetura Documental</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Organização das cláusulas por documento, com justificativa de alocação e alertas de sensibilidade.
        </p>

        <div className="space-y-5">
          {byDocument.map(({ docType, clauseDetails }) => (
            <div key={docType} className="border border-border rounded-lg bg-card overflow-hidden">
              <div className="px-5 py-4 bg-muted/30 border-b border-border flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {documentTypeLabels[docType]}
                  </h2>
                  <p className="text-xs text-muted-foreground">{clauseDetails.length} cláusula(s) alocada(s)</p>
                </div>
              </div>
              <div className="divide-y divide-border">
                {clauseDetails.map(({ rec, clause }) => clause && (
                  <div key={rec.id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{clause.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{clause.objective}</p>
                        {rec.allocationRationale && (
                          <p className="text-[11px] text-muted-foreground/60 mt-1 italic">{rec.allocationRationale}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {clause.sensitivityLevel === "alto" && (
                          <span className="text-[10px] text-warning bg-warning/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="h-2.5 w-2.5" />
                            Sensível
                          </span>
                        )}
                        {clause.needsMirroring && (
                          <span className="text-[10px] text-info bg-info/10 px-2 py-0.5 rounded-full">
                            Espelhamento
                          </span>
                        )}
                      </div>
                    </div>
                    {rec.wrongAllocationRisk && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-destructive/80">
                        <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                        {rec.wrongAllocationRisk}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
