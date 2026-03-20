import { CaseProfile } from "../types/case";
import { ProjectPremise } from "../types/premise";
import { questions } from "../data/questions";

const goalLabels: Record<string, string> = {
  protecao_patrimonial: "Proteção patrimonial",
  continuidade_comando: "Continuidade do comando",
  igualdade_herdeiros: "Igualdade entre herdeiros",
  liquidez: "Liquidez",
  governanca_familiar: "Governança familiar",
  eficiencia_tributaria_patrimonial: "Eficiência tributária patrimonial",
};

const ynLabels: Record<string, string> = {
  sim: "Sim",
  nao: "Não",
  parcialmente: "Parcialmente",
};

function findNotes(questionNotes: Record<string, string>, questionIds: string[]): string {
  return questionIds
    .map((id) => questionNotes[id])
    .filter(Boolean)
    .join(" ");
}

function findAnswer(answers: Record<string, string>, questionId: string): string {
  return answers[questionId] || "";
}

export function generateProjectPremises(
  caseProfile: CaseProfile,
  answers: Record<string, string>,
  questionNotes: Record<string, string>
): ProjectPremise[] {
  const premises: ProjectPremise[] = [
    {
      id: "prem_objetivo",
      title: "Objetivo principal da família",
      value: goalLabels[caseProfile.primaryGoal] || caseProfile.primaryGoal,
      interpretation: `A estrutura deve priorizar ${goalLabels[caseProfile.primaryGoal]?.toLowerCase() || "o objetivo definido"} como diretriz central do planejamento.`,
      linkedQuestionIds: ["q_primary_goal"],
      notesSummary: findNotes(questionNotes, ["q_primary_goal"]),
    },
    {
      id: "prem_controle",
      title: "Diretriz sobre controle",
      value: ynLabels[caseProfile.founderKeepsControl] || caseProfile.founderKeepsControl,
      interpretation: caseProfile.founderKeepsControl === "sim"
        ? "O fundador deseja manter o controle decisório da holding."
        : caseProfile.founderKeepsControl === "parcialmente"
        ? "O fundador aceita compartilhar parcialmente o controle."
        : "O fundador não faz questão de manter controle exclusivo.",
      linkedQuestionIds: ["q_keep_control", "q_separate_political_economic"],
      notesSummary: findNotes(questionNotes, ["q_keep_control", "q_separate_political_economic"]),
    },
    {
      id: "prem_renda",
      title: "Diretriz sobre renda",
      value: ynLabels[caseProfile.founderKeepsIncome] || caseProfile.founderKeepsIncome,
      interpretation: caseProfile.founderKeepsIncome === "sim"
        ? "A preservação de renda do fundador é uma premissa relevante."
        : "A renda não é uma premissa central.",
      linkedQuestionIds: ["q_keep_income"],
      notesSummary: findNotes(questionNotes, ["q_keep_income"]),
    },
    {
      id: "prem_herdeiros",
      title: "Diretriz sobre ingresso de herdeiros",
      value: caseProfile.hasManagingHeirs === "sim" && caseProfile.hasNonManagingHeirs === "sim"
        ? "Há herdeiros gestores e não gestores"
        : caseProfile.hasManagingHeirs === "sim"
        ? "Há herdeiros gestores"
        : "Sem herdeiros gestores identificados",
      interpretation: caseProfile.hasManagingHeirs === "sim" && caseProfile.hasNonManagingHeirs === "sim"
        ? "A estrutura deve contemplar tratamento diferenciado entre herdeiros gestores e investidores."
        : "A diferenciação entre herdeiros pode não ser necessária neste caso.",
      linkedQuestionIds: ["q_managing_heirs", "q_heir_eligibility", "q_equal_treatment"],
      notesSummary: findNotes(questionNotes, ["q_managing_heirs", "q_heir_eligibility", "q_equal_treatment"]),
    },
    {
      id: "prem_gestao",
      title: "Diretriz sobre gestão futura",
      value: findAnswer(answers, "q_heir_eligibility") === "sim" ? "Com filtro de elegibilidade" : "Sem filtro definido",
      interpretation: findAnswer(answers, "q_heir_eligibility") === "sim"
        ? "Haverá critérios de elegibilidade para acesso à gestão."
        : "A definição sobre gestão futura ainda precisa ser aprofundada.",
      linkedQuestionIds: ["q_heir_eligibility", "q_interim_management"],
      notesSummary: findNotes(questionNotes, ["q_heir_eligibility", "q_interim_management"]),
    },
    {
      id: "prem_conjuges",
      title: "Proteção contra cônjuges e terceiros",
      value: ynLabels[caseProfile.concernWithSpouses] || caseProfile.concernWithSpouses,
      interpretation: caseProfile.concernWithSpouses === "sim"
        ? "Há preocupação expressa com efeitos conjugais e ingresso de terceiros."
        : "A proteção contra cônjuges não foi indicada como prioridade.",
      linkedQuestionIds: ["q_spouse_concern"],
      notesSummary: findNotes(questionNotes, ["q_spouse_concern"]),
    },
    {
      id: "prem_liquidez",
      title: "Diretriz sobre liquidez e saída",
      value: findAnswer(answers, "q_exit_for_dissident") === "sim" ? "Prevista porta de saída" : "Sem definição de saída",
      interpretation: findAnswer(answers, "q_exit_for_dissident") === "sim"
        ? "A estrutura deve contemplar mecanismo de saída para herdeiro dissidente."
        : "A saída de sócios ainda não foi endereçada.",
      linkedQuestionIds: ["q_exit_for_dissident", "q_valuation", "q_liquidacao_haveres"],
      notesSummary: findNotes(questionNotes, ["q_exit_for_dissident", "q_valuation", "q_liquidacao_haveres"]),
    },
    {
      id: "prem_governanca_morte",
      title: "Governança pós-morte",
      value: findAnswer(answers, "q_post_death_governance") || "Não definida",
      interpretation: "A transição de comando e governança após falecimento deve ser planejada com antecedência.",
      linkedQuestionIds: ["q_post_death_governance", "q_interim_management"],
      notesSummary: findNotes(questionNotes, ["q_post_death_governance", "q_interim_management"]),
    },
    {
      id: "prem_tributario",
      title: "Sensibilidade tributária",
      value: ynLabels[caseProfile.hasRelevantTaxConcerns] || caseProfile.hasRelevantTaxConcerns,
      interpretation: caseProfile.hasRelevantTaxConcerns === "sim"
        ? "Há sensibilidade tributária relevante que exige memorando específico."
        : "A questão tributária não foi identificada como crítica.",
      linkedQuestionIds: ["q_tax_sensitivity"],
      notesSummary: findNotes(questionNotes, ["q_tax_sensitivity"]),
    },
    {
      id: "prem_documentos",
      title: "Documentos complementares",
      value: ynLabels[caseProfile.hasComplementaryDocuments] || caseProfile.hasComplementaryDocuments,
      interpretation: caseProfile.hasComplementaryDocuments === "sim"
        ? "A arquitetura documental exige documentos complementares."
        : "A estrutura pode se limitar aos documentos principais.",
      linkedQuestionIds: ["q_complementary_docs"],
      notesSummary: findNotes(questionNotes, ["q_complementary_docs"]),
    },
    {
      id: "prem_internacional",
      title: "Elementos internacionais",
      value: ynLabels[caseProfile.hasInternationalElements] || caseProfile.hasInternationalElements,
      interpretation: caseProfile.hasInternationalElements === "sim"
        ? "Há elementos internacionais que demandam compatibilização documental."
        : "Não há componentes internacionais relevantes.",
      linkedQuestionIds: ["q_international_element"],
      notesSummary: findNotes(questionNotes, ["q_international_element"]),
    },
  ];

  return premises;
}

export function generateStrategicSummary(
  caseProfile: CaseProfile,
  answers: Record<string, string>,
  questionNotes: Record<string, string>,
  generalNotes: string
): string {
  const parts: string[] = [];

  parts.push(`Caso "${caseProfile.caseName}": a estrutura sucessória e patrimonial deve priorizar ${goalLabels[caseProfile.primaryGoal]?.toLowerCase() || "o objetivo definido"}.`);

  if (caseProfile.founderKeepsControl === "sim") {
    parts.push("O fundador deseja preservar o comando decisório.");
  }
  if (caseProfile.founderKeepsIncome === "sim") {
    parts.push("A manutenção de renda é uma premissa do projeto.");
  }
  if (caseProfile.hasManagingHeirs === "sim" && caseProfile.hasNonManagingHeirs === "sim") {
    parts.push("Há coexistência de herdeiros gestores e não gestores, o que exige tratamento diferenciado.");
  }
  if (caseProfile.concernWithSpouses === "sim") {
    parts.push("A proteção contra efeitos conjugais é uma preocupação expressa.");
  }
  if (caseProfile.hasChildrenFromDifferentRelationships === "sim") {
    parts.push("A existência de filhos de diferentes relacionamentos adiciona complexidade ao planejamento.");
  }
  if (caseProfile.conflictRisk === "alto") {
    parts.push("O risco de conflito é considerado alto, o que reforça a necessidade de mecanismos de resolução e governança.");
  }
  if (caseProfile.hasRelevantTaxConcerns === "sim") {
    parts.push("Há sensibilidade tributária que deve ser endereçada em memorando específico.");
  }
  if (caseProfile.hasInternationalElements === "sim") {
    parts.push("Elementos internacionais exigem compatibilização documental.");
  }

  if (generalNotes.trim()) {
    parts.push(`Observações consolidadas: ${generalNotes.trim()}`);
  }

  return parts.join(" ");
}
