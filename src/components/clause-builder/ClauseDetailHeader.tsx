import { Clause } from "../../types/clause";
import { Recommendation } from "../../types/recommendation";
import { priorityLabels, priorityColors, categoryLabels, documentTypeLabels } from "../../lib/labels";
import { ArrowLeft, Save, Shield, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  clause: Clause;
  recommendation: Recommendation;
  caseId: string;
  onSave: () => void;
  hasChanges: boolean;
}

export function ClauseDetailHeader({ clause, recommendation, caseId, onSave, hasChanges }: Props) {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link
              to={`/case/${caseId}/clauses`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="h-3 w-3" />
              Voltar para cláusulas
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <h1 className="font-display text-xl font-bold text-foreground truncate">{clause.name}</h1>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityColors[recommendation.priority]}`}>
                {priorityLabels[recommendation.priority]}
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                {recommendation.score}pts
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{clause.objective}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-8">
            <div className="flex flex-col items-end gap-1 mr-3 text-[10px] text-muted-foreground">
              <span>{categoryLabels[clause.category]}</span>
              <span>Sensibilidade: {clause.sensitivityLevel}</span>
              <span>Doc: {documentTypeLabels[recommendation.suggestedDocument]}</span>
            </div>
            <button
              onClick={onSave}
              disabled={!hasChanges}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Save className="h-4 w-4" />
              Salvar customização
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
