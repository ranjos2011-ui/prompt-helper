import { useState, useEffect } from "react";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { questions } from "../data/questions";
import { clauses } from "../data/clauses";
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Lightbulb, AlertTriangle } from "lucide-react";

export default function CaseQuestions() {
  const { caseProfile, setCaseProfile, answers, answerQuestion, completedQuestionIds, recommendations, alerts } = usePatrimonialBuilderStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  if (!caseProfile) return null;

  const moduleQuestions = questions.filter(q => q.moduleId === caseProfile.selectedModule);
  const currentQ = moduleQuestions[currentIndex];
  if (!currentQ) return null;

  const isAnswered = !!answers[currentQ.id];
  const selectedAnswer = answers[currentQ.id];

  const relatedClauses = currentQ.relatedClauseIds
    .map(id => clauses.find(c => c.id === id))
    .filter(Boolean);

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Panel - Progress */}
        <div className="w-64 border-r border-border bg-card p-4 overflow-y-auto shrink-0 hidden lg:block">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
            Perguntas ({completedQuestionIds.length}/{moduleQuestions.length})
          </h3>
          <div className="space-y-0.5">
            {moduleQuestions.map((q, i) => {
              const done = completedQuestionIds.includes(q.id);
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-colors ${
                    isCurrent
                      ? "bg-primary/10 text-primary font-medium"
                      : done
                      ? "text-muted-foreground"
                      : "text-foreground/70 hover:bg-muted"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  ) : (
                    <div className={`h-3.5 w-3.5 rounded-full border shrink-0 ${
                      isCurrent ? "border-primary bg-primary/20" : "border-border"
                    }`} />
                  )}
                  <span className="truncate">{q.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center - Question */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                {currentQ.category}
              </span>
              <span className="text-xs text-muted-foreground">
                Pergunta {currentIndex + 1} de {moduleQuestions.length}
              </span>
            </div>

            {/* Question */}
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              {currentQ.title}
            </h2>
            <p className="text-base text-foreground mb-4">
              {currentQ.prompt}
            </p>

            {/* Explanation */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-info mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2 italic">{currentQ.impactSummary}</p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => answerQuestion(currentQ.id, opt.value)}
                  className={`w-full text-left border rounded-lg p-4 transition-all ${
                    selectedAnswer === opt.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30 bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      selectedAnswer === opt.value ? "border-primary" : "border-border"
                    }`}>
                      {selectedAnswer === opt.value && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{opt.label}</span>
                      {opt.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {currentQ.allowsUnknown && (
                <button
                  onClick={() => answerQuestion(currentQ.id, "nao_sei")}
                  className={`w-full text-left border rounded-lg p-4 transition-all ${
                    selectedAnswer === "nao_sei"
                      ? "border-primary bg-primary/5"
                      : "border-dashed border-border hover:border-primary/30 bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      selectedAnswer === "nao_sei" ? "border-primary" : "border-border"
                    }`}>
                      {selectedAnswer === "nao_sei" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground italic">Não sei / preciso avaliar</span>
                  </div>
                </button>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(moduleQuestions.length - 1, currentIndex + 1))}
                disabled={currentIndex === moduleQuestions.length - 1}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-30 transition-colors"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Insights */}
        <div className="w-72 border-l border-border bg-card p-4 overflow-y-auto shrink-0 hidden xl:block">
          {/* Related clauses */}
          {relatedClauses.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3 w-3" />
                Cláusulas relacionadas
              </h4>
              <div className="space-y-1.5">
                {relatedClauses.map((cl) => cl && (
                  <div key={cl.id} className="bg-muted/50 rounded px-3 py-2">
                    <p className="text-xs font-medium text-foreground">{cl.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{cl.objective}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-warning" />
                Alertas ativos
              </h4>
              <div className="space-y-1.5">
                {alerts.slice(0, 4).map((alert, i) => (
                  <div key={i} className="bg-warning/5 border border-warning/20 rounded px-3 py-2">
                    <p className="text-xs text-muted-foreground">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
