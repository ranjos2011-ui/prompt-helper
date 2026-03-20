import { ModuleDefinition } from "../types/module";

export const modules: ModuleDefinition[] = [
  {
    id: "succession_holding_module",
    name: "Sucessão Empresarial na Holding Patrimonial",
    status: "active",
    description:
      "Estruture sucessão, controle, renda, governança, proteção patrimonial e arquitetura documental.",
  },
  {
    id: "governance_module",
    name: "Governança Societária da Holding",
    status: "coming_soon",
    description:
      "Regras de governança, administração, quóruns e dinâmicas de deliberação.",
  },
  {
    id: "donation_module",
    name: "Doação de Quotas com Restrições",
    status: "coming_soon",
    description:
      "Modelagem de transmissão em vida com reservas e cláusulas protetivas.",
  },
  {
    id: "family_protocol_module",
    name: "Protocolo Familiar",
    status: "coming_soon",
    description:
      "Organização de regras familiares, sucessórias e comportamentais.",
  },
  {
    id: "tax_memo_module",
    name: "Memorando Tributário Patrimonial",
    status: "coming_soon",
    description:
      "Mapeamento de impactos e alertas tributários patrimoniais.",
  },
  {
    id: "international_integration_module",
    name: "Integração Internacional",
    status: "coming_soon",
    description:
      "Compatibilização com offshore, trust, JTWRS, minitrust e documentos externos.",
  },
];
