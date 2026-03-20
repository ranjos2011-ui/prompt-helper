import { ClauseDecisionQuestion } from "../../types/clauseBuilder";
import { AlertCircle, ChevronDown, ChevronUp, Info, HelpCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  questions: ClauseDecisionQuestion[];
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
}

export function ClauseDecisionWizard({ questions, answers, onAnswer }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Responda as perguntas abaixo para customizar a cláusula. Cada decisão altera a redação, os impactos e a alocação documental.
      </p>
      {questions.map((q, idx) => (
        <DecisionQuestionCard
          key={q.id}
          question={q}
          index={idx + 1}
          answer={answers[q.id]}
          onAnswer={(val) => onAnswer(q.id, val)}
        />
      ))}
    </div>
  );
}

function DecisionQuestionCard({
  question,
  index,
  answer,
  onAnswer,
}: {
  question: ClauseDecisionQuestion;
  index: number;
  answer?: string;
  onAnswer: (val: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const impacts = answer ? question.impacts[answer] || [] : [];

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden transition-shadow hover:shadow-sm">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground mb-0.5">{question.title}</h4>
            <p className="text-sm text-muted-foreground">{question.prompt}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 shrink-0"
            title="Mais informações"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        {expanded && (
          <div className="bg-muted/30 rounded p-3 mb-3 text-xs text-muted-foreground flex items-start gap-2">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
            {question.explanation}
          </div>
        )}

        {/* Options */}
        <div className="space-y-2 ml-9">
          {question.options.map((opt) => {
            const selected = answer === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onAnswer(opt.value)}
                className={`w-full text-left rounded-md border px-4 py-3 transition-all active:scale-[0.98] ${
                  selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3.5 w-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      selected ? "border-primary" : "border-muted-foreground/30"
                    }`}
                  >
                    {selected && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-sm ${selected ? "font-medium text-foreground" : "text-foreground/80"}`}>
                    {opt.label}
                  </span>
                </div>
                {opt.description && (
                  <p className="text-xs text-muted-foreground mt-1 ml-5.5 pl-[22px]">{opt.description}</p>
                )}
              </button>
            );
          })}
          {question.allowsUndefined && (
            <button
              onClick={() => onAnswer("indefinido")}
              className={`w-full text-left rounded-md border px-4 py-2.5 transition-all active:scale-[0.98] ${
                answer === "indefinido"
                  ? "border-muted-foreground/50 bg-muted/50"
                  : "border-border/50 hover:border-muted-foreground/30 hover:bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-3.5 w-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    answer === "indefinido" ? "border-muted-foreground" : "border-muted-foreground/20"
                  }`}
                >
                  {answer === "indefinido" && <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />}
                </div>
                <span className="text-xs text-muted-foreground italic">Ainda não definido</span>
              </div>
            </button>
          )}
        </div>

        {/* Alert */}
        {question.alert && answer && answer !== "indefinido" && (
          <div className="mt-3 ml-9 flex items-start gap-2 text-xs text-warning bg-warning/5 border border-warning/10 rounded p-2.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            {question.alert}
          </div>
        )}

        {/* Impacts */}
        {impacts.length > 0 && (
          <div className="mt-3 ml-9 space-y-1.5">
            {impacts.map((impact, i) => (
              <div
                key={i}
                className={`text-xs rounded px-3 py-2 flex items-start gap-2 ${
                  impact.severity === "critical"
                    ? "bg-destructive/5 text-destructive border border-destructive/10"
                    : impact.severity === "warning"
                    ? "bg-warning/5 text-warning border border-warning/10"
                    : "bg-muted/50 text-muted-foreground border border-border/50"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider font-medium shrink-0 mt-0.5 opacity-70">
                  {impact.type}
                </span>
                <span>{impact.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
