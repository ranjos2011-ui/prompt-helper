import { ClauseDetailConfig } from "../../types/clauseBuilder";
import { documentTypeLabels } from "../../lib/labels";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface Props {
  config: ClauseDetailConfig;
  answers: Record<string, string>;
  activatedBlockIds: string[];
  customAlerts: string[];
}

export function ClauseChoiceSummaryPanel({ config, answers, activatedBlockIds, customAlerts }: Props) {
  const answeredCount = Object.keys(answers).filter((k) => answers[k] && answers[k] !== "indefinido").length;
  const totalQuestions = config.decisionQuestions.length;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div>
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Progresso</h3>
        <div className="bg-muted/30 border border-border rounded-lg p-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Decisões</span>
            <span>{answeredCount}/{totalQuestions}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Choices summary */}
      <div>
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Decisões tomadas</h3>
        <div className="space-y-1.5">
          {config.decisionQuestions.map((q) => {
            const answer = answers[q.id];
            const option = answer ? q.options.find((o) => o.value === answer) : null;
            const isAnswered = answer && answer !== "indefinido";

            return (
              <div key={q.id} className="flex items-start gap-2 text-xs">
                {isAnswered ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className={`truncate ${isAnswered ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {q.title}
                  </p>
                  {option && (
                    <p className="text-[10px] text-primary truncate">{option.label}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activated blocks */}
      <div>
        <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
          Blocos de redação ativos ({activatedBlockIds.length})
        </h3>
        <div className="space-y-1">
          {config.draftBlocks
            .filter((b) => activatedBlockIds.includes(b.id))
            .map((block) => (
              <div key={block.id} className="text-xs text-foreground/70 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                {block.label}
              </div>
            ))}
        </div>
      </div>

      {/* Alerts */}
      {customAlerts.length > 0 && (
        <div>
          <h3 className="text-[10px] uppercase tracking-wider text-warning font-medium mb-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Alertas
          </h3>
          <div className="space-y-1.5">
            {customAlerts.map((alert, i) => (
              <p key={i} className="text-[11px] text-warning leading-relaxed">{alert}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
