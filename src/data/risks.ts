import { Risk } from "../types/risk";

export const risks: Risk[] = [
  {
    id: "r_pulverizacao_controle",
    moduleId: "succession_holding_module",
    name: "Pulverização do controle",
    description: "Risco de dispersão do poder decisório entre sucessores.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: ["contrato_social", "acordo_socios"],
  },
  {
    id: "r_entrada_conjuges",
    moduleId: "succession_holding_module",
    name: "Entrada de cônjuges ou ex-cônjuges",
    description:
      "Risco de contaminação patrimonial ou societária por eventos conjugais.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: [
      "instrumento_doacao",
      "acordo_socios",
      "protocolo_familiar",
    ],
  },
  {
    id: "r_conflito_gestor_investidor",
    moduleId: "succession_holding_module",
    name: "Conflito entre herdeiro gestor e investidor",
    description:
      "Risco de tensão entre herdeiros envolvidos na gestão e herdeiros apenas econômicos.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: ["acordo_socios", "protocolo_familiar"],
  },
  {
    id: "r_incapacidade_nao_tratada",
    moduleId: "succession_holding_module",
    name: "Incapacidade não tratada",
    description:
      "Ausência de regra clara para incapacidade do fundador ou sucessor relevante.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: [
      "contrato_social",
      "acordo_socios",
      "memorando_estrategico",
    ],
  },
  {
    id: "r_falecimento_sem_transicao",
    moduleId: "succession_holding_module",
    name: "Falecimento sem governança transitória",
    description:
      "Ausência de mecanismos para transição ordenada de poder e administração.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: [
      "contrato_social",
      "acordo_socios",
      "protocolo_familiar",
    ],
  },
  {
    id: "r_litigio_haveres",
    moduleId: "succession_holding_module",
    name: "Litígio sobre haveres",
    description:
      "Risco de conflito sobre critérios de saída, avaliação e pagamento.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: [
      "acordo_socios",
      "contrato_social",
      "memorando_riscos",
    ],
  },
  {
    id: "r_sem_liquidez_dissidente",
    moduleId: "succession_holding_module",
    name: "Ausência de liquidez para herdeiro dissidente",
    description:
      "Risco de permanência forçada ou litígio pela falta de saída econômica.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: ["acordo_socios", "memorando_estrategico"],
  },
  {
    id: "r_inconsistencia_documental",
    moduleId: "succession_holding_module",
    name: "Inconsistência documental",
    description:
      "Risco de desalinhamento entre contrato social, acordo, doação e demais documentos.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: ["ambos", "memorando_riscos"],
  },
  {
    id: "r_sensibilidade_tributaria",
    moduleId: "succession_holding_module",
    name: "Sensibilidade tributária não endereçada",
    description:
      "Risco de a estrutura sucessória gerar efeitos tributários não mapeados.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: ["memorando_tributario", "memorando_estrategico"],
  },
  {
    id: "r_sucessao_politica_economica",
    moduleId: "succession_holding_module",
    name: "Conflito entre sucessão econômica e política",
    description:
      "Ausência de diferenciação entre poder econômico e controle político.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: [
      "contrato_social",
      "acordo_socios",
      "memorando_estrategico",
    ],
  },
  {
    id: "r_exposicao_documento_errado",
    moduleId: "succession_holding_module",
    name: "Exposição excessiva de matéria sensível em documento inadequado",
    description:
      "Risco de inserir matéria sensível em documento com publicidade indesejada.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: [
      "acordo_socios",
      "contrato_social",
      "memorando_riscos",
    ],
  },
  {
    id: "r_incompatibilidade_internacional",
    moduleId: "succession_holding_module",
    name: "Incompatibilidade com estrutura internacional",
    description:
      "Risco de desalinhamento com offshore, trust, minitrust, JTWRS ou documentos estrangeiros.",
    status: "nao_tratado",
    linkedClauseIds: [],
    linkedDocumentTypes: ["documento_internacional", "memorando_estrategico"],
  },
];
