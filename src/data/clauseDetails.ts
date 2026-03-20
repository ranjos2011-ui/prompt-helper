import { ClauseDetailConfig } from "../types/clauseBuilder";

export const clauseDetailConfigs: Record<string, ClauseDetailConfig> = {
  cl_sucessao_quotas: {
    clauseId: "cl_sucessao_quotas",
    defaultRuleText:
      "Na morte do sócio, a regra geral é a liquidação da quota, salvo se: (i) o contrato social dispuser de modo diverso; (ii) os sócios remanescentes optarem pela dissolução; ou (iii) houver acordo com os herdeiros para regular a substituição do sócio falecido (art. 1.028, Código Civil).",
    defaultRuleExplanation:
      "A regra padrão não significa ingresso automático dos herdeiros. O default legal pode ser insuficiente para holdings patrimoniais, pois não distingue entre direitos econômicos e políticos, não trata transição de gestão e não prevê mecanismos de valuation. Por isso, o planejador pode — e deve — customizar a solução.",
    whyItMatters: [
      "Continuidade do comando e da administração da holding.",
      "Entrada ou não dos herdeiros — e em que condições.",
      "Separação entre direitos econômicos e políticos.",
      "Critérios de valuation e liquidação de haveres.",
      "Liquidez e porta de saída para herdeiros dissidentes.",
      "Transição de administração em caso de falecimento.",
      "Redução do risco de litígio entre herdeiros e sócios.",
    ],
    problemsAvoided: [
      "Ingresso desorganizado de herdeiros sem preparo ou legitimidade para gestão.",
      "Pulverização do controle decisório entre múltiplos sucessores.",
      "Conflito entre titularidade econômica e comando político da holding.",
      "Litígios sobre saída, haveres e critérios de avaliação.",
      "Indefinição sobre administração interina em caso de falecimento.",
    ],
    commonProblems: [
      {
        id: "cp_liquidez_forcada",
        title: "Liquidação pode pressionar o caixa",
        description: "Se aplicada a regra padrão de liquidação, o pagamento de haveres pode comprometer a liquidez da holding, especialmente quando o patrimônio é imobilizado.",
        severity: "high",
        relatedRiskIds: ["r_litigio_haveres", "r_sem_liquidez_dissidente"],
      },
      {
        id: "cp_ingresso_sem_disciplina",
        title: "Ausência de disciplina sobre ingresso de herdeiros",
        description: "Sem regra contratual, não há clareza se os herdeiros ingressam, em que posição e com que direitos — gerando incerteza e potencial litígio.",
        severity: "high",
        relatedRiskIds: ["r_pulverizacao_controle", "r_falecimento_sem_transicao"],
      },
      {
        id: "cp_sem_separacao_eco_pol",
        title: "Falta de separação entre sucessão econômica e política",
        description: "O padrão legal não distingue quem recebe dividendos de quem decide. Todos os herdeiros podem pleitear voto e gestão.",
        severity: "high",
        relatedRiskIds: ["r_sucessao_politica_economica", "r_conflito_gestor_investidor"],
      },
      {
        id: "cp_pulverizacao",
        title: "Risco de pulverização do controle",
        description: "Múltiplos herdeiros ingressando com direitos plenos podem diluir a capacidade de comando e decisão da holding.",
        severity: "high",
        relatedRiskIds: ["r_pulverizacao_controle"],
      },
      {
        id: "cp_litigio_haveres",
        title: "Litígio sobre haveres",
        description: "Sem critérios pré-definidos de avaliação, a apuração de haveres tende a ser judicializada — lenta, custosa e imprevisível.",
        severity: "medium",
        relatedRiskIds: ["r_litigio_haveres"],
      },
      {
        id: "cp_vacio_gestao",
        title: "Incerteza sobre administração e transição",
        description: "O falecimento do administrador pode gerar vácuo de poder se não houver previsão de gestão interina.",
        severity: "medium",
        relatedRiskIds: ["r_falecimento_sem_transicao", "r_incapacidade_nao_tratada"],
      },
      {
        id: "cp_sem_filtro",
        title: "Ausência de filtro para herdeiros gestores e não gestores",
        description: "Sem elegibilidade, herdeiros sem preparo podem assumir a administração, comprometendo a governança.",
        severity: "medium",
        relatedRiskIds: ["r_conflito_gestor_investidor"],
      },
    ],
    defaultRisksCovered: [
      "r_pulverizacao_controle",
      "r_falecimento_sem_transicao",
      "r_conflito_gestor_investidor",
      "r_sucessao_politica_economica",
    ],
    decisionQuestions: [
      {
        id: "dq_manter_regra_padrao",
        clauseId: "cl_sucessao_quotas",
        title: "Regra padrão de liquidação",
        prompt: "Deseja manter a regra padrão de liquidação da quota ou afastá-la?",
        explanation:
          "Manter a regra legal significa que, por default, haverá liquidação das quotas do sócio falecido. Afastá-la permite desenhar soluções alternativas — como ingresso, compra ou tratamento diferenciado.",
        options: [
          { value: "manter", label: "Manter regra padrão (liquidação)", description: "Aplica-se a liquidação de haveres." },
          { value: "afastar", label: "Afastar e customizar", description: "Definir solução alternativa." },
        ],
        allowsUndefined: true,
        impacts: {
          manter: [
            { type: "patrimonial", description: "Haveres serão apurados e pagos — pode pressionar o caixa.", severity: "warning" },
            { type: "societario", description: "Herdeiros não ingressam na sociedade.", severity: "info" },
          ],
          afastar: [
            { type: "societario", description: "Permite desenhar ingresso, compra ou solução híbrida.", severity: "info" },
          ],
        },
        affectsDraftBlocks: [],
        affectsSuggestedDocument: false,
        affectsRisks: ["r_litigio_haveres"],
        activatesTemplates: { manter: ["tpl_a_liquidacao"], afastar: [] },
      },
      {
        id: "dq_ingresso_automatico",
        clauseId: "cl_sucessao_quotas",
        title: "Ingresso automático dos herdeiros",
        prompt: "Os herdeiros ingressarão automaticamente na sociedade após o falecimento do sócio?",
        explanation:
          "O ingresso automático significa que os herdeiros passam a integrar o quadro societário sem necessidade de aprovação dos demais sócios.",
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
            { type: "documental", description: "Requer espelhamento entre contrato social e acordo de sócios.", severity: "warning" },
          ],
        },
        alert: "O ingresso automático é a principal causa de pulverização do controle em holdings familiares.",
        affectsDraftBlocks: ["db_ingresso_restrito", "db_ingresso_economico"],
        affectsSuggestedDocument: true,
        affectsRisks: ["r_pulverizacao_controle", "r_falecimento_sem_transicao"],
        activatesTemplates: {
          sim: ["tpl_b_ingresso_automatico"],
          nao: ["tpl_d_ingresso_condicionado"],
          parcial: ["tpl_c_ingresso_economico"],
        },
      },
      {
        id: "dq_tipo_ingresso",
        clauseId: "cl_sucessao_quotas",
        title: "Natureza do ingresso",
        prompt: "Se ingressarem, entrarão com direitos econômicos, políticos ou ambos?",
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
          "A igualdade formal nem sempre é desejável. Herdeiros com perfis diferentes podem exigir papéis diferentes.",
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
        activatesTemplates: { nao: ["tpl_f_hibrida"] },
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
        activatesTemplates: {
          sim_preferencia: ["tpl_e_compra_remanescentes"],
          sim_compulsoria: ["tpl_e_compra_remanescentes"],
        },
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
        activatesBlocks: { sim: ["tpl_h_valuation_haveres"] },
      },
      {
        id: "dq_valuation",
        clauseId: "cl_sucessao_quotas",
        title: "Valuation contratual",
        prompt: "Haverá valuation contratual pré-definido para avaliação das quotas?",
        explanation:
          "O valuation contratual evita que a avaliação das quotas seja feita judicialmente.",
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
        activatesBlocks: {
          sim_patrimonial: ["tpl_h_valuation_haveres"],
          sim_mercado: ["tpl_h_valuation_haveres"],
          sim_hibrido: ["tpl_h_valuation_haveres"],
        },
      },
      {
        id: "dq_admin_transitoria",
        clauseId: "cl_sucessao_quotas",
        title: "Administração transitória",
        prompt: "Haverá administração transitória em caso de falecimento do sócio administrador?",
        explanation:
          "Define quem assume a gestão imediatamente após o falecimento, evitando vácuo de poder.",
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
        activatesBlocks: { sim: ["tpl_g_admin_transitoria"] },
      },
      {
        id: "dq_separacao_economica_politica",
        clauseId: "cl_sucessao_quotas",
        title: "Separação entre sucessão econômica e política",
        prompt: "Deve haver separação formal entre sucessão econômica e sucessão política?",
        explanation:
          "Permite que um herdeiro receba os frutos econômicos sem ter direito de voto ou gestão.",
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
        activatesTemplates: { sim: ["tpl_c_ingresso_economico"] },
      },
    ],
    optionTemplates: [
      {
        id: "tpl_a_liquidacao",
        letter: "A",
        title: "Liquidação da quota",
        summary: "Na morte do sócio, a sociedade não continua com os herdeiros. Procede-se à liquidação de haveres.",
        recommendedWhen: [
          "Não se deseja ingresso de herdeiros na sociedade.",
          "Há preocupação com pulverização do controle.",
          "A holding tem liquidez para pagar haveres.",
        ],
        risks: [
          "Pode pressionar o caixa se o patrimônio for imobilizado.",
          "Herdeiros não terão participação societária.",
        ],
        templateText: `CLÁUSULA [X] — FALECIMENTO DE SÓCIO E LIQUIDAÇÃO DE QUOTAS

No caso de falecimento de qualquer sócio, a sociedade não será automaticamente continuada com seus herdeiros ou sucessores, procedendo-se à liquidação das quotas de titularidade do sócio falecido, na forma do art. 1.028 do Código Civil e das demais disposições deste contrato.

§1º O valor dos haveres do sócio falecido será apurado com base em balanço especialmente levantado na data do evento, observados os critérios contábeis e patrimoniais previstos neste contrato.

§2º Os haveres apurados serão pagos ao espólio ou aos sucessores legalmente habilitados em [x] parcelas mensais, iguais e sucessivas, corrigidas por [índice], vencendo-se a primeira em [x] dias após a homologação da apuração.

§3º Até a integral liquidação dos haveres, os herdeiros ou sucessores não participarão da administração da sociedade nem exercerão direitos políticos inerentes às quotas liquidadas.

§4º A sociedade poderá, por deliberação dos sócios remanescentes, antecipar total ou parcialmente o pagamento dos haveres.`,
        isComplementary: false,
      },
      {
        id: "tpl_b_ingresso_automatico",
        letter: "B",
        title: "Ingresso automático dos herdeiros",
        summary: "As quotas são transferidas aos herdeiros na proporção de seus direitos sucessórios, sem liquidação.",
        recommendedWhen: [
          "Deseja-se continuidade da composição societária.",
          "Os herdeiros estão preparados para integrar a holding.",
          "Há baixo risco de conflito entre herdeiros.",
        ],
        risks: [
          "Pulverização do controle se houver muitos herdeiros.",
          "Herdeiros sem preparo podem ingressar na gestão.",
        ],
        templateText: `CLÁUSULA [X] — SUCESSÃO AUTOMÁTICA NAS QUOTAS

No caso de falecimento de sócio, suas quotas serão transferidas aos respectivos herdeiros ou sucessores, na forma da partilha, adjudicação ou outro título sucessório juridicamente idôneo, independentemente de liquidação, observadas as restrições deste contrato.

§1º Os sucessores ingressarão na sociedade na proporção de seus direitos sucessórios, sucedendo o sócio falecido em sua posição societária.

§2º Até a regularização formal da sucessão perante a sociedade, os direitos patrimoniais correspondentes às quotas ficarão reservados ao espólio, representado por seu inventariante ou representante legalmente constituído.

§3º A sociedade promoverá a competente alteração contratual após a apresentação da documentação sucessória pertinente.

§4º O ingresso dos sucessores não afasta a aplicação das regras de administração, voto, restrição de cessão e demais disposições deste contrato e do acordo de sócios, se houver.`,
        isComplementary: false,
      },
      {
        id: "tpl_c_ingresso_economico",
        letter: "C",
        title: "Ingresso apenas econômico",
        summary: "Os sucessores recebem direitos econômicos, mas sem voto ou administração automáticos.",
        recommendedWhen: [
          "Deseja-se separar direitos econômicos de direitos políticos.",
          "Há herdeiros com perfis distintos.",
          "Preservação do comando é prioridade.",
        ],
        risks: [
          "Pode gerar insatisfação em herdeiros que se considerem aptos à gestão.",
          "Exige espelhamento cuidadoso entre documentos.",
        ],
        templateText: `CLÁUSULA [X] — SUCESSÃO ECONÔMICA COM RESTRIÇÃO POLÍTICA

No caso de falecimento de sócio, os sucessores farão jus aos direitos econômicos correspondentes às quotas do sócio falecido, inclusive distribuição de lucros e demais proventos, sem que isso lhes assegure, automaticamente, o exercício de direitos políticos ou de administração na sociedade.

§1º O exercício de voto e a participação na administração relativamente às quotas transmitidas dependerão de deliberação dos sócios remanescentes, na forma deste contrato e do acordo de sócios.

§2º Enquanto não houver deliberação expressa sobre o exercício dos direitos políticos, as quotas transmitidas permanecerão com direitos econômicos assegurados, mas com exercício político suspenso ou concentrado na forma definida neste instrumento.

§3º Os sucessores poderão permanecer na qualidade de quotistas investidores, sem acesso à administração, salvo se preenchidos os requisitos de elegibilidade previstos na Cláusula [x].

§4º Permanecem válidas as regras de proteção patrimonial, restrição de cessão, liquidação de haveres e saída previstas neste contrato.`,
        isComplementary: false,
      },
      {
        id: "tpl_d_ingresso_condicionado",
        letter: "D",
        title: "Ingresso condicionado à aprovação",
        summary: "Os herdeiros só ingressam como quotistas plenos se aprovados pelos sócios remanescentes.",
        recommendedWhen: [
          "Deseja-se filtro de elegibilidade.",
          "Há herdeiros de diferentes uniões.",
          "É necessário preservar governança e alinhamento.",
        ],
        risks: [
          "Pode ser impugnado se critérios forem vagos ou discriminatórios.",
          "Exige definição clara do que acontece se o ingresso for recusado.",
        ],
        templateText: `CLÁUSULA [X] — INGRESSO CONDICIONADO DOS SUCESSORES

No caso de falecimento de sócio, os herdeiros ou sucessores somente ingressarão na sociedade como quotistas plenos mediante aprovação dos sócios remanescentes, nos termos deste contrato.

§1º A aprovação dependerá da verificação cumulativa dos seguintes requisitos:
I — adesão formal ao contrato social e ao acordo de sócios, se houver;
II — inexistência de conflito de interesses materialmente relevante com a sociedade;
III — preenchimento dos critérios de elegibilidade previstos para participação na administração, quando aplicável;
IV — apresentação da documentação sucessória pertinente.

§2º Na hipótese de não aprovação do ingresso como quotista pleno, os sucessores farão jus à liquidação dos haveres, na forma da Cláusula [x], ou à solução alternativa prevista neste contrato.

§3º A aprovação para ingresso na sociedade não implica, por si só, autorização para exercício de administração ou poderes de gestão.`,
        isComplementary: false,
      },
      {
        id: "tpl_e_compra_remanescentes",
        letter: "E",
        title: "Compra pelos remanescentes ou pela sociedade",
        summary: "Os sócios remanescentes têm preferência para adquirir as quotas do falecido antes de qualquer ingresso.",
        recommendedWhen: [
          "Deseja-se concentrar o controle nos remanescentes.",
          "Os remanescentes têm capacidade financeira.",
          "Há risco de conflito com herdeiros ingressantes.",
        ],
        risks: [
          "Exige valuation robusto e capacidade financeira.",
          "Se não exercido, precisa de solução subsidiária.",
        ],
        templateText: `CLÁUSULA [X] — DIREITO DE AQUISIÇÃO DAS QUOTAS DO SÓCIO FALECIDO

No caso de falecimento de sócio, os sócios remanescentes terão direito de adquirir, total ou parcialmente, as quotas de titularidade do falecido, com preferência sobre qualquer ingresso de sucessores na sociedade.

§1º O direito previsto nesta cláusula poderá ser exercido no prazo de [x] dias contados da ciência formal do falecimento e da apresentação da documentação mínima necessária.

§2º O preço de aquisição será apurado conforme os critérios de valuation previstos na Cláusula [x].

§3º Não exercido o direito pelos sócios remanescentes, a sociedade poderá deliberar sobre a aquisição, redução de capital, liquidação de haveres ou ingresso dos sucessores, conforme as demais disposições deste contrato.

§4º Exercido o direito de aquisição, os sucessores não ingressarão na sociedade, limitando-se seus direitos ao recebimento do preço apurado.`,
        isComplementary: false,
      },
      {
        id: "tpl_f_hibrida",
        letter: "F",
        title: "Solução híbrida",
        summary: "Permite tratamento diferenciado entre sucessores: ingresso, direitos econômicos ou liquidação.",
        recommendedWhen: [
          "Há herdeiros com perfis muito distintos.",
          "Deseja-se flexibilidade na arquitetura.",
          "Existem filhos de diferentes uniões.",
        ],
        risks: [
          "Exige documentação mais complexa.",
          "Pode ser desafiada por herdeiros que se sintam preteridos.",
        ],
        templateText: `CLÁUSULA [X] — SUCESSÃO DIFERENCIADA ENTRE SUCESSORES

No caso de falecimento de sócio, poderá ser adotada solução sucessória diferenciada entre os sucessores, admitindo-se:
I — o ingresso de determinados sucessores como quotistas;
II — a atribuição a outros sucessores apenas de direitos econômicos;
III — a liquidação de haveres de sucessores que não devam ou não queiram permanecer vinculados à sociedade.

§1º A definição do tratamento aplicável a cada sucessor observará:
I — a vontade expressa do planejamento societário e sucessório formalizado pelo sócio falecido;
II — os critérios de elegibilidade e governança previstos neste contrato e em instrumentos complementares;
III — a preservação da continuidade da holding patrimonial e do bloco de controle.

§2º Sempre que houver distinção entre sucessores, a sociedade deverá formalizar a respectiva arquitetura documental em alteração contratual, acordo de sócios e, quando cabível, protocolo familiar.`,
        isComplementary: false,
      },
      {
        id: "tpl_g_admin_transitoria",
        letter: "G",
        title: "Administração transitória (bloco complementar)",
        summary: "Define quem assume a gestão durante o período de transição após o falecimento do administrador.",
        recommendedWhen: [
          "O sócio falecido exercia função de administração.",
          "Deseja-se evitar vácuo de poder.",
          "Há necessidade de continuidade operacional.",
        ],
        risks: [
          "Administrador interino pode não ter legitimidade perante todos os herdeiros.",
        ],
        templateText: `CLÁUSULA [X] — TRANSIÇÃO DE ADMINISTRAÇÃO APÓS FALECIMENTO

No caso de falecimento de sócio que exerça função de administração ou detenha poderes relevantes de gestão, a administração da sociedade será exercida, em caráter transitório, por [administrador substituto / sócios remanescentes / comitê de transição], até deliberação definitiva nos termos deste contrato.

§1º O regime transitório terá duração de até [x] meses, prorrogável por deliberação societária.

§2º Durante o período de transição, ficarão suspensos quaisquer pleitos de ingresso automático de sucessores na administração, salvo deliberação expressa em sentido diverso.

§3º A transição deverá observar a preservação da continuidade operacional, do patrimônio e da governança da sociedade.`,
        isComplementary: true,
      },
      {
        id: "tpl_h_valuation_haveres",
        letter: "H",
        title: "Valuation e haveres (bloco complementar)",
        summary: "Define critérios de avaliação e pagamento quando houver liquidação, aquisição ou saída.",
        recommendedWhen: [
          "Há liquidação de haveres prevista.",
          "Há direito de compra por remanescentes.",
          "Há necessidade de critérios pré-definidos de avaliação.",
        ],
        risks: [
          "Critérios rígidos podem subavaliar o patrimônio.",
          "Ausência total de critérios gera judicialização.",
        ],
        templateText: `CLÁUSULA [X] — APURAÇÃO E PAGAMENTO DE HAVERES

Sempre que houver liquidação de quotas, aquisição por sócios remanescentes, retirada de sucessores ou outra hipótese de resolução da participação decorrente do falecimento de sócio, os haveres serão apurados conforme os seguintes critérios:

I — levantamento de balanço especial na data do evento;
II — consideração de [valor patrimonial contábil / valor patrimonial ajustado / laudo por avaliador independente / fórmula híbrida];
III — exclusão ou inclusão dos elementos expressamente definidos neste contrato;
IV — pagamento em [x] parcelas, corrigidas por [índice], com vencimento inicial em [x] dias.

§1º Havendo divergência quanto à avaliação, será nomeado terceiro avaliador independente, cujo laudo prevalecerá, salvo erro material manifesto.

§2º A apuração de haveres não conferirá aos sucessores poderes de administração ou voto além daqueles expressamente previstos neste contrato.`,
        isComplementary: true,
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
        draftingNote: "Complementar com previsão no acordo de sócios.",
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
        draftingNote: "Definir critérios de transição entre categorias.",
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
        draftingNote: "Critérios subjetivos não devem constar no contrato social.",
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
        draftingNote: "Diferenciar tratamento entre contrato social e acordo de sócios.",
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
