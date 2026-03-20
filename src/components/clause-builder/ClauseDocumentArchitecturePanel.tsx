import { ClauseDetailConfig } from "../../types/clauseBuilder";
import { documentTypeLabels } from "../../lib/labels";
import { FolderOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getActiveBlocksByDocument } from "../../lib/clauseDraftEngine";

interface Props {
  config: ClauseDetailConfig;
  activatedBlockIds: string[];
}

export function ClauseDocumentArchitecturePanel({ config, activatedBlockIds }: Props) {
  const blocksByDoc = getActiveBlocksByDocument(config, activatedBlockIds);

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Veja como o conteúdo da cláusula se distribui entre os documentos da arquitetura jurídica.
      </p>

      {/* Allocation notes */}
      <div className="space-y-3">
        {config.documentAllocationNotes.map((note) => {
          const blocks = blocksByDoc[note.documentType] || [];
          const isActive = blocks.length > 0;

          return (
            <div
              key={note.documentType}
              className={`border rounded-lg overflow-hidden ${
                isActive ? "border-primary/20 bg-primary/[0.02]" : "border-border bg-card"
              }`}
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                  <FolderOpen className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
                  <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {note.label}
                  </span>
                </div>
                {isActive && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {blocks.length} {blocks.length === 1 ? "bloco" : "blocos"} ativo{blocks.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">O que vai aqui</p>
                  <p className="text-xs text-foreground/80">{note.whatGoesThere}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">Justificativa</p>
                  <p className="text-xs text-muted-foreground">{note.rationale}</p>
                </div>
                <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/10 rounded p-2.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-destructive/70 font-medium mb-0.5">Risco de alocação errada</p>
                    <p className="text-xs text-destructive/80">{note.riskIfWrong}</p>
                  </div>
                </div>

                {/* Active blocks in this document */}
                {isActive && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-2">Blocos ativados</p>
                    {blocks.map((block) => (
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
    </div>
  );
}
