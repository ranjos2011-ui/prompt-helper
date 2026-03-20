import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { clauses } from "../data/clauses";
import {
  priorityLabels,
  priorityColors,
  categoryLabels,
  documentTypeLabels,
  documentHierarchyTierLabels,
  documentHierarchyTierDescriptions,
  documentHierarchyTierColors,
  clauseHierarchyMap,
} from "../lib/labels";
import { DocumentHierarchyTier } from "../types/enums";
import { CasePremisesSummaryPanel } from "../components/CasePremisesSummaryPanel";
import { FileText, AlertCircle, ChevronRight, Crown, Building2, Handshake, Shield, Settings } from "lucide-react";

const tierOrder: DocumentHierarchyTier[] = [
  "central",
  "estrutural_contrato",
  "complementar_acordo",
  "instrumento_complementar",
  "implementacao",
];

const tierIcons: Record<DocumentHierarchyTier, typeof Crown> = {
  central: Crown,
  estrutural_contrato: Building2,
  complementar_acordo: Handshake,
  instrumento_complementar: Shield,
  implementacao: Settings,
};

export default function CaseClauses() {
  const { caseProfile, setCaseProfile, recommendations } = usePatrimonialBuilderStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  const activeClauses = useMemo(() => {
    return recommendations
      .map((rec) => {
        const clause = clauses.find((c) => c.id === rec.clauseId);
        return clause ? { clause, rec } : null;
      })
      .filter(Boolean) as { clause: (typeof clauses)[0]; rec: (typeof recommendations)[0] }[];
  }, [recommendations]);

  // Group by hierarchy tier
  const groupedByTier = useMemo(() => {
    const groups: Record<DocumentHierarchyTier, typeof activeClauses> = {
      central: [],
      estrutural_contrato: [],
      complementar_acordo: [],
      instrumento_complementar: [],
      implementacao: [],
    };

    for (const item of activeClauses) {
      const tier = clauseHierarchyMap[item.clause.id] || "instrumento_complementar";
      groups[tier].push(item);
    }

    return groups;
  }, [activeClauses]);

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Arquitetura de Cláusulas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeClauses.length} cláusulas organizadas por hierarquia documental
          </p>
        </div>

        <CasePremisesSummaryPanel />

        {/* Grouped clauses */}
        <div className="space-y-8">
          {tierOrder.map((tier) => {
            const items = groupedByTier[tier];
            if (items.length === 0) return null;

            const TierIcon = tierIcons[tier];
            const isCentral = tier === "central";

            return (
              <section key={tier}>
                {/* Tier header */}
                <div className={`flex items-center gap-3 mb-4 ${isCentral ? "pb-3 border-b-2 border-primary/30" : "pb-2 border-b border-border"}`}>
                  <div className={`p-1.5 rounded-md ${isCentral ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <TierIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className={`font-display font-semibold ${isCentral ? "text-lg text-foreground" : "text-sm text-foreground"}`}>
                      {documentHierarchyTierLabels[tier]}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">{documentHierarchyTierDescriptions[tier]}</p>
                  </div>
                  <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? "cláusula" : "cláusulas"}
                  </span>
                </div>

                {/* Clause cards */}
                <div className="space-y-3">
                  {items.map(({ clause, rec }) => (
                    <div
                      key={clause.id}
                      className={`border rounded-lg bg-card overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-[0.997] ${
                        isCentral
                          ? "border-primary/30 ring-1 ring-primary/10 hover:border-primary/40"
                          : "border-border hover:border-primary/20"
                      }`}
                      onClick={() => navigate(`/case/${caseProfile?.id || "case-001"}/clauses/${clause.id}`)}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {isCentral && (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                  Central
                                </span>
                              )}
                              <h3 className={`font-display font-semibold text-foreground ${isCentral ? "text-lg" : "text-base"}`}>
                                {clause.name}
                              </h3>
                              {rec.needsAttention && <AlertCircle className="h-4 w-4 text-warning" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{clause.objective}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityColors[rec.priority]}`}>
                              {priorityLabels[rec.priority]}
                            </span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {rec.score}pts
                            </span>
                          </div>
                        </div>

                        {isCentral && (
                          <div className="bg-primary/[0.03] border border-primary/10 rounded p-3 mb-3">
                            <p className="text-xs text-foreground/80">{rec.reason}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3 w-3 text-primary" />
                            <span className="text-foreground font-medium">{documentTypeLabels[rec.suggestedDocument]}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{categoryLabels[clause.category]}</span>
                          {clause.sensitivityLevel === "alto" && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-warning text-[10px] font-medium">Sensível</span>
                            </>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {isCentral ? "Abrir micro-builder da cláusula" : "Ver detalhe"}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {activeClauses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Nenhuma cláusula encontrada.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
