import { usePatrimonialBuilderStore } from "../../store/usePatrimonialBuilderStore";
import { generateProjectPremises } from "../../lib/premisesEngine";
import { CheckCircle2 } from "lucide-react";

export function CasePremisesSummaryPanel() {
  const { caseProfile, answers, questionNotes } = usePatrimonialBuilderStore();
  if (!caseProfile) return null;

  const premises = generateProjectPremises(caseProfile, answers, questionNotes);

  return (
    <div className="border border-border rounded-lg bg-card p-5 mb-6">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
        Premissas do caso
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {premises.slice(0, 8).map((p) => (
          <div key={p.id} className="space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium truncate">
                {p.title}
              </span>
            </div>
            <p className="text-xs text-foreground font-medium">{p.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
