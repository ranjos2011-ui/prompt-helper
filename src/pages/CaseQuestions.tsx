import { useState, useEffect } from "react";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { questions } from "../data/questions";
import { clauses } from "../data/clauses";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Lightbulb, AlertTriangle, MessageSquare, ChevronDown, UserCircle } from "lucide-react";

export default function CaseQuestions() {
  const {
    caseProfile, setCaseProfile, answers, answerQuestion,
    completedQuestionIds, recommendations, alerts,
    questionNotes, saveQuestionNotes,
    generalInterviewNotes, setGeneralInterviewNotes,
    clientQualification, setClientQualification,
  } = usePatrimonialBuilderStore();
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = client qualification
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});
  const [showGeneralNotes, setShowGeneralNotes] = useState(false);

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  if (!caseProfile) return null;

  const moduleQuestions = questions.filter(q => q.moduleId === caseProfile.selectedModule);
  const showingQualification = currentIndex === -1 && !showGeneralNotes;
  const currentQ = currentIndex >= 0 ? moduleQuestions[currentIndex] : undefined;
  const isLastQuestion = currentIndex === moduleQuestions.length - 1;

  const selectedAnswer = currentQ ? answers[currentQ.id] : undefined;
  const currentNotes = currentQ ? questionNotes[currentQ.id] || "" : "";

  const relatedClauses = currentQ
    ? currentQ.relatedClauseIds.map(id => clauses.find(c => c.id === id)).filter(Boolean)
    : [];

  const toggleNotes = (qId: string) => {
    setShowNotes(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Panel - Progress */}
        <div className="w-64 border-r border-border bg-card p-4 overflow-y-auto shrink-0 hidden lg:block">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
            Entrevista ({completedQuestionIds.length}/{moduleQuestions.length})
          </h3>
          <div className="space-y-0.5">
            {/* Client qualification sidebar item */}
            <button
              onClick={() => { setCurrentIndex(-1); setShowGeneralNotes(false); }}
              className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-colors mb-1 ${
                showingQualification
                  ? "bg-primary/10 text-primary font-medium"
                  : clientQualification
                  ? "text-muted-foreground"
                  : "text-foreground/70 hover:bg-muted"
              }`}
            >
              {clientQualification ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
              ) : (
                <UserCircle className={`h-3.5 w-3.5 shrink-0 ${showingQualification ? "text-primary" : ""}`} />
              )}
              <span className="truncate flex-1">Qualificação do cliente</span>
            </button>

            <div className="border-t border-border mb-1 pt-1" />

            {moduleQuestions.map((q, i) => {
              const done = completedQuestionIds.includes(q.id);
              const isCurrent = i === currentIndex && !showGeneralNotes;
              const hasNotes = !!questionNotes[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => { setCurrentIndex(i); setShowGeneralNotes(false); }}
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
                  <span className="truncate flex-1">{q.title}</span>
                  {hasNotes && <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />}
                </button>
              );
            })}
            {/* General notes button */}
            <button
              onClick={() => setShowGeneralNotes(true)}
              className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-colors mt-2 border-t border-border pt-3 ${
                showGeneralNotes
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground/70 hover:bg-muted"
              }`}
            >
              <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${showGeneralNotes ? "text-primary" : ""}`} />
              <span>Notas gerais</span>
            </button>
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {showingQualification ? (
              /* Client qualification */
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                    Qualificação
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Qualificação do cliente
                </h2>
                <p className="text-base text-muted-foreground mb-4">
                  Registre as informações essenciais sobre o cliente e o caso antes de iniciar a entrevista.
                </p>

                <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-info mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Identifique o cliente, sua composição familiar, os bens relevantes, a estrutura societária existente e quaisquer elementos contextuais que ajudem a conduzir a entrevista.
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2 italic">
                        Essas informações serão usadas como contexto para as premissas do projeto e para a modelagem das cláusulas.
                      </p>
                    </div>
                  </div>
                </div>

                <Textarea
                  value={clientQualification}
                  onChange={(e) => setClientQualification(e.target.value)}
                  placeholder="Ex: João Silva, 68 anos, empresário. Casado em comunhão parcial com Maria (segundo casamento). Três filhos: dois do primeiro casamento (Pedro, 40, e Ana, 38) e um do atual (Lucas, 15). Holding patrimonial XYZ Participações Ltda. com imóveis, participações societárias e aplicações financeiras. Patrimônio estimado em R$ 25M. Pedro já atua na gestão; Ana e Lucas não participam. Preocupações: proteção contra cônjuges dos filhos, continuidade da gestão, equalização patrimonial sem conflito."
                  className="min-h-[240px] text-sm leading-relaxed resize-y"
                />

                <div className="flex items-center justify-end pt-6 border-t border-border mt-6">
                  <button
                    onClick={() => setCurrentIndex(0)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Iniciar entrevista
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : showGeneralNotes ? (
              /* General interview notes */
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                    Consolidação
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Notas gerais da entrevista
                </h2>
                <p className="text-base text-muted-foreground mb-6">
                  Registre impressões gerais, conflitos percebidos, tensões familiares, inconsistências e cautelas estratégicas.
                </p>
                <Textarea
                  value={generalInterviewNotes}
                  onChange={(e) => setGeneralInterviewNotes(e.target.value)}
                  placeholder="Registre aqui observações gerais da entrevista e elementos sensíveis do caso que possam afetar a arquitetura patrimonial, sucessória, societária ou tributária."
                  className="min-h-[240px] text-sm leading-relaxed resize-y"
                />
                <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
                  <button
                    onClick={() => { setShowGeneralNotes(false); setCurrentIndex(moduleQuestions.length - 1); }}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Voltar às perguntas
                  </button>
                  <a
                    href={`/case/${caseProfile.id}/premises`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Ver premissas do projeto
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : currentQ ? (
              /* Question */
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                    {currentQ.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Pergunta {currentIndex + 1} de {moduleQuestions.length}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  {currentQ.title}
                </h2>
                <p className="text-base text-foreground mb-4">
                  {currentQ.prompt}
                </p>

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

                {/* Lawyer notes toggle */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleNotes(currentQ.id)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="font-medium">Observações do advogado</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${showNotes[currentQ.id] ? "rotate-180" : ""}`} />
                    {currentNotes && !showNotes[currentQ.id] && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        Com notas
                      </span>
                    )}
                  </button>
                  {showNotes[currentQ.id] && (
                    <div className="mt-3">
                      <Textarea
                        value={currentNotes}
                        onChange={(e) => saveQuestionNotes(currentQ.id, e.target.value)}
                        placeholder="Registre aqui nuances da entrevista, preferências do cliente, conflitos percebidos, exceções familiares, preocupações sensíveis e qualquer detalhe relevante para a modelagem jurídica."
                        className="min-h-[100px] text-sm resize-y"
                      />
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {currentIndex === 0 ? "Qualificação" : "Anterior"}
                  </button>
                  {isLastQuestion ? (
                    <button
                      onClick={() => setShowGeneralNotes(true)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Notas gerais
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentIndex(Math.min(moduleQuestions.length - 1, currentIndex + 1))}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Panel - Insights */}
        <div className="w-72 border-l border-border bg-card p-4 overflow-y-auto shrink-0 hidden xl:block">
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
