import { CaseProfile } from "../types/case";

export const mockCase: CaseProfile = {
  id: "case-001",
  caseName: "Família Almeida Holding",
  selectedModule: "succession_holding_module",
  selectedEntryMode: "problem",
  structureType: "holding_pura_patrimonial",
  primaryGoal: "continuidade_comando",
  founderKeepsControl: "sim",
  founderKeepsIncome: "sim",
  donationAlreadyMade: "nao",
  hasManagingHeirs: "sim",
  hasNonManagingHeirs: "sim",
  hasChildrenFromDifferentRelationships: "sim",
  concernWithSpouses: "sim",
  conflictRisk: "alto",
  hasInternationalElements: "sim",
  hasComplementaryDocuments: "sim",
  hasRelevantTaxConcerns: "sim",
  notes:
    "Caso com tensão entre continuidade do comando, preservação de renda do fundador, proteção patrimonial, governança futura e sensibilidade tributária.",
};
