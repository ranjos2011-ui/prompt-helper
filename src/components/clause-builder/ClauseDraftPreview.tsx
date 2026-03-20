import { ClauseDetailConfig, ClauseOptionTemplate } from "../../types/clauseBuilder";
import { FileText, PenLine, AlertCircle, Copy } from "lucide-react";
import { documentTypeLabels } from "../../lib/labels";
import { toast } from "sonner";

interface Props {
  config: ClauseDetailConfig;
  activatedBlockIds: string[];
  draftPreview: string;
  selectedTemplate?: ClauseOptionTemplate;
  selectedComplementaryTemplates?: ClauseOptionTemplate[];
}

export function ClauseDraftPreview({
  config,
  activatedBlockIds,
  draftPreview,
  selectedTemplate,
  selectedComplementaryTemplates = [],
}: Props) {
  const activeBlocks = config.draftBlocks.filter((b) => activatedBlockIds.includes(b.id));
  const hasTemplate = !!selectedTemplate;
  const hasBlocks = activeBlocks.length > 0;
  const isEmpty = !hasTemplate && activeBlocks.length <= 1;

  const handleCopyAll = () => {
    const parts: string[] = [];
    if (selectedTemplate) parts.push(selectedTemplate.templateText);
    selectedComplementaryTemplates.forEach((t) => parts.push(t.templateText));
    activeBlocks.forEach((b) => parts.push(b.text));
    navigator.clipboard.writeText(parts.join("\n\n"));
    toast.success("Redação copiada para a área de transferência.");
  };

  return (
    <div className="space-y-6">
      {isEmpty && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-xs text-muted-foreground flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          Responda as perguntas de customização e selecione um modelo para montar a redação dinâmica.
        </div>
      )}

      {/* Selected template */}
      {selectedTemplate && (
        <div className="border border-primary/20 rounded-lg overflow-hidden">
          <div className="bg-primary/5 px-4 py-2.5 flex items-center justify-between border-b border-primary/10">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded bg-primary text-primary-foreground text-xs font-bold">
                {selectedTemplate.letter}
              </span>
              <span className="text-xs font-medium text-foreground">{selectedTemplate.title}</span>
            </div>
            <span className="text-[10px] text-primary font-medium">Opção principal</span>
          </div>
          <div className="p-5">
            <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-serif">
              {selectedTemplate.templateText}
            </pre>
          </div>
        </div>
      )}

      {/* Complementary templates */}
      {selectedComplementaryTemplates.map((tpl) => (
        <div key={tpl.id} className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/20 px-4 py-2.5 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded bg-muted text-muted-foreground text-xs font-bold">
                {tpl.letter}
              </span>
              <span className="text-xs font-medium text-foreground">{tpl.title}</span>
            </div>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Complementar</span>
          </div>
          <div className="p-5">
            <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-serif">
              {tpl.templateText}
            </pre>
          </div>
        </div>
      ))}

      {/* Draft blocks from decisions */}
      {hasBlocks && (
        <div className="space-y-4">
          <h3 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <PenLine className="h-4 w-4 text-primary" />
            Trechos ativados pelas decisões
          </h3>
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
      )}

      {/* Copy all button */}
      {(hasTemplate || hasBlocks) && (
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 border border-border rounded-md hover:bg-muted/30"
        >
          <Copy className="h-3.5 w-3.5" />
          Copiar toda a redação
        </button>
      )}

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
