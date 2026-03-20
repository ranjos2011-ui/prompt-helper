import { CommonProblem } from "../../types/clauseBuilder";
import { AlertTriangle, TrendingDown, ShieldAlert, Zap } from "lucide-react";

interface Props {
  problems: CommonProblem[];
}

const severityConfig = {
  high: {
    border: "border-destructive/20",
    bg: "bg-destructive/5",
    icon: "text-destructive",
    badge: "bg-destructive/10 text-destructive",
    badgeLabel: "Alto impacto",
  },
  medium: {
    border: "border-warning/20",
    bg: "bg-warning/5",
    icon: "text-warning",
    badge: "bg-warning/10 text-warning",
    badgeLabel: "Impacto moderado",
  },
  low: {
    border: "border-muted-foreground/20",
    bg: "bg-muted/30",
    icon: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
    badgeLabel: "Impacto menor",
  },
};

const icons = [AlertTriangle, TrendingDown, ShieldAlert, Zap, AlertTriangle, TrendingDown, ShieldAlert];

export function ClauseProblemCards({ problems }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-1">
          Problemas do padrão legal
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Seguir apenas a regra legal padrão em holdings patrimoniais pode gerar os seguintes problemas práticos.
        </p>
      </div>

      <div className="grid gap-3">
        {problems.map((problem, i) => {
          const cfg = severityConfig[problem.severity];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={problem.id}
              className={`border ${cfg.border} ${cfg.bg} rounded-lg p-5 transition-shadow hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className={`shrink-0 mt-0.5 ${cfg.icon}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold text-foreground">{problem.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                      {cfg.badgeLabel}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
