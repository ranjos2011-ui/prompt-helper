import { ClauseDetailConfig } from "../../types/clauseBuilder";
import { documentTypeLabels } from "../../lib/labels";
import { FolderOpen, AlertTriangle, CheckCircle2, Building2, Handshake, Shield, FileCheck, Umbrella } from "lucide-react";
import { getActiveBlocksByDocument } from "../../lib/clauseDraftEngine";
import { usePatrimonialBuilderStore } from "../../store/usePatrimonialBuilderStore";

interface Props {
  config: ClauseDetailConfig;
  activatedBlockIds: string[];
}

const hierarchyDocuments = [
  {
    key: "contrato_social" as const,
    label: "Contrato Social",
    role: "Documento estrutural principal",
    icon: Building2,
    description: "Espinha dorsal da arquitetura sucessória e societária. Regras universais, objetivas e formais.",
  },
  {
    key: "acordo_socios" as const,
    label: "Acordo de Sócios",
    role: "Documento estrutural complementar",
    icon: Handshake,
    description: "Refinamento de governança, critérios subjetivos, voto, elegibilidade e detalhamento reservado.",
  },
  {
    key: "seguro_vida" as const,
    label: "Seguro de Vida",
    role: "Instrumento complementar prioritário",
    icon: Umbrella,
    description: "Suporte financeiro para viabilizar compra de participação, pagamento de haveres ou bloqueio de ingresso sem comprometer o caixa.",
  },
  {
    key: "protocolo_familiar" as const,
    label: "Protocolo Familiar",
    role: "Documento complementar de governança",
    icon: Shield,
    description: "Alinhamento de expectativas, convivência, distinção entre herdeiros e diretrizes de sucessão familiar.",
  },
  {
    key: "alteracao_contratual" as const,
    label: "Alteração Contratual / Atos de Implementação",
    role: "Documento de execução",
    icon: FileCheck,
    description: "Formalização das decisões: alteração contratual, adesão a acordo e ajustes societários posteriores.",
  },
];

export function ClauseDocumentArchitecturePanel({ config, activatedBlockIds }: Props) {
  const blocksByDoc = getActiveBlocksByDocument(config, activatedBlockIds);
  const { clauseDraftStates } = usePatrimonialBuilderStore();
  const draftState = clauseDraftStates[config.clauseId];
  const answers = draftState?.answers || {};

  // Determine if seguro de vida should be suggested based on answers
  const needsSeguroVida =
    answers.dq_aquisicao_remanescentes === "sim_compulsoria" ||
    answers.dq_aquisicao_remanescentes === "sim_preferencia" ||
    answers.dq_liquidacao_haveres === "sim" ||
    answers.dq_ingresso_automatico === "nao";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Hierarquia documental desta cláusula</h3>
        <p className="text-xs text-muted-foreground">
          Veja como o conteúdo se distribui entre os documentos, seguindo a hierarquia da arquitetura sucessória.
        </p>
      </div>

      {/* Hierarchy cards */}
      <div className="space-y-3">
        {hierarchyDocuments.map((doc, index) => {
          const Icon = doc.icon;
          const allocationNote = config.documentAllocationNotes.find(
            (n) => n.documentType === doc.key
          );
          const blocks = blocksByDoc[doc.key] || [];
          // For "ambos", also check both sub-docs
          const ambosBlocks = doc.key === "contrato_social" || doc.key === "acordo_socios"
            ? (blocksByDoc["ambos"] || [])
            : [];
          const allBlocks = [...blocks, ...ambosBlocks];
          const isActive = allBlocks.length > 0 || (doc.key === "seguro_vida" && needsSeguroVida);
          const isSeguroSuggested = doc.key === "seguro_vida" && needsSeguroVida;

          return (
            <div
              key={doc.key}
              className={`border rounded-lg overflow-hidden transition-colors ${
                isActive ? "border-primary/20 bg-primary/[0.02]" : "border-border bg-card"
              }`}
            >
              {/* Header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground/50 w-5 text-center">{index + 1}</span>
                <div className={`p-1 rounded ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/50"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {doc.label}
                  </span>
                  <p className="text-[10px] text-muted-foreground/70">{doc.role}</p>
                </div>
                {allBlocks.length > 0 && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">
                    {allBlocks.length} {allBlocks.length === 1 ? "bloco" : "blocos"}
                  </span>
                )}
                {isSeguroSuggested && allBlocks.length === 0 && (
                  <span className="text-[10px] bg-warning/15 text-warning px-2 py-0.5 rounded-full font-medium shrink-0">
                    Recomendado
                  </span>
                )}
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">{doc.description}</p>

                {/* Allocation note details */}
                {allocationNote && (
                  <>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">O que vai aqui</p>
                      <p className="text-xs text-foreground/80">{allocationNote.whatGoesThere}</p>
                    </div>
                    <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/10 rounded p-2.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-destructive/70 font-medium mb-0.5">Risco de alocação errada</p>
                        <p className="text-xs text-destructive/80">{allocationNote.riskIfWrong}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Seguro de vida special suggestion */}
                {isSeguroSuggested && (
                  <div className="flex items-start gap-2 bg-warning/10 border border-warning/20 rounded p-2.5">
                    <Umbrella className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-warning/80 font-medium mb-0.5">Instrumento recomendado</p>
                      <p className="text-xs text-foreground/80">
                        As decisões do caso indicam necessidade de liquidez para compra de participação ou pagamento de haveres. O seguro de vida pode viabilizar essa operação sem comprometer o caixa da holding.
                      </p>
                    </div>
                  </div>
                )}

                {/* Active blocks */}
                {allBlocks.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-2">Blocos ativados</p>
                    {allBlocks.map((block) => (
                      <div key={block.id} className="flex items-center gap-2 text-xs text-foreground/80 py-1">
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                        {block.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Implementation note */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-start gap-2">
          <FileCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-foreground mb-1">Etapas de implementação</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Alteração contratual para refletir a cláusula no contrato social</li>
              <li>• Celebração ou aditamento do acordo de sócios</li>
              <li>• Contratação de seguro de vida, se aplicável</li>
              <li>• Formalização do protocolo familiar, se aplicável</li>
              <li>• Registro e averbação dos atos pertinentes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
