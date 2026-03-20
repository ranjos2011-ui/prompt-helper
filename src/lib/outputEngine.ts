import { CaseProfile } from "../types/case";
import { Recommendation } from "../types/recommendation";
import { Risk } from "../types/risk";
import { Clause } from "../types/clause";
import { OutputDocument } from "../types/output";
import { DocumentType } from "../types/enums";

function groupRecommendationsByDocument(recommendations: Recommendation[]): OutputDocument["clausesByDocument"] {
  const groups: OutputDocument["clausesByDocument"] = {
    contrato_social: [],
    acordo_socios: [],
    instrumento_doacao: [],
    protocolo_familiar: [],
    memorando_estrategico: [],
    memorando_riscos: [],
    memorando_tributario: [],
    documento_internacional: [],
    ambos: [],
  };

  for (const rec of recommendations) {
    const doc = rec.suggestedDocument as DocumentType;
    if (groups[doc]) {
      groups[doc].push(rec.clauseId);
    }
  }

  return groups;
}

function buildPendingDecisions(
  caseProfile: CaseProfile,
  recommendations: Recommendation[],
  risks: Risk[]
): string[] {
  const pending: string[] = [];

  const untreatedRisks = risks.filter(r => r.status === "nao_tratado");
  if (untreatedRisks.length > 0) {
    pending.push(`${untreatedRisks.length} risco(s) ainda não tratado(s) requerem decisão.`);
  }

  const attentionItems = recommendations.filter(r => r.needsAttention);
  if (attentionItems.length > 0) {
    pending.push(`${attentionItems.length} cláusula(s) com alta sensibilidade requerem atenção especial.`);
  }

  if (caseProfile.donationAlreadyMade === "nao") {
    pending.push("Definir momento e condições da doação de quotas.");
  }

  return pending;
}

function buildGlobalAlerts(
  caseProfile: CaseProfile,
  recommendations: Recommendation[],
  risks: Risk[],
  clauses: Clause[]
): string[] {
  const alerts: string[] = [];

  // Sensitive matter in public doc
  for (const rec of recommendations) {
    const clause = clauses.find(c => c.id === rec.clauseId);
    if (clause?.sensitivityLevel === "alto" && rec.suggestedDocument === "contrato_social") {
      alerts.push(`Matéria sensível ("${clause.name}") alocada em documento público.`);
    }
  }

  // Incapacity not treated
  const incapRisk = risks.find(r => r.id === "r_incapacidade_nao_tratada");
  if (incapRisk?.status === "nao_tratado") {
    alerts.push("Incapacidade do fundador ou sócio relevante não tratada.");
  }

  // Control vs equality conflict
  if (caseProfile.primaryGoal === "continuidade_comando" && caseProfile.hasNonManagingHeirs === "sim") {
    alerts.push("Potencial conflito entre continuidade do comando e igualdade sucessória.");
  }

  // No exit for dissident
  const dissidentRisk = risks.find(r => r.id === "r_sem_liquidez_dissidente");
  if (dissidentRisk?.status === "nao_tratado") {
    alerts.push("Ausência de mecanismo de saída para herdeiro dissidente.");
  }

  // Tax without memo
  if (caseProfile.hasRelevantTaxConcerns === "sim") {
    const hasTaxMemo = recommendations.some(r => r.clauseId === "cl_memorando_tributario");
    if (!hasTaxMemo) {
      alerts.push("Sensibilidade tributária sem memorando tributário.");
    }
  }

  // International without doc
  if (caseProfile.hasInternationalElements === "sim") {
    const hasIntl = recommendations.some(r => r.clauseId === "cl_integracao_internacional");
    if (!hasIntl) {
      alerts.push("Elemento internacional sem documento complementar.");
    }
  }

  return alerts;
}

const goalLabels: Record<string, string> = {
  protecao_patrimonial: "proteção patrimonial",
  continuidade_comando: "continuidade do comando",
  igualdade_herdeiros: "igualdade entre herdeiros",
  liquidez: "liquidez",
  governanca_familiar: "governança familiar",
  eficiencia_tributaria_patrimonial: "eficiência tributária patrimonial",
};

export function generateOutput(
  caseProfile: CaseProfile,
  recommendations: Recommendation[],
  risks: Risk[],
  clauses: Clause[]
): OutputDocument {
  const essentials = recommendations.filter(r => r.priority === "essencial");
  const recommended = recommendations.filter(r => r.priority === "recomendada");
  const optional = recommendations.filter(r => r.priority === "opcional");
  const advanced = recommendations.filter(r => r.priority === "avancada");

  const residualRisks = risks
    .filter(r => r.status !== "tratado")
    .map(r => r.name);

  const suggestedMemos = [...new Set(
    recommendations
      .flatMap(r => r.suggestedSupportingDocuments)
      .filter(doc => doc.includes("memorando"))
  )];

  return {
    executiveSummary: `Caso ${caseProfile.caseName}: estrutura focada em ${goalLabels[caseProfile.primaryGoal] || caseProfile.primaryGoal}, com atenção a controle, renda, governança, proteção patrimonial e sensibilidade tributária.`,
    keyTensions: [
      "Continuidade do comando versus sucessão patrimonial",
      "Separação entre herdeiros gestores e não gestores",
      "Proteção contra efeitos conjugais",
      "Compatibilização documental e tributária",
    ],
    recommendedStrategy: [
      "Separar desenho patrimonial de desenho político",
      "Usar arquitetura documental combinada",
      "Controlar pontos sensíveis em documento reservado",
      "Adicionar memorandos de suporte quando necessário",
    ],
    clausesByPriority: {
      essenciais: essentials.map(r => r.clauseId),
      recomendadas: recommended.map(r => r.clauseId),
      opcionais: optional.map(r => r.clauseId),
      avancadas: advanced.map(r => r.clauseId),
    },
    clausesByDocument: groupRecommendationsByDocument(recommendations),
    suggestedMemos,
    residualRisks,
    pendingDecisions: buildPendingDecisions(caseProfile, recommendations, risks),
    alerts: buildGlobalAlerts(caseProfile, recommendations, risks, clauses),
  };
}
