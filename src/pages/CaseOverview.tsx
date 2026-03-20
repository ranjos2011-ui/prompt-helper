import { useEffect } from "react";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { AlertTriangle, CheckCircle2, TrendingUp, FileText, Shield, Clock } from "lucide-react";

export default function CaseOverview() {
  const { caseProfile, setCaseProfile, recommendations, risks, alerts, activeClauseIds, completedQuestionIds } = usePatrimonialBuilderStore();

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  if (!caseProfile) return null;

  const treated = risks.filter(r => r.status === "tratado").length;
  const partial = risks.filter(r => r.status === "parcialmente_tratado").length;
  const untreated = risks.filter(r => r.status === "nao_tratado").length;
  const progress = Math.round((completedQuestionIds.length / 18) * 100);

  const goalLabels: Record<string, string> = {
    protecao_patrimonial: "Proteção patrimonial",
    continuidade_comando: "Continuidade do comando",
    igualdade_herdeiros: "Igualdade entre herdeiros",
    liquidez: "Liquidez",
    governanca_familiar: "Governança familiar",
    eficiencia_tributaria_patrimonial: "Eficiência tributária patrimonial",
  };

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{caseProfile.caseName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{caseProfile.notes}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: "Cláusulas ativas", value: activeClauseIds.length, color: "text-primary" },
            { icon: Shield, label: "Riscos tratados", value: treated, color: "text-success" },
            { icon: AlertTriangle, label: "Riscos pendentes", value: untreated, color: "text-destructive" },
            { icon: Clock, label: "Progresso", value: `${progress}%`, color: "text-gold" },
          ].map((stat) => (
            <div key={stat.label} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold text-foreground font-display">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="border border-warning/30 bg-warning/5 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Alertas ({alerts.length})
            </h3>
            <ul className="space-y-1">
              {alerts.map((alert, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-warning mt-0.5">•</span>
                  {alert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Case Profile */}
          <div className="border border-border rounded-lg p-5 bg-card">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Perfil do caso</h3>
            <div className="space-y-2.5 text-sm">
              {[
                ["Objetivo principal", goalLabels[caseProfile.primaryGoal]],
                ["Controle do fundador", caseProfile.founderKeepsControl],
                ["Renda do fundador", caseProfile.founderKeepsIncome],
                ["Herdeiros gestores", caseProfile.hasManagingHeirs],
                ["Herdeiros investidores", caseProfile.hasNonManagingHeirs],
                ["Filhos de relações diferentes", caseProfile.hasChildrenFromDifferentRelationships],
                ["Preocupação com cônjuges", caseProfile.concernWithSpouses],
                ["Risco de conflito", caseProfile.conflictRisk],
                ["Elementos internacionais", caseProfile.hasInternationalElements],
                ["Sensibilidade tributária", caseProfile.hasRelevantTaxConcerns],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Summary */}
          <div className="border border-border rounded-lg p-5 bg-card">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Mapa de riscos</h3>
            <div className="space-y-3">
              {[
                { label: "Tratados", count: treated, total: risks.length, color: "bg-success" },
                { label: "Parcialmente tratados", count: partial, total: risks.length, color: "bg-warning" },
                { label: "Não tratados", count: untreated, total: risks.length, color: "bg-destructive" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.count}/{item.total}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Top recommendations */}
            <div className="mt-5 pt-4 border-t border-border">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Top recomendações</h4>
              <div className="space-y-1.5">
                {recommendations.slice(0, 5).map((rec) => (
                  <div key={rec.id} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                    <span className="text-xs text-foreground truncate">{rec.clauseId.replace("cl_", "").replace(/_/g, " ")}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">{rec.score}pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tensions */}
        <div className="border border-border rounded-lg p-5 bg-card">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold" />
            Tensões detectadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Continuidade do comando versus sucessão patrimonial",
              "Separação entre herdeiros gestores e não gestores",
              "Proteção contra efeitos conjugais",
              "Compatibilização documental e tributária",
            ].map((tension, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded px-3 py-2">
                <span className="text-gold font-medium">{i + 1}.</span>
                {tension}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
