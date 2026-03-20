import { CaseProfile } from "../types/case";
import { Clause } from "../types/clause";
import { DocumentType, ClausePriority } from "../types/enums";
import { Recommendation } from "../types/recommendation";

function computeSuggestedDocument(clause: Clause, _caseProfile: CaseProfile, _answers: Record<string, string>): DocumentType {
  const map: Record<string, DocumentType> = {
    cl_usufruto: "instrumento_doacao",
    cl_incomunicabilidade: "instrumento_doacao",
    cl_impenhorabilidade: "instrumento_doacao",
    cl_inalienabilidade: "instrumento_doacao",
    cl_reversao: "instrumento_doacao",
    cl_reserva_voto: "ambos",
    cl_quorum_qualificado: "contrato_social",
    cl_elegibilidade_admin: "ambos",
    cl_conselho_familiar: "acordo_socios",
    cl_valuation: "ambos",
    cl_liquidacao_haveres: "ambos",
    cl_mediacao: "acordo_socios",
    cl_arbitragem: "acordo_socios",
    cl_compat_doacao: "memorando_estrategico",
    cl_compat_protocolo: "protocolo_familiar",
    cl_integracao_internacional: "documento_internacional",
    cl_memorando_tributario: "memorando_tributario",
    cl_memorando_estrategico: "memorando_estrategico",
    cl_memorando_riscos: "memorando_riscos",
    cl_compra_compulsoria: "acordo_socios",
    cl_saida_dissidente: "acordo_socios",
    cl_distincao_gestor_investidor: "acordo_socios",
    cl_vedacao_ingresso_gestao: "contrato_social",
    cl_admin_interina: "contrato_social",
    cl_restricao_cessao: "contrato_social",
    cl_sucessao_quotas: "contrato_social",
  };
  return map[clause.id] || clause.defaultSuggestedDocument;
}

function convertScoreToPriority(score: number): ClausePriority {
  if (score >= 90) return "essencial";
  if (score >= 70) return "recomendada";
  if (score >= 40) return "opcional";
  return "avancada";
}

function buildAllocationRationale(clause: Clause, doc: DocumentType): string {
  const docLabels: Record<string, string> = {
    contrato_social: "Contrato Social",
    acordo_socios: "Acordo de Sócios",
    instrumento_doacao: "Instrumento de Doação",
    protocolo_familiar: "Protocolo Familiar",
    memorando_estrategico: "Memorando Estratégico",
    memorando_riscos: "Memorando de Riscos",
    memorando_tributario: "Memorando Tributário",
    documento_internacional: "Documento Internacional",
    ambos: "Contrato Social + Acordo de Sócios",
  };
  return `A cláusula "${clause.name}" é alocada em ${docLabels[doc] || doc} por tratar de matéria ${clause.sensitivityLevel === "alto" ? "sensível e reservada" : "estrutural"}.`;
}

function buildWrongAllocationRisk(clause: Clause, doc: DocumentType): string {
  if (clause.sensitivityLevel === "alto" && (doc === "contrato_social")) {
    return "Risco de exposição pública de matéria sensível em documento registrado.";
  }
  if (clause.sensitivityLevel === "baixo" && doc === "acordo_socios") {
    return "Matéria estrutural poderia ficar no contrato social para maior segurança jurídica.";
  }
  return "";
}

export function buildRecommendations(
  caseProfile: CaseProfile,
  answers: Record<string, string>,
  allClauses: Clause[]
): { recommendations: Recommendation[]; alerts: string[] } {
  const recommendations: Recommendation[] = [];
  const alerts: string[] = [];

  for (const clause of allClauses) {
    let score = 0;
    const reasonParts: string[] = [];
    const supportingDocs: DocumentType[] = [];

    // Control rules
    if (caseProfile.founderKeepsControl === "sim" || caseProfile.founderKeepsControl === "parcialmente") {
      if (["cl_reserva_voto", "cl_quorum_qualificado", "cl_elegibilidade_admin", "cl_vedacao_ingresso_gestao"].includes(clause.id)) {
        score += 35;
        reasonParts.push("O fundador deseja manter controle.");
      }
    }

    // Income rules
    if (caseProfile.founderKeepsIncome === "sim") {
      if (["cl_usufruto", "cl_memorando_estrategico"].includes(clause.id)) {
        score += 25;
        reasonParts.push("O fundador deseja manter renda.");
      }
    }

    // Spouse rules
    if (caseProfile.concernWithSpouses === "sim") {
      if (["cl_incomunicabilidade", "cl_impenhorabilidade", "cl_inalienabilidade", "cl_restricao_cessao"].includes(clause.id)) {
        score += 30;
        reasonParts.push("Há preocupação com cônjuges e ex-cônjuges.");
        supportingDocs.push("instrumento_doacao", "protocolo_familiar");
      }
    }

    // Heirs differentiation
    if (caseProfile.hasManagingHeirs === "sim" && caseProfile.hasNonManagingHeirs === "sim") {
      if (["cl_distincao_gestor_investidor", "cl_conselho_familiar", "cl_elegibilidade_admin", "cl_saida_dissidente"].includes(clause.id)) {
        score += 30;
        reasonParts.push("Há coexistência de herdeiros gestores e não gestores.");
      }
    }

    // Conflict risk
    if (caseProfile.conflictRisk === "alto") {
      if (["cl_mediacao", "cl_arbitragem", "cl_valuation", "cl_liquidacao_haveres", "cl_memorando_riscos"].includes(clause.id)) {
        score += 30;
        reasonParts.push("O risco de conflito foi indicado como alto.");
      }
    }

    // International
    if (caseProfile.hasInternationalElements === "sim") {
      if (["cl_integracao_internacional"].includes(clause.id)) {
        score += 30;
        reasonParts.push("Há elementos internacionais na estrutura.");
        supportingDocs.push("documento_internacional");
      }
    }

    // Tax
    if (caseProfile.hasRelevantTaxConcerns === "sim") {
      if (["cl_memorando_tributario"].includes(clause.id)) {
        score += 35;
        reasonParts.push("Há preocupação tributária relevante.");
        supportingDocs.push("memorando_tributario");
      }
    }

    // Complementary docs
    if (caseProfile.hasComplementaryDocuments === "sim") {
      if (["cl_compat_doacao", "cl_compat_protocolo", "cl_memorando_estrategico"].includes(clause.id)) {
        score += 20;
        reasonParts.push("A arquitetura prevê documentos complementares.");
      }
    }

    // Succession base clauses
    if (["cl_sucessao_quotas", "cl_admin_interina"].includes(clause.id)) {
      score += 30;
      reasonParts.push("Cláusula fundamental para toda holding com planejamento sucessório.");
    }

    // Answer-driven rules
    if (answers["q_separate_political_economic"] === "sim") {
      if (["cl_reserva_voto", "cl_elegibilidade_admin", "cl_distincao_gestor_investidor"].includes(clause.id)) {
        score += 25;
        reasonParts.push("Deseja-se separar sucessão econômica de sucessão política.");
      }
    }

    if (answers["q_exit_for_dissident"] === "sim") {
      if (["cl_saida_dissidente", "cl_liquidacao_haveres", "cl_valuation", "cl_compra_compulsoria"].includes(clause.id)) {
        score += 25;
        reasonParts.push("Deseja-se porta de saída para herdeiro dissidente.");
      }
    }

    if (answers["q_incapacity"] === "sim" || answers["q_incapacity"] === "basico") {
      if (["cl_admin_interina"].includes(clause.id)) {
        score += 20;
        reasonParts.push("Há preocupação com incapacidade.");
      }
    }

    if (answers["q_spouse_protection"] === "sim") {
      if (["cl_incomunicabilidade", "cl_impenhorabilidade", "cl_inalienabilidade"].includes(clause.id)) {
        score += 20;
        reasonParts.push("Proteção contra cônjuges é prioritária.");
      }
    }

    // Different relationships bonus
    if (caseProfile.hasChildrenFromDifferentRelationships === "sim") {
      if (["cl_incomunicabilidade", "cl_restricao_cessao", "cl_conselho_familiar", "cl_mediacao"].includes(clause.id)) {
        score += 15;
        reasonParts.push("Há filhos de relacionamentos diferentes.");
      }
    }

    if (score > 0) {
      const priority = convertScoreToPriority(score);
      const suggestedDocument = computeSuggestedDocument(clause, caseProfile, answers);

      recommendations.push({
        id: `rec_${clause.id}`,
        clauseId: clause.id,
        score,
        priority,
        reason: reasonParts.join(" "),
        suggestedDocument,
        suggestedSupportingDocuments: [...new Set(supportingDocs)],
        residualRiskIds: [],
        needsAttention: clause.sensitivityLevel === "alto",
        allocationRationale: buildAllocationRationale(clause, suggestedDocument),
        wrongAllocationRisk: buildWrongAllocationRisk(clause, suggestedDocument),
      });
    }
  }

  // Global alerts
  if (caseProfile.hasRelevantTaxConcerns === "sim" && !recommendations.find(r => r.clauseId === "cl_memorando_tributario")) {
    alerts.push("Sensibilidade tributária identificada sem memorando tributário ativado.");
  }
  if (caseProfile.hasInternationalElements === "sim" && !recommendations.find(r => r.clauseId === "cl_integracao_internacional")) {
    alerts.push("Elementos internacionais identificados sem cláusula de integração.");
  }

  return { recommendations: recommendations.sort((a, b) => b.score - a.score), alerts };
}
