import { CaseProfile } from "../../types/case";
import { Clause } from "../../types/clause";
import { Recommendation } from "../../types/recommendation";
import { Risk } from "../../types/risk";
import { AlertCircle, Link2, Shield, Target } from "lucide-react";
import { riskStatusLabels, riskStatusColors } from "../../lib/labels";

interface Props {
  caseProfile: CaseProfile;
  clause: Clause;
  recommendation: Recommendation;
  risks: Risk[];
}

export function ClauseContextSidebar({ caseProfile, clause, recommendation, risks }: Props) {
  const relatedRisks = risks.filter((r) => clause.coveredRiskIds.includes(r.id));

  return (
    <div className="space-y-5">
      {/* Case context */}
      <div>
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Contexto do caso</h3>
        <div className="bg-muted/30 border border-border rounded-lg p-3 space-y-1.5">
          <p className="text-xs text-foreground font-medium truncate">{caseProfile.caseName}</p>
          <p className="text-[11px] text-muted-foreground">Objetivo: {caseProfile.primaryGoal.replace(/_/g, " ")}</p>
          <p className="text-[11px] text-muted-foreground">Conflito: {caseProfile.conflictRisk}</p>
        </div>
      </div>

      {/* Why recommended */}
      <div>
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
          <Target className="h-3 w-3" />
          Por que recomendada
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{recommendation.reason}</p>
      </div>

      {/* Related risks */}
      <div>
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Riscos relacionados
        </h3>
        <div className="space-y-1.5">
          {relatedRisks.map((risk) => (
            <div key={risk.id} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-foreground/80 truncate">{risk.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${riskStatusColors[risk.status]}`}>
                {riskStatusLabels[risk.status]}
              </span>
            </div>
          ))}
          {relatedRisks.length === 0 && (
            <p className="text-xs text-muted-foreground/60">Nenhum risco mapeado</p>
          )}
        </div>
      </div>

      {/* Dependencies */}
      {clause.dependencies.length > 0 && (
        <div>
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
            <Link2 className="h-3 w-3" />
            Dependências
          </h3>
          <ul className="space-y-1">
            {clause.dependencies.map((dep) => (
              <li key={dep} className="text-xs text-muted-foreground">
                {dep.replace("cl_", "").replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alerts */}
      {clause.alerts.length > 0 && (
        <div>
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-warning" />
            Alertas
          </h3>
          {clause.alerts.map((alert, i) => (
            <p key={i} className="text-xs text-warning leading-relaxed">{alert}</p>
          ))}
        </div>
      )}
    </div>
  );
}
