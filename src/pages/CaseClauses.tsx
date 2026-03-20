import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { mockCase } from "../data/mockCase";
import { clauses } from "../data/clauses";
import { priorityLabels, priorityColors, categoryLabels, documentTypeLabels } from "../lib/labels";
import { ClauseCategory, ClausePriority } from "../types/enums";
import { FileText, Filter, AlertCircle, Link2, Ban, ChevronRight } from "lucide-react";

export default function CaseClauses() {
  const { caseProfile, setCaseProfile, recommendations } = usePatrimonialBuilderStore();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<ClauseCategory | "all">("all");
  const [filterPriority, setFilterPriority] = useState<ClausePriority | "all">("all");

  useEffect(() => {
    if (!caseProfile) setCaseProfile(mockCase);
  }, [caseProfile, setCaseProfile]);

  const activeRecs = recommendations;
  const activeClauses = activeRecs
    .map(rec => {
      const clause = clauses.find(c => c.id === rec.clauseId);
      return clause ? { clause, rec } : null;
    })
    .filter(Boolean) as { clause: typeof clauses[0]; rec: typeof recommendations[0] }[];

  const filtered = activeClauses.filter(({ clause, rec }) => {
    if (filterCategory !== "all" && clause.category !== filterCategory) return false;
    if (filterPriority !== "all" && rec.priority !== filterPriority) return false;
    return true;
  });

  const categories = [...new Set(activeClauses.map(a => a.clause.category))];
  const priorities = [...new Set(activeClauses.map(a => a.rec.priority))];

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Cláusulas Recomendadas</h1>
            <p className="text-sm text-muted-foreground mt-1">{activeClauses.length} cláusulas ativas para este caso</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ClauseCategory | "all")}
            className="text-xs border border-border rounded px-2.5 py-1.5 bg-card text-foreground"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{categoryLabels[cat]}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as ClausePriority | "all")}
            className="text-xs border border-border rounded px-2.5 py-1.5 bg-card text-foreground"
          >
            <option value="all">Todas as prioridades</option>
            {priorities.map(p => (
              <option key={p} value={p}>{priorityLabels[p]}</option>
            ))}
          </select>
        </div>

        {/* Clause cards */}
        <div className="space-y-3">
          {filtered.map(({ clause, rec }) => (
            <div key={clause.id} className="border border-border rounded-lg bg-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">{clause.name}</h3>
                      {rec.needsAttention && (
                        <AlertCircle className="h-4 w-4 text-warning" />
                      )}
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

                <div className="bg-muted/30 rounded p-3 mb-3">
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Documento sugerido</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <FileText className="h-3 w-3 text-primary" />
                      <span className="text-foreground font-medium">{documentTypeLabels[rec.suggestedDocument]}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Categoria</span>
                    <p className="text-foreground mt-1">{categoryLabels[clause.category]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Sensibilidade</span>
                    <p className="text-foreground mt-1 capitalize">{clause.sensitivityLevel}</p>
                  </div>
                </div>

                {/* Dependencies & Incompatibilities */}
                {(clause.dependencies.length > 0 || clause.incompatibilities.length > 0) && (
                  <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border">
                    {clause.dependencies.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Link2 className="h-3 w-3" />
                        Depende de: {clause.dependencies.map(d => d.replace("cl_", "").replace(/_/g, " ")).join(", ")}
                      </div>
                    )}
                    {clause.incompatibilities.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <Ban className="h-3 w-3" />
                        Incompatível com: {clause.incompatibilities.join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {/* Alerts */}
                {clause.alerts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    {clause.alerts.map((alert, i) => (
                      <p key={i} className="text-xs text-warning flex items-start gap-1.5">
                        <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                        {alert}
                      </p>
                    ))}
                  </div>
                )}

                {rec.allocationRationale && (
                  <p className="text-[11px] text-muted-foreground/70 mt-3 italic">{rec.allocationRationale}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Nenhuma cláusula encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
