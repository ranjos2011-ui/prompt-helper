import { DocumentType } from "./enums";

export interface ClauseDecisionOption {
  value: string;
  label: string;
  description?: string;
}

export interface ClauseDecisionImpact {
  type: "societario" | "sucessorio" | "patrimonial" | "documental" | "tributario";
  description: string;
  severity: "info" | "warning" | "critical";
}

export interface ClauseDecisionQuestion {
  id: string;
  clauseId: string;
  title: string;
  prompt: string;
  explanation: string;
  options: ClauseDecisionOption[];
  allowsUndefined: boolean;
  impacts: Record<string, ClauseDecisionImpact[]>;
  alert?: string;
  affectsDraftBlocks: string[];
  affectsSuggestedDocument: boolean;
  affectsRisks: string[];
}

export interface DraftBlock {
  id: string;
  label: string;
  text: string;
  activatedWhen: { questionId: string; answerIn: string[] }[];
  documentTarget: DocumentType;
  draftingNote?: string;
}

export interface DocumentAllocationNote {
  documentType: DocumentType;
  label: string;
  whatGoesThere: string;
  rationale: string;
  riskIfWrong: string;
}

export interface ClauseDetailConfig {
  clauseId: string;
  defaultRuleText: string;
  whyItMatters: string[];
  problemsAvoided: string[];
  defaultRisksCovered: string[];
  decisionQuestions: ClauseDecisionQuestion[];
  draftBlocks: DraftBlock[];
  draftingNotes: string[];
  documentAllocationNotes: DocumentAllocationNote[];
}

export interface ClauseDraftState {
  clauseId: string;
  answers: Record<string, string>;
  activatedDraftBlocks: string[];
  customDocumentAllocation: DocumentType | null;
  customAlerts: string[];
  draftPreview: string;
}
