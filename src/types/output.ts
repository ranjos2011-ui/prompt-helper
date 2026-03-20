export interface OutputDocument {
  executiveSummary: string;
  keyTensions: string[];
  recommendedStrategy: string[];
  clausesByPriority: {
    essenciais: string[];
    recomendadas: string[];
    opcionais: string[];
    avancadas: string[];
  };
  clausesByDocument: {
    contrato_social: string[];
    acordo_socios: string[];
    instrumento_doacao: string[];
    protocolo_familiar: string[];
    memorando_estrategico: string[];
    memorando_riscos: string[];
    memorando_tributario: string[];
    documento_internacional: string[];
    ambos: string[];
  };
  suggestedMemos: string[];
  residualRisks: string[];
  pendingDecisions: string[];
  alerts: string[];
}
