import { ClauseDetailConfig } from "../../types/clauseBuilder";
import { documentTypeLabels } from "../../lib/labels";
import { CheckCircle2, Circle, AlertCircle, FileText, Layers } from "lucide-react";

interface Props {
  config: ClauseDetailConfig;
  answers: Record<string, string>;
  activatedBlockIds: string[];
  customAlerts: string[];
  selectedTemplateId?: string | null;
  selectedComplementaryIds?: string[];
}

export function ClauseChoiceSummaryPanel({
  config,
  answers,
  activatedBlockIds,
  customAlerts,
  selectedTemplateId,
  selectedComplementaryIds = [],
}: Props) {
  const answeredCount = Object.keys(answers).filter((k) => answers[k] && answers[k] !== "indefinido").length;
  const totalQuestions = config.decisionQuestions.length;
  const selectedTemplate = selectedTemplateId
    ? config.optionTemplates.find((t) => t.id === selectedTemplateId)
    : null;
  const complementaryTemplates = config.optionTemplates.filter(
    (t) => t.isComplementary && selectedComplementaryIds.includes(t.id)
  );

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

      {/* Selected template */}
      {selectedTemplate && (
        <div>
          <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
            <Layers className="h-3 w-3" />
            Modelo selecionado
          </h3>
          <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-5 w-5 rounded bg-primary text-primary-foreground text-[10px] font-bold">
                {selectedTemplate.letter}
              </span>
              <span className="text-xs font-medium text-foreground">{selectedTemplate.title}</span>
            </div>
          </div>
          {complementaryTemplates.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {complementaryTemplates.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center justify-center h-4 w-4 rounded bg-muted text-[9px] font-bold">
                    {t.letter}
                  </span>
                  {t.title}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
