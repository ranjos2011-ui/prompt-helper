import { useEffect } from "react";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { clauses } from "../data/clauses";
import { riskStatusLabels, riskStatusColors, documentTypeLabels } from "../lib/labels";
import { Shield, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function CaseRisks() {
  const { caseProfile, setCaseProfile, risks } = usePatrimonialBuilderStore();

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  const grouped = {
    nao_tratado: risks.filter(r => r.status === "nao_tratado"),
    parcialmente_tratado: risks.filter(r => r.status === "parcialmente_tratado"),
    tratado: risks.filter(r => r.status === "tratado"),
  };

  const statusIcons = {
    nao_tratado: AlertTriangle,
    parcialmente_tratado: Clock,
    tratado: CheckCircle2,
  };

  const statusTitles = {
    nao_tratado: "Não tratados",
    parcialmente_tratado: "Parcialmente tratados",
    tratado: "Tratados",
  };

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Mapa de Riscos</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {risks.length} riscos mapeados · {grouped.tratado.length} tratados · {grouped.parcialmente_tratado.length} parciais · {grouped.nao_tratado.length} pendentes
        </p>

        <div className="space-y-6">
          {(["nao_tratado", "parcialmente_tratado", "tratado"] as const).map(status => {
            const group = grouped[status];
            if (group.length === 0) return null;
            const Icon = statusIcons[status];

            return (
              <div key={status}>
                <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${
                    status === "tratado" ? "text-success" : status === "parcialmente_tratado" ? "text-warning" : "text-destructive"
                  }`} />
                  {statusTitles[status]} ({group.length})
                </h2>
                <div className="space-y-2">
                  {group.map(risk => (
                    <div key={risk.id} className="border border-border rounded-lg bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground">{risk.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${riskStatusColors[risk.status]}`}>
                          {riskStatusLabels[risk.status]}
                        </span>
                      </div>

                      {risk.linkedClauseIds.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-border">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Cláusulas vinculadas: </span>
                          <span className="text-xs text-foreground">
                            {risk.linkedClauseIds.map(id => {
                              const cl = clauses.find(c => c.id === id);
                              return cl?.name || id;
                            }).join(", ")}
                          </span>
                        </div>
                      )}

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {risk.linkedDocumentTypes.map(doc => (
                          <span key={doc} className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {documentTypeLabels[doc]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
