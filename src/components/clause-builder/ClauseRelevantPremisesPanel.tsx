import { usePatrimonialBuilderStore } from "../../store/usePatrimonialBuilderStore";
import { generateProjectPremises } from "../../lib/premisesEngine";
import { Clause } from "../../types/clause";
import { MessageSquare, Target } from "lucide-react";

interface Props {
  clause: Clause;
}

const clausePremiseMapping: Record<string, string[]> = {
  cl_sucessao_quotas: ["prem_controle", "prem_herdeiros", "prem_gestao", "prem_conjuges", "prem_liquidez", "prem_governanca_morte"],
  cl_usufruto: ["prem_renda", "prem_controle", "prem_tributario"],
  cl_reversao: ["prem_controle", "prem_herdeiros"],
  cl_incomunicabilidade: ["prem_conjuges"],
  cl_impenhorabilidade: ["prem_conjuges"],
  cl_inalienabilidade: ["prem_conjuges"],
  cl_restricao_cessao: ["prem_conjuges", "prem_controle"],
  cl_vedacao_ingresso_gestao: ["prem_herdeiros", "prem_gestao"],
  cl_elegibilidade_admin: ["prem_gestao", "prem_herdeiros"],
  cl_distincao_gestor_investidor: ["prem_herdeiros", "prem_gestao"],
  cl_reserva_voto: ["prem_controle"],
  cl_quorum_qualificado: ["prem_controle"],
  cl_conselho_familiar: ["prem_herdeiros", "prem_governanca_morte"],
  cl_admin_interina: ["prem_governanca_morte", "prem_gestao"],
  cl_liquidacao_haveres: ["prem_liquidez"],
  cl_valuation: O["prem_liquidez"],
  cl_compra_compulsoria: ["prem_liquidez"],
  cl_saida_dissidente: ["prem_liquidez"],
  cl_mediacao: ["prem_objetivo"],
  cl_arbitragem: ["prem_objetivo"],
  cl_memorando_tributario: ["prem_tributario"],
  cl_integracao_internacional: ["prem_internacional"],
};

export function ClauseRelevantPremisesPanel({ clause }: Props) {
  const { caseProfile, answers, questionNotes } = usePatrimonialBuilderStore();
  if (!caseProfile) return null;

  const allPremises = generateProjectPremises(caseProfile, answers, questionNotes);
  const relevantIds = clausePremiseMapping[clause.id] || [];
  const relevantPremises = allPremises.filter((p) => relevantIds.includes(p.id));

  if (relevantPremises.length === 0) return null;

  return (
    <div className="mb-5">
      <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
        <Target className="h-3 w-3" />
        Premissas relevantes
      </h3>
      <div className="space-y-2">
        {relevantPremises.map((p) => (
          <div key={p.id} className="bg-primary/5 border border-primary/10 rounded-md p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-0.5">
              {p.title}
            </p>
            <p className="text-xs text-foreground">{p.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{p.interpretation}</p>
            {p.notesSummary && (
              <div className="flex items-start gap-1 mt-1.5">
                <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground italic">"{p.notesSummary}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
