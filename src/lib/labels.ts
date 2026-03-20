import { DocumentType, ClausePriority, RiskStatus, ClauseCategory, DocumentHierarchyTier } from "../types/enums";

export const documentTypeLabels: Record<DocumentType, string> = {
  contrato_social: "Contrato Social",
  acordo_socios: "Acordo de Sócios",
  instrumento_doacao: "Instrumento de Doação",
  protocolo_familiar: "Protocolo Familiar",
  memorando_estrategico: "Memorando Estratégico",
  memorando_riscos: "Memorando de Riscos",
  memorando_tributario: "Memorando Tributário",
  documento_internacional: "Documento Internacional",
  seguro_vida: "Seguro de Vida",
  alteracao_contratual: "Alteração Contratual",
  ambos: "Contrato Social + Acordo de Sócios",
};

export const priorityLabels: Record<ClausePriority, string> = {
  essencial: "Essencial",
  recomendada: "Recomendada",
  opcional: "Opcional",
  avancada: "Avançada",
};

export const priorityColors: Record<ClausePriority, string> = {
  essencial: "bg-primary text-primary-foreground",
  recomendada: "bg-gold/20 text-foreground border border-gold/30",
  opcional: "bg-muted text-muted-foreground",
  avancada: "bg-secondary text-secondary-foreground",
};

export const riskStatusLabels: Record<RiskStatus, string> = {
  tratado: "Tratado",
  parcialmente_tratado: "Parcialmente tratado",
  nao_tratado: "Não tratado",
};

export const riskStatusColors: Record<RiskStatus, string> = {
  tratado: "bg-success/15 text-success border border-success/20",
  parcialmente_tratado: "bg-warning/15 text-warning border border-warning/20",
  nao_tratado: "bg-destructive/15 text-destructive border border-destructive/20",
};

export const categoryLabels: Record<ClauseCategory, string> = {
  transmissao: "Transmissão",
  controle_administracao: "Controle e Administração",
  protecao_patrimonial: "Proteção Patrimonial",
  governanca_familiar: "Governança Familiar",
  saida_liquidez: "Saída e Liquidez",
  integracao_documental: "Integração Documental",
  resolucao_conflitos: "Resolução de Conflitos",
  tributario_estrategico: "Tributário Estratégico",
};
