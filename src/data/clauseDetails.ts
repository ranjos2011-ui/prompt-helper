import { ClauseDetailConfig } from "../types/clauseBuilder";

export const clauseDetailConfigs: Record<string, ClauseDetailConfig> = {
  cl_sucessao_quotas: {
    clauseId: "cl_sucessao_quotas",
    defaultRuleText:
      "Na ausência de disciplina refinada, a sucessão da participação societária tende a seguir a disciplina legal e contratual aplicável. Isso pode resultar em ingresso automático de sucessores na sociedade, necessidade de liquidação de haveres ou incerteza sobre controle, administração e continuidade da estrutura. O contrato social pode prever regras sobre o ingresso, mas sem detalhamento estratégico, a transmissão ocorre de forma genérica — o que frequentemente gera conflitos entre herdeiros, pulverização do controle e indefinição sobre a gestão.",
    whyItMatters: [
      "Define quem entra na sociedade após o falecimento do sócio e em que condições.",
      "Determina se a sucessão será apenas econômica ou também política.",
      "Estabelece se haverá filtros, restrições ou condições de ingresso.",
      "Impacta diretamente a continuidade da governança e o equilíbrio de poder.",
      "É a base sobre a qual todas as demais cláusulas sucessórias se apoiam.",
    ],
    problemsAvoided: [
      "Ingresso desorganizado de herdeiros sem preparo ou legitimidade para gestão.",
      "Pulverização do controle decisório entre múltiplos sucessores.",
      "Conflito entre titularidade econômica e comando político da holding.",
      "Litígios sobre saída, haveres e critérios de avaliação.",
      "Indefinição sobre administração interina em caso de falecimento.",
    ],
    defaultRisksCovered: [
      "r_pulverizacao_controle",
      "r_falecimento_sem_transicao",
      "r_conflito_gestor_investidor",
      "r_sucessao_politica_economica",
    ],
    decisionQuestions: [
      {
        id: "dq_ingresso_automatico",
        clauseId: "cl_sucessao_quotas",
        title: "Ingresso automático dos herdeiros",
        prompt: "Os herdeiros ingressarão automaticamente na sociedade após o falecimento do sócio?",
        explanation:
          "O ingresso automático significa que os herdeiros passam a integrar o quadro societário sem necessidade de aprovação dos demais sócios. Sem essa previsão, pode haver necessidade de liquidação ou aprovação assemblear.",
        options: [
          { value: "sim", label: "Sim, ingresso automático", description: "Herdeiros ingressam diretamente." },
          { value: "nao", label: "Não, ingresso condicionado", description: "Herdeiros precisam de aprovação ou filtro." },
          { value: "parcial", label: "Ingresso econômico, não político", description: "Recebem direitos econômicos, mas não votam." },
        ],
        allowsUndefined: true,
        impacts: {
          sim: [
            { type: "societario", description: "Todos os herdeiros passam a ser sócios com direitos plenos.", severity: "warning" },
            { type: "sucessorio", description: "Pode gerar pulverização do controle se houver muitos herdeiros.", severity: "critical" },
          ],
          nao: [
            { type: "societario", description: "Permite filtro de elegibilidade e preservação do controle.", severity: "info" },
            { type: "documental", description: "Exige detalhamento no acordo de sócios sobre critérios de ingresso.", severity: "info" },
          ],
          parcial: [
            { type: "societario", description: "Separa titularidade econômica de poder político.", severity: "info" },
            { type: "sucessorio", description: "Protege continuidade do comando sem excluir herdeiros economicamente.", severity: "info" },
            { type: "documental", description: "Requer espelhamento entre contrato social e acordo de sócios.", severity: "warning" },
          ],
        },
        alert: "O ingresso automático é a principal causa de pulverização do controle em holdings familiares.",
        affectsDraftBlocks: ["db_ingresso_restrito", "db_ingresso_economico"],
        affectsSuggestedDocument: true,
        affectsRisks: ["r_pulverizacao_controle", "r_falecimento_sem_transicao"],
      },
      {
        id: "dq_tipo_ingresso",
        clauseId: "cl_sucessao_quotas",
        title: "Natureza do ingresso",
        prompt: "O ingresso dos sucessores será econômico, político ou ambos?",
        explanation:
          "Definir a natureza do ingresso é essencial para separar quem participa dos resultados de quem participa das decisões.",
        options: [
          { value: "economico", label: "Apenas econômico", description: "Recebem dividendos mas não votam." },
          { value: "politico", label: "Apenas político", description: "Votam mas não recebem resultados diretamente." },
          { value: "ambos", label: "Econômico e político", description: "Direitos plenos." },
        ],
        allowsUndefined: true,
        impacts: {
          economico: [
            { type: "societario", description: "Mantém concentração do poder decisório.", severity: "info" },
            { type: "tributario", description: "Pode haver implicações na distribuição de resultados.", severity: "warning" },
          ],
          politico: [
            { type: "societario", description: "Modelo incomum, mas possível em estruturas específicas.", severity: "warning" },
          ],
          ambos: [
            { type: "societario", description: "Herdeiros terão voz e voto nas deliberações.", severity: "warning" },
            { type: "sucessorio", description: "Pode gerar conflitos se houver herdeiros com perfis distintos.", severity: "warning" },
          ],
        },
        affectsDraftBlocks: ["db_ingresso_economico", "db_separacao_politica_economica"],
        affectsSuggestedDocument: false,
        affectsRisks: ["r_sucessao_politica_economica"],
      },
      {
        id: "dq_tratamento_igual",
        clauseId: "cl_sucessao_quotas",
        title: "Tratamento entre herdeiros",
        prompt: "Todos os herdeiros terão o mesmo tratamento na estrutura societária?",
        explanation:
          "A igualdade formal nem sempre é desejável. Herdeiros com perfis diferentes podem exigir papéis diferentes para preservar a governança e a eficiência da holding.",
        options: [
          { value: "sim", label: "Sim, tratamento igualitário" },
          { value: "nao", label: "Não, tratamento diferenciado", description: "Distinção por perfil, função ou interesse." },
        ],
        allowsUndefined: true,
        impacts: {
          sim: [
            { type: "sucessorio", description: "Todos recebem os mesmos direitos e obrigações.", severity: "info" },
            { type: "societario", description: "Pode dificultar governança se perfis forem muito diferentes.", severity: "warning" },
          ],
          nao: [
            { type: "societario", description: "Permite separar gestores de investidores.", severity: "info" },
            { type: "documental", description: "Exige cláusula específica de distinção e critérios claros.", severity: "info" },
          ],
        },
        affectsDraftBlocks: ["db_distincao_gestor_investidor"],
        affectsSuggestedDocument: false,
        affectsRisks: ["r_conflito_gestor_investidor"],
      },
      {
        id: "dq_distincao_gestor_investidor",
        clauseId: "cl_sucessao_quotas",
        title: "Distinção entre herdeiro gestor e investidor",
        prompt: "Haverá distinção formal entre herdeiro gestor e herdeiro investidor?",
        explanation:
          "A distinção permite que herdeiros com vocação para gestão assumam papéis executivos, enquanto os demais participam economicamente.",
        options: [
          { value: "sim", label: "Sim, com critérios de elegibilidade" },
          { value: "nao", label: "Não, todos serão tratados igualmente" },
        ],
        allowsUndefined: true,
        impacts: {
          sim: [
            { type: "societario", description: "Cria dois perfis de participação na holding.", severity: "info" },
            { type: "sucessorio", description: "Reduz risco de conflitos entre herdeiros com perfis distintos.", severity: "info" },
          ],
          nao: [
            { type: "societario", description: "Todos os herdeiros terão os mesmos direitos de gestão.", severity: "warning" },
          ],
        },
        affectsDraftBlocks: ["db_distincao_gestor_investidor"],
        affectsSuggestedDocument: false,
        affectsRisks: ["r_conflito_gestor_investidor"],
      },
      {
        id: "dq_elegibilidade_admin",
        clauseId: "cl_sucessao_quotas",
        title: "Filtro de elegibilidade para administração",
        prompt: "Haverá filtro de elegibilidade para que um herdeiro possa administrar a holding?",
        explanation:
          "Critérios objetivos ou subjetivos para acesso à gestão protegem a holding contra administradores despreparados.",
        options: [
          { value: "sim_objetivo", label: "Sim, com critérios objetivos", description: "Idade, formação, experiência." },
          { value: "sim_subjetivo", label: "Sim, com aprovação dos demais", description: "Deliberação ou conselho familiar." },
          { value: "nao", label: "Não, qualquer herdeiro pode administrar" },
        ],
        allowsUndefined: true,
        impacts: {
          sim_objetivo: [
            { type: "societario", description: "Critérios mensuráveis protegem contra ingresso inadequado.", severity: "info" },
            { type: "documental", description: "Critérios objetivos podem constar no contrato social.", severity: "info" },
          ],
          sim_subjetivo: [
            { type: "societario", description: "Maior flexibilidade, mas potencial para conflito.", severity: "warning" },
            { type: "documental", description: "Critérios subjetivos devem ficar no acordo de sócios, não no contrato social.", severity: "warning" },
          ],
          nao: [
            { type: "societario", description: "Risco de administração por herdeiro sem preparo.", severity: "critical" },
          ],
        },
        alert: "Critérios subjetivos ou sensíveis não devem ficar integralmente no contrato social.",
        affectsDraftBlocks: ["db_elegibilidade_objetiva", "db_elegibilidade_subjetiva"],
        affectsSuggestedDocument: true,
        affectsRisks: ["r_pulverizacao_controle"],
      },
      {
        id: "dq_admin_transitoria",
        clauseId: "cl_sucessao_quotas",
        title: "Administração transitória",
        prompt: "Haverá administração transitória em caso de morte do sócio administrador?",
        explanation:
          "Define quem assume a gestão imediatamente após o falecimento, evitando vácuo de poder e paralisia decisória.",
        options: [
          { value: "sim", label: "Sim, com regra de transição definida" },
          { value: "nao", label: "Não, segue regra legal" },
        ],
        allowsUndefined: true,
        impacts: {
          sim: [
            { type: "societario", description: "Garante continuidade da gestão sem interrupção.", severity: "info" },
            { type: "sucessorio", description: "Evita vácuo de poder entre falecimento e assembleia.", severity: "info" },
          ],
          nao: [
            { type: "societario", description: "Pode haver paralisia até nova deliberação.", severity: "critical" },
          ],
        },
        affectsDraftBlocks: ["db_admin_transitoria"],
        affectsSuggestedDocument: false,
        affectsRisks: ["r_falecimento_sem_transicao", "r_incapacidade_nao_tratada"],
      },
      {
        id: "dq_aquisicao_remanescentes",
        clauseId: "cl_sucessao_quotas",
        title: "Direito de aquisição pelos remanescentes",
        prompt: "A sociedade ou os sócios remanescentes poderão adquirir a participação do sócio falecido?",
        explanation:
          "Permite que os sócios sobreviventes comprem as quotas do falecido, evitando ingresso de herdeiros na sociedade.",
        options: [
          { value: "sim_preferencia", label: "Sim, com direito de preferência" },
          { value: "sim_compulsoria", label: "Sim, compra compulsória" },
          { value: "nao", label: "Não, herdeiros ingressam" },
        ],
        allowsUndefined: true,
        impacts: {
          sim_preferencia: [
            { type: "societario", description: "Dá opção aos remanescentes, mas não obriga.", severity: "info" },
          ],
          sim_compulsoria: [
            { type: "societario", description: "Herdeiros não ingressam; recebem valor das quotas.", severity: "info" },
            { type: "patrimonial", description: "Exige mecanismo de valuation e pagamento.", severity: "warning" },
          ],
          nao: [
            { type: "sucessorio", description: "Herdeiros ingressam automaticamente.", severity: "warning" },
          ],
        },
        affectsDraftBlocks: ["db_direito_preferencia", "db_compra_compulsoria"],
        affectsSuggestedDocument: true,
        affectsRisks: ["r_litigio_haveres", "r_sem_liquidez_dissidente"],
      },
      {
        id: "dq_liquidacao_haveres",
        clauseId: "cl_sucessao_quotas",
        title: "Liquidação de haveres",
        prompt: "Haverá previsão de liquidação de haveres para o caso de saída ou não ingresso?",
        explanation:
          "A liquidação define como e quanto o herdeiro que não ingressa recebe pela participação do sócio falecido.",
        options: [
          { value: "sim", label: "Sim, com critérios definidos" },
          { value: "nao", label: "Não, sem previsão específica" },
        ],
        allowsUndefined: true,
        impacts: {
          sim: [
            { type: "patrimonial", description: "Reduz litígios sobre valor e forma de pagamento.", severity: "info" },
            { type: "documental", description: "Exige valuation contratual e prazo de pagamento.", severity: "info" },
          ],
          nao: [
            { type: "patrimonial", description: "Risco de judicialização sobre critérios de avaliação.", severity: "critical" },
          ],
        },
        affectsDraftBlocks: ["db_liquidacao_haveres"],
        affectsSuggestedDocument: true,
        affectsRisks: ["r_litigio_haveres"],
      },
      {
        id: "dq_valuation",
        clauseId: "cl_sucessao_quotas",
        title: "Valuation contratual",
        prompt: "Haverá valuation contratual pré-definido para avaliação das quotas?",
        explanation:
          "O valuation contratual evita que a avaliação das quotas seja feita judicialmente, o que é lento, custoso e imprevisível.",
        options: [
          { value: "sim_patrimonial", label: "Sim, valor patrimonial contábil" },
          { value: "sim_mercado", label: "Sim, avaliação por múltiplos ou DCF" },
          { value: "sim_hibrido", label: "Sim, modelo híbrido" },
          { value: "nao", label: "Não, apuração judicial" },
        ],
        allowsUndefined: true,
        impacts: {
          sim_patrimonial: [
            { type: "patrimonial", description: "Método simples, mas pode subavaliar ativos reais.", severity: "warning" },
          ],
          sim_mercado: [
            { type: "patrimonial", description: "Mais justo, mas mais complexo e custoso.", severity: "info" },
          ],
          sim_hibrido: [
            { type: "patrimonial", description: "Combina critérios para maior equilíbrio.", severity: "info" },
          ],
          nao: [
            { type: "patrimonial", description: "Risco de litígio e avaliação judicial imprevisível.", severity: "critical" },
            { type: "tributario", description: "Avaliação judicial pode gerar efeitos tributários inesperados.", severity: "warning" },
          ],
        },
        alert: "Ausência de valuation contratual é uma das principais causas de litígio em holdings familiares.",
        affectsDraftBlocks: ["db_valuation"],
        affectsSuggestedDocument: true,
        affectsRisks: ["r_litigio_haveres"],
      },
      {
        id: "dq_separacao_economica_politica",
        clauseId: "cl_sucessao_quotas",
        title: "Separação entre sucessão econômica e política",
        prompt: "Deve haver separação formal entre sucessão econômica e sucessão política?",
        explanation:
          "Permite que um herdeiro receba os frutos econômicos sem ter direito de voto ou gestão, preservando a governança da holding.",
        options: [
          { value: "sim", label: "Sim, separação formal" },
          { value: "nao", label: "Não, sucessão plena" },
        ],
        allowsUndefined: true,
        impacts: {
          sim: [
            { type: "societario", description: "Preserva concentração do comando em quem tem perfil.", severity: "info" },
            { type: "documental", description: "Exige espelhamento entre contrato social e acordo de sócios.", severity: "warning" },
          ],
          nao: [
            { type: "societario", description: "Todos os herdeiros-sócios participam igualmente das decisões.", severity: "warning" },
          ],
        },
        affectsDraftBlocks: ["db_separacao_politica_economica"],
        affectsSuggestedDocument: true,
        affectsRisks: ["r_sucessao_politica_economica", "r_pulverizacao_controle"],
      },
    ],
    draftBlocks: [
      {
        id: "db_base",
        label: "Regra base de sucessão",
        text: "A transmissão de quotas por falecimento de qualquer sócio será regulada conforme as disposições deste contrato social, assegurando-se aos herdeiros e sucessores os direitos patrimoniais correspondentes à participação do sócio falecido.",
        activatedWhen: [],
        documentTarget: "contrato_social",
      },
      {
        id: "db_ingresso_restrito",
        label: "Restrição ao ingresso automático",
        text: "O ingresso de herdeiros e sucessores no quadro societário dependerá de aprovação pelos sócios remanescentes, em deliberação por maioria qualificada, observados os critérios de elegibilidade previstos no acordo de sócios.",
        activatedWhen: [{ questionId: "dq_ingresso_automatico", answerIn: ["nao"] }],
        documentTarget: "contrato_social",
        draftingNote: "Detalhar critérios de elegibilidade no acordo de sócios.",
      },
      {
        id: "db_ingresso_economico",
        label: "Ingresso apenas econômico",
        text: "Os herdeiros e sucessores terão direito exclusivamente aos frutos econômicos da participação societária, sem direito de voto ou participação na gestão, salvo deliberação em contrário dos sócios remanescentes.",
        activatedWhen: [
          { questionId: "dq_ingresso_automatico", answerIn: ["parcial"] },
          { questionId: "dq_tipo_ingresso", answerIn: ["economico"] },
        ],
        documentTarget: "ambos",
        draftingNote: "Complementar com previsão no acordo de sócios sobre mecanismos de exercício dos direitos econômicos.",
      },
      {
        id: "db_separacao_politica_economica",
        label: "Separação entre sucessão econômica e política",
        text: "Fica estabelecida a distinção entre sucessão econômica — que confere direito à percepção de resultados — e sucessão política — que confere direito de voto e participação nas deliberações societárias. A sucessão política dependerá do preenchimento de critérios de elegibilidade e aprovação pelos sócios remanescentes.",
        activatedWhen: [{ questionId: "dq_separacao_economica_politica", answerIn: ["sim"] }],
        documentTarget: "ambos",
        draftingNote: "Espelhar no acordo de sócios e, se aplicável, no protocolo familiar.",
      },
      {
        id: "db_distincao_gestor_investidor",
        label: "Distinção entre herdeiro gestor e investidor",
        text: "Os herdeiros serão classificados em duas categorias: (i) herdeiro gestor, com direito de participação na administração, e (ii) herdeiro investidor, com direito exclusivamente econômico. Os critérios de classificação e transição entre categorias serão disciplinados no acordo de sócios.",
        activatedWhen: [{ questionId: "dq_distincao_gestor_investidor", answerIn: ["sim"] }],
        documentTarget: "acordo_socios",
        draftingNote: "Definir critérios de transição entre categorias e previsão de reavaliação periódica.",
      },
      {
        id: "db_elegibilidade_objetiva",
        label: "Elegibilidade objetiva para administração",
        text: "Somente poderão exercer a administração da sociedade os sócios que preencham cumulativamente os seguintes requisitos: (i) idade mínima de 25 anos; (ii) formação superior concluída; (iii) experiência mínima de 3 anos em gestão patrimonial, empresarial ou financeira.",
        activatedWhen: [{ questionId: "dq_elegibilidade_admin", answerIn: ["sim_objetivo"] }],
        documentTarget: "contrato_social",
      },
      {
        id: "db_elegibilidade_subjetiva",
        label: "Elegibilidade subjetiva para administração",
        text: "A designação de administradores dentre os herdeiros-sócios dependerá de aprovação pelo conselho familiar ou, na sua ausência, por deliberação dos sócios por maioria qualificada, considerando critérios de mérito, preparo e alinhamento com os valores da família.",
        activatedWhen: [{ questionId: "dq_elegibilidade_admin", answerIn: ["sim_subjetivo"] }],
        documentTarget: "acordo_socios",
        draftingNote: "Critérios subjetivos ou sensíveis não devem constar no contrato social.",
      },
      {
        id: "db_admin_transitoria",
        label: "Administração transitória",
        text: "Em caso de falecimento, incapacidade ou impedimento do sócio administrador, a gestão será exercida interinamente pelo segundo administrador designado ou, na sua ausência, pelo sócio remanescente mais antigo, até deliberação dos sócios em assembleia a ser convocada no prazo máximo de 30 dias.",
        activatedWhen: [{ questionId: "dq_admin_transitoria", answerIn: ["sim"] }],
        documentTarget: "contrato_social",
      },
      {
        id: "db_direito_preferencia",
        label: "Direito de preferência na aquisição",
        text: "Os sócios remanescentes terão direito de preferência para aquisição das quotas do sócio falecido, pelo valor apurado conforme o critério de avaliação previsto neste contrato, a ser exercido no prazo de 60 dias contados da abertura da sucessão.",
        activatedWhen: [{ questionId: "dq_aquisicao_remanescentes", answerIn: ["sim_preferencia"] }],
        documentTarget: "contrato_social",
      },
      {
        id: "db_compra_compulsoria",
        label: "Compra compulsória das quotas",
        text: "Em caso de falecimento de qualquer sócio, a sociedade ou os sócios remanescentes ficam obrigados a adquirir a totalidade das quotas do sócio falecido, pelo valor apurado conforme o critério de avaliação previsto, com pagamento em até 24 parcelas mensais e consecutivas.",
        activatedWhen: [{ questionId: "dq_aquisicao_remanescentes", answerIn: ["sim_compulsoria"] }],
        documentTarget: "ambos",
        draftingNote: "Definir prazo e forma de pagamento. Avaliar necessidade de seguro garantia.",
      },
      {
        id: "db_liquidacao_haveres",
        label: "Liquidação de haveres",
        text: "A liquidação de haveres do sócio falecido será apurada com base no balanço patrimonial especial levantado na data do óbito, acrescido de correção monetária e ajustes previstos no acordo de sócios, com pagamento conforme cronograma ali pactuado.",
        activatedWhen: [{ questionId: "dq_liquidacao_haveres", answerIn: ["sim"] }],
        documentTarget: "ambos",
        draftingNote: "Detalhar critérios de apuração e pagamento no acordo de sócios.",
      },
      {
        id: "db_valuation",
        label: "Valuation contratual",
        text: "Para fins de apuração do valor das quotas em qualquer hipótese de saída, falecimento ou liquidação, as partes adotam como critério de avaliação o valor patrimonial contábil ajustado, apurado com base em balanço especial, podendo ser complementado por avaliação de mercado quando expressamente previsto no acordo de sócios.",
        activatedWhen: [{ questionId: "dq_valuation", answerIn: ["sim_patrimonial", "sim_mercado", "sim_hibrido"] }],
        documentTarget: "ambos",
        draftingNote: "Diferenciar tratamento entre contrato social (regra geral) e acordo de sócios (critérios detalhados e gatilhos).",
      },
    ],
    draftingNotes: [
      "A redação final deve ser validada por advogado especializado em direito societário e sucessório.",
      "Cláusulas com critérios subjetivos devem ficar preferencialmente no acordo de sócios.",
      "Verificar compatibilidade com eventuais cláusulas de doação já existentes.",
      "Considerar espelhamento entre contrato social e acordo de sócios nos pontos de interesse comum.",
    ],
    documentAllocationNotes: [
      {
        documentType: "contrato_social",
        label: "Contrato Social",
        whatGoesThere: "Regra estrutural de transmissão, critérios objetivos de elegibilidade, administração transitória, direito de preferência.",
        rationale: "Documento público que define a estrutura formal da sociedade. Deve conter regras universais e objetivas.",
        riskIfWrong: "Incluir critérios subjetivos ou dinâmicas familiares pode expor matéria sensível em documento de publicidade.",
      },
      {
        documentType: "acordo_socios",
        label: "Acordo de Sócios",
        whatGoesThere: "Critérios subjetivos de elegibilidade, distinção entre gestor e investidor, detalhamento de valuation, dinâmicas de voto, governança entre ramos familiares.",
        rationale: "Documento reservado entre os sócios. Permite maior detalhamento estratégico e critérios sensíveis.",
        riskIfWrong: "Omitir detalhamento no acordo pode gerar lacunas interpretativas e conflito.",
      },
      {
        documentType: "memorando_estrategico",
        label: "Memorando Estratégico",
        whatGoesThere: "Racional da arquitetura sucessória, justificativa da separação entre sucessão econômica e política, fundamentos das escolhas feitas.",
        rationale: "Documento interno que registra a inteligência por trás das decisões, útil para revisão futura.",
        riskIfWrong: "Sem memorando, decisões estratégicas ficam sem registro e difíceis de sustentar ou revisar.",
      },
      {
        documentType: "protocolo_familiar",
        label: "Protocolo Familiar",
        whatGoesThere: "Compromissos familiares sobre governança, valores, critérios de conduta e regras de convivência societária.",
        rationale: "Documento de adesão familiar que complementa a estrutura jurídica com compromissos éticos e comportamentais.",
        riskIfWrong: "Sem protocolo, acordos informais podem não ter força ou clareza entre os familiares.",
      },
    ],
  },
};
