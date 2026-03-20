import { ClausePriority, DocumentType } from "./enums";

export interface Recommendation {
  id: string;
  clauseId: string;
  score: number;
  priority: ClausePriority;
  reason: string;
  suggestedDocument: DocumentType;
  suggestedSupportingDocuments: DocumentType[];
  residualRiskIds: string[];
  needsAttention: boolean;
  allocationRationale: string;
  wrongAllocationRisk: string;
}
