import { DocumentType, ModuleId, RiskStatus } from "./enums";

export interface Risk {
  id: string;
  moduleId: ModuleId;
  name: string;
  description: string;
  status: RiskStatus;
  linkedClauseIds: string[];
  linkedDocumentTypes: DocumentType[];
}
