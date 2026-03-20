import { ClauseDecisionImpact, ClauseDetailConfig } from "../../types/clauseBuilder";
import { AlertTriangle, Info, Zap } from "lucide-react";

interface Props {
  config: ClauseDetailConfig;
  answers: Record<string, string>;
}

export function ClauseImpactPanel({ config, answers }: Props) {
  const allImpacts: (ClauseDecisionImpact & { source: string })[] = [];

  for (const q of config.decisionQuestions) {
    const answer = answers[q.id];
    if (answer && answer !== "indefinido" && q.impacts[answer]) {
      for (const impact of q.impacts[answer]) {
        allImpacts.push({ ...impact, source: q.title });
      }
    }
  }

  const grouped = {
    societario: allImpacts.filter((i) => i.type === "societario"),
    sucessorio: allImpacts.filter((i) => i.type === "sucessorio"),
    patrimonial: allImpacts.filter((i) => i.type === "patrimonial"),
    documental: allImpacts.filter((i) => i.type === "documental"),
    tributario: allImpacts.filter((i) => i.type === "tributario"),
  };

  const typeLabels: Record<string, string> = {
    societario: "Impactos Societários",
    sucessorio: "Impactos Sucessórios",
    patrimonial: "Impactos Patrimoniais",
    documental: "Impactos Documentais",
    tributario: "Reflexos Tributários",
  };

  const hasAnyImpact = allImpacts.length > 0;

  if (!hasAnyImpact) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Info className="h-8 w-8 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Responda as perguntas de customização para visualizar os impactos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, impacts]) => {
        if (impacts.length === 0) return null;
        return (
          <div key={type}>
            <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              {typeLabels[type]}
            </h3>
            <div className="space-y-2">
              {impacts.map((impact, i) => (
                <div
                  key={i}
                  className={`rounded-lg border px-4 py-3 ${
                    impact.severity === "critical"
                      ? "bg-destructive/5 border-destructive/15"
                      : impact.severity === "warning"
                      ? "bg-warning/5 border-warning/15"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {impact.severity === "critical" ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                    ) : impact.severity === "warning" ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                    ) : (
                      <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-foreground">{impact.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Fonte: {impact.source}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
