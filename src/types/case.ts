import {
  ConflictRisk,
  EntryMode,
  ModuleId,
  PrimaryGoal,
  StructureType,
  YesNo,
  YesNoPartial,
} from "./enums";

export interface CaseProfile {
  id: string;
  caseName: string;
  selectedModule: ModuleId;
  selectedEntryMode: EntryMode;
  structureType: StructureType;
  primaryGoal: PrimaryGoal;
  founderKeepsControl: YesNoPartial;
  founderKeepsIncome: YesNo;
  donationAlreadyMade: YesNo;
  hasManagingHeirs: YesNo;
  hasNonManagingHeirs: YesNo;
  hasChildrenFromDifferentRelationships: YesNo;
  concernWithSpouses: YesNo;
  conflictRisk: ConflictRisk;
  hasInternationalElements: YesNo;
  hasComplementaryDocuments: YesNo;
  hasRelevantTaxConcerns: YesNo;
  notes?: string;
}
