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
  /** Which option template IDs this question activates, keyed by answer value */
  activatesTemplates?: Record<string, string[]>;
  /** Which complementary block IDs this question activates, keyed by answer value */
  activatesBlocks?: Record<string, string[]>;
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

export interface CommonProblem {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  relatedRiskIds: string[];
}

export interface ClauseOptionTemplate {
  id: string;
  letter: string;
  title: string;
  summary: string;
  recommendedWhen: string[];
  risks: string[];
  templateText: string;
  isComplementary: boolean;
}

export interface ClauseDetailConfig {
  clauseId: string;
  defaultRuleText: string;
  defaultRuleExplanation?: string;
  whyItMatters: string[];
  problemsAvoided: string[];
  commonProblems: CommonProblem[];
  defaultRisksCovered: string[];
  decisionQuestions: ClauseDecisionQuestion[];
  optionTemplates: ClauseOptionTemplate[];
  draftBlocks: DraftBlock[];
  draftingNotes: string[];
  documentAllocationNotes: DocumentAllocationNote[];
}

export interface ClauseDraftState {
  clauseId: string;
  answers: Record<string, string>;
  activatedDraftBlocks: string[];
  selectedTemplateId: string | null;
  selectedComplementaryIds: string[];
  customDocumentAllocation: DocumentType | null;
  customAlerts: string[];
  draftPreview: string;
}
