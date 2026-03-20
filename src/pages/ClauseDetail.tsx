import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { clauses } from "../data/clauses";
import { clauseDetailConfigs } from "../data/clauseDetails";
import { computeActivatedBlocks, generateDraftPreview, computeCustomAlerts } from "../lib/clauseDraftEngine";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClauseDetailHeader } from "../components/clause-builder/ClauseDetailHeader";
import { ClauseDefaultRuleCard } from "../components/clause-builder/ClauseDefaultRuleCard";
import { ClauseDecisionWizard } from "../components/clause-builder/ClauseDecisionWizard";
import { ClauseImpactPanel } from "../components/clause-builder/ClauseImpactPanel";
import { ClauseDraftPreview } from "../components/clause-builder/ClauseDraftPreview";
import { ClauseDocumentArchitecturePanel } from "../components/clause-builder/ClauseDocumentArchitecturePanel";
import { ClauseContextSidebar } from "../components/clause-builder/ClauseContextSidebar";
import { ClauseChoiceSummaryPanel } from "../components/clause-builder/ClauseChoiceSummaryPanel";
import { toast } from "sonner";

export default function ClauseDetail() {
  const { id, clauseId } = useParams<{ id: string; clauseId: string }>();
  const navigate = useNavigate();
  const {
    caseProfile,
    setCaseProfile,
    recommendations,
    risks,
    clauseDraftStates,
    answerClauseDecisionQuestion,
    saveClauseCustomization,
  } = usePatrimonialBuilderStore();

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  const clause = clauses.find((c) => c.id === clauseId);
  const recommendation = recommendations.find((r) => r.clauseId === clauseId);
  const config = clauseId ? clauseDetailConfigs[clauseId] : undefined;
  const draftState = clauseId ? clauseDraftStates[clauseId] : undefined;
  const answers = draftState?.answers || {};

  const activatedBlockIds = useMemo(() => {
    if (!config) return [];
    return computeActivatedBlocks(config, answers);
  }, [config, answers]);

  const draftPreview = useMemo(() => {
    if (!config) return "";
    return generateDraftPreview(config, activatedBlockIds);
  }, [config, activatedBlockIds]);

  const customAlerts = useMemo(() => {
    if (!config) return [];
    return computeCustomAlerts(config, answers);
  }, [config, answers]);

  const hasChanges = Object.keys(answers).length > 0;

  if (!clause || !recommendation) {
    return (
      <AppShell>
        <div className="p-6 text-center text-muted-foreground">
          <p>Cláusula não encontrada.</p>
          <button onClick={() => navigate(`/case/${id}/clauses`)} className="text-primary text-sm mt-2 underline">
            Voltar para cláusulas
          </button>
        </div>
      </AppShell>
    );
  }

  const handleAnswer = (questionId: string, value: string) => {
    if (clauseId) {
      answerClauseDecisionQuestion(clauseId, questionId, value);
    }
  };

  const handleSave = () => {
    if (clauseId) {
      saveClauseCustomization(clauseId);
      toast.success("Customização salva com sucesso.");
    }
  };

  return (
    <AppShell>
      <ClauseDetailHeader
        clause={clause}
        recommendation={recommendation}
        caseId={id || ""}
        onSave={handleSave}
        hasChanges={hasChanges}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar */}
          <aside className="col-span-3">
            <div className="sticky top-6">
              {caseProfile && (
                <ClauseContextSidebar
                  caseProfile={caseProfile}
                  clause={clause}
                  recommendation={recommendation}
                  risks={risks}
                />
              )}
            </div>
          </aside>

          {/* Center */}
          <main className="col-span-6">
            {config ? (
              <Tabs defaultValue="regra_padrao">
                <TabsList className="w-full justify-start bg-muted/30 border border-border rounded-lg p-1 mb-6">
                  <TabsTrigger value="regra_padrao" className="text-xs">Regra padrão</TabsTrigger>
                  <TabsTrigger value="decisoes" className="text-xs">Decisões</TabsTrigger>
                  <TabsTrigger value="impactos" className="text-xs">Impactos</TabsTrigger>
                  <TabsTrigger value="redacao" className="text-xs">Redação</TabsTrigger>
                  <TabsTrigger value="arquitetura" className="text-xs">Arquitetura</TabsTrigger>
                </TabsList>

                <TabsContent value="regra_padrao">
                  <ClauseDefaultRuleCard config={config} />
                </TabsContent>
                <TabsContent value="decisoes">
                  <ClauseDecisionWizard
                    questions={config.decisionQuestions}
                    answers={answers}
                    onAnswer={handleAnswer}
                  />
                </TabsContent>
                <TabsContent value="impactos">
                  <ClauseImpactPanel config={config} answers={answers} />
                </TabsContent>
                <TabsContent value="redacao">
                  <ClauseDraftPreview
                    config={config}
                    activatedBlockIds={activatedBlockIds}
                    draftPreview={draftPreview}
                  />
                </TabsContent>
                <TabsContent value="arquitetura">
                  <ClauseDocumentArchitecturePanel
                    config={config}
                    activatedBlockIds={activatedBlockIds}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground mb-1">Builder de customização ainda não disponível para esta cláusula.</p>
                <p className="text-xs text-muted-foreground/60">Em breve será possível customizar todas as cláusulas.</p>
              </div>
            )}
          </main>

          {/* Right sidebar */}
          <aside className="col-span-3">
            <div className="sticky top-6">
              {config && (
                <ClauseChoiceSummaryPanel
                  config={config}
                  answers={answers}
                  activatedBlockIds={activatedBlockIds}
                  customAlerts={customAlerts}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
