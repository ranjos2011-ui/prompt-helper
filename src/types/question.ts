import { DocumentType, ModuleId, QuestionCategory } from "./enums";

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface NextQuestionRule {
  whenAnswerIn: string[];
  goToQuestionIds: string[];
}

export interface Question {
  id: string;
  moduleId: ModuleId;
  category: QuestionCategory;
  title: string;
  prompt: string;
  explanation: string;
  impactSummary: string;
  type: "single_choice";
  allowsUnknown: boolean;
  options: QuestionOption[];
  relatedClauseIds: string[];
  linkedRiskIds: string[];
  linkedDocumentTypes: DocumentType[];
  nextQuestionRules: NextQuestionRule[];
  priorityWeight: number;
}
