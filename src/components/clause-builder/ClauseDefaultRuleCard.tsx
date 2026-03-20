import { ClauseDetailConfig } from "../../types/clauseBuilder";
import { AlertTriangle, BookOpen, ShieldCheck, Info } from "lucide-react";

interface Props {
  config: ClauseDetailConfig;
}

export function ClauseDefaultRuleCard({ config }: Props) {
  return (
    <div className="space-y-6">
      {/* Default Rule */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-base font-semibold text-foreground mb-1">Regra geral do Código Civil</h3>
            <p className="text-xs text-muted-foreground">O que acontece por padrão na ausência de customização</p>
          </div>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{config.defaultRuleText}</p>
      </div>

      {/* Explanation */}
      {config.defaultRuleExplanation && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80 leading-relaxed">{config.defaultRuleExplanation}</p>
          </div>
        </div>
      )}

      {/* Why it matters */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Por que essa cláusula importa
        </h3>
        <ul className="space-y-2">
          {config.whyItMatters.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Problems avoided */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Problemas que essa cláusula evita
        </h3>
        <ul className="space-y-2">
          {config.problemsAvoided.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
