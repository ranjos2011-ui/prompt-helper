import { Risk } from "../types/risk";
import { Recommendation } from "../types/recommendation";
import { Clause } from "../types/clause";
import { CaseProfile } from "../types/case";

export function recalculateRisks(
  allRisks: Risk[],
  recommendations: Recommendation[],
  allClauses: Clause[],
  caseProfile: CaseProfile
): Risk[] {
  return allRisks.map((risk) => {
    const activeClausesForRisk = recommendations.filter((r) => {
      const clause = allClauses.find((c) => c.id === r.clauseId);
      return clause?.coveredRiskIds.includes(risk.id);
    });

    // Special heuristics
    if (risk.id === "r_sensibilidade_tributaria") {
      const hasTaxMemo = recommendations.some(r => r.clauseId === "cl_memorando_tributario");
      if (!hasTaxMemo && caseProfile.hasRelevantTaxConcerns === "sim") {
        return { ...risk, status: "nao_tratado" as const, linkedClauseIds: [] };
      }
      if (hasTaxMemo) {
        return { ...risk, status: "tratado" as const, linkedClauseIds: ["cl_memorando_tributario"] };
      }
    }

    if (risk.id === "r_inconsistencia_documental") {
      const hasCompat = recommendations.some(r => ["cl_compat_doacao", "cl_compat_protocolo"].includes(r.clauseId));
      const hasMemo = recommendations.some(r => r.clauseId === "cl_memorando_estrategico");
      if (hasCompat && hasMemo) {
        return { ...risk, status: "tratado" as const, linkedClauseIds: activeClausesForRisk.map(r => r.clauseId) };
      }
      if (hasCompat || hasMemo) {
        return { ...risk, status: "parcialmente_tratado" as const, linkedClauseIds: activeClausesForRisk.map(r => r.clauseId) };
      }
      return { ...risk, status: "nao_tratado" as const, linkedClauseIds: [] };
    }

    if (risk.id === "r_incompatibilidade_internacional") {
      const hasIntl = recommendations.some(r => r.clauseId === "cl_integracao_internacional");
      if (hasIntl) {
        return { ...risk, status: "tratado" as const, linkedClauseIds: ["cl_integracao_internacional"] };
      }
      if (caseProfile.hasInternationalElements === "sim") {
        return { ...risk, status: "nao_tratado" as const, linkedClauseIds: [] };
      }
    }

    // General rules
    if (activeClausesForRisk.length >= 2) {
      return { ...risk, status: "tratado" as const, linkedClauseIds: activeClausesForRisk.map(r => r.clauseId) };
    }
    if (activeClausesForRisk.length === 1) {
      return { ...risk, status: "parcialmente_tratado" as const, linkedClauseIds: activeClausesForRisk.map(r => r.clauseId) };
    }
    return { ...risk, status: "nao_tratado" as const, linkedClauseIds: [] };
  });
}
