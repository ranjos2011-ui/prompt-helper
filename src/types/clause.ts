import {
  ClauseCategory,
  ClausePriority,
  DocumentType,
  ModuleId,
  SensitivityLevel,
} from "./enums";

export interface Clause {
  id: string;
  moduleId: ModuleId;
  name: string;
  category: ClauseCategory;
  objective: string;
  rationale: string;
  whenToUse: string;
  coveredRiskIds: string[];
  defaultPriority: ClausePriority;
  defaultSuggestedDocument: DocumentType;
  alternativeDocuments?: DocumentType[];
  needsMirroring: boolean;
  sensitivityLevel: SensitivityLevel;
  dependencies: string[];
  incompatibilities: string[];
  alerts: string[];
  contractSocialText?: string;
  shareholdersAgreementText?: string;
  donationText?: string;
  familyProtocolText?: string;
  strategicMemoText?: string;
  riskMemoText?: string;
  taxMemoText?: string;
  internationalDocText?: string;
}
