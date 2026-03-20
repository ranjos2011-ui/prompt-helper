import { ClauseDetailConfig } from "../../types/clauseBuilder";
import { FileText, PenLine, AlertCircle } from "lucide-react";
import { documentTypeLabels } from "../../lib/labels";

interface Props {
  config: ClauseDetailConfig;
  activatedBlockIds: string[];
  draftPreview: string;
}

export function ClauseDraftPreview({ config, activatedBlockIds, draftPreview }: Props) {
  const activeBlocks = config.draftBlocks.filter((b) => activatedBlockIds.includes(b.id));
  const isBase = activatedBlockIds.length <= 1;

  return (
    <div className="space-y-6">
      {isBase && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-xs text-muted-foreground flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          Responda as perguntas de customização para ativar trechos adicionais da redação.
        </div>
      )}

      {/* Draft blocks */}
      <div className="space-y-4">
        {activeBlocks.map((block) => (
          <div key={block.id} className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/20 px-4 py-2.5 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <PenLine className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">{block.label}</span>
              </div>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {documentTypeLabels[block.documentTarget] || block.documentTarget}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm text-foreground/90 leading-relaxed font-serif">{block.text}</p>
              {block.draftingNote && (
                <p className="text-[11px] text-muted-foreground italic mt-3 pt-2 border-t border-border/50">
                  Nota: {block.draftingNote}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* General drafting notes */}
      {config.draftingNotes.length > 0 && (
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Observações de redação
          </h3>
          <ul className="space-y-2">
            {config.draftingNotes.map((note, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0 mt-1.5" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
