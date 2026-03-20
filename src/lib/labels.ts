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

export const documentHierarchyTierLabels: Record<DocumentHierarchyTier, string> = {
  central: "Cláusula Estruturante",
  estrutural_contrato: "Contrato Social",
  complementar_acordo: "Acordo de Sócios",
  instrumento_complementar: "Instrumentos Complementares",
  implementacao: "Implementação",
};

export const documentHierarchyTierDescriptions: Record<DocumentHierarchyTier, string> = {
  central: "Cláusula central da arquitetura sucessória",
  estrutural_contrato: "Cláusulas estruturais do contrato social — espinha dorsal da arquitetura",
  complementar_acordo: "Detalhamento estratégico e critérios reservados no acordo de sócios",
  instrumento_complementar: "Instrumentos de suporte: seguro de vida, protocolo familiar, memorandos",
  implementacao: "Atos de formalização e execução da arquitetura",
};

export const documentHierarchyTierColors: Record<DocumentHierarchyTier, string> = {
  central: "bg-primary text-primary-foreground",
  estrutural_contrato: "bg-primary/10 text-primary border border-primary/20",
  complementar_acordo: "bg-gold/15 text-foreground border border-gold/30",
  instrumento_complementar: "bg-muted text-muted-foreground border border-border",
  implementacao: "bg-secondary/50 text-secondary-foreground border border-secondary/30",
};

/** Maps each clause ID to its document hierarchy tier */
export const clauseHierarchyMap: Record<string, DocumentHierarchyTier> = {
  // Central
  cl_sucessao_quotas: "central",
  // Estrutural — Contrato Social
  cl_restricao_cessao: "estrutural_contrato",
  cl_vedacao_ingresso_gestao: "estrutural_contrato",
  cl_elegibilidade_admin: "estrutural_contrato",
  cl_quorum_qualificado: "estrutural_contrato",
  cl_admin_interina: "estrutural_contrato",
  cl_liquidacao_haveres: "estrutural_contrato",
  cl_valuation: "estrutural_contrato",
  // Complementar — Acordo de Sócios
  cl_distincao_gestor_investidor: "complementar_acordo",
  cl_reserva_voto: "complementar_acordo",
  cl_compra_compulsoria: "complementar_acordo",
  cl_saida_dissidente: "complementar_acordo",
  cl_mediacao: "complementar_acordo",
  cl_arbitragem: "complementar_acordo",
  cl_conselho_familiar: "complementar_acordo",
  // Instrumentos complementares
  cl_usufruto: "instrumento_complementar",
  cl_reversao: "instrumento_complementar",
  cl_incomunicabilidade: "instrumento_complementar",
  cl_impenhorabilidade: "instrumento_complementar",
  cl_inalienabilidade: "instrumento_complementar",
  cl_compat_doacao: "instrumento_complementar",
  cl_compat_protocolo: "instrumento_complementar",
  cl_integracao_internacional: "instrumento_complementar",
  cl_memorando_estrategico: "instrumento_complementar",
  cl_memorando_riscos: "instrumento_complementar",
  cl_memorando_tributario: "instrumento_complementar",
};
