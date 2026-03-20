export type ModuleId =
  | "succession_holding_module"
  | "governance_module"
  | "donation_module"
  | "family_protocol_module"
  | "tax_memo_module"
  | "international_integration_module";

export type EntryMode =
  | "problem"
  | "clause"
  | "package";

export type StructureType =
  | "holding_pura_patrimonial"
  | "holding_mista";

export type PrimaryGoal =
  | "protecao_patrimonial"
  | "continuidade_comando"
  | "igualdade_herdeiros"
  | "liquidez"
  | "governanca_familiar"
  | "eficiencia_tributaria_patrimonial";

export type ConflictRisk =
  | "baixo"
  | "medio"
  | "alto";

export type YesNo =
  | "sim"
  | "nao";

export type YesNoPartial =
  | "sim"
  | "nao"
  | "parcialmente";

export type QuestionCategory =
  | "objetivos"
  | "transmissao"
  | "controle"
  | "renda"
  | "herdeiros"
  | "conjuges"
  | "governanca"
  | "liquidez"
  | "incapacidade"
  | "documentos"
  | "tributario"
  | "internacional";

export type ClauseCategory =
  | "transmissao"
  | "controle_administracao"
  | "protecao_patrimonial"
  | "governanca_familiar"
  | "saida_liquidez"
  | "integracao_documental"
  | "resolucao_conflitos"
  | "tributario_estrategico";

export type ClausePriority =
  | "essencial"
  | "recomendada"
  | "opcional"
  | "avancada";

export type RiskStatus =
  | "tratado"
  | "parcialmente_tratado"
  | "nao_tratado";

export type DocumentType =
  | "contrato_social"
  | "acordo_socios"
  | "instrumento_doacao"
  | "protocolo_familiar"
  | "memorando_estrategico"
  | "memorando_riscos"
  | "memorando_tributario"
  | "documento_internacional"
  | "ambos";

export type SensitivityLevel =
  | "baixo"
  | "medio"
  | "alto";
