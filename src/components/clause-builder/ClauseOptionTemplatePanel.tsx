import { ClauseOptionTemplate } from "../../types/clauseBuilder";
import { Check, Copy, ChevronDown, ChevronUp, AlertCircle, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  templates: ClauseOptionTemplate[];
  recommendedTemplateId?: string | null;
  selectedTemplateId: string | null;
  selectedComplementaryIds: string[];
  onSelectTemplate: (templateId: string) => void;
  onToggleComplementary: (templateId: string) => void;
}

export function ClauseOptionTemplatePanel({
  templates,
  recommendedTemplateId,
  selectedTemplateId,
  selectedComplementaryIds,
  onSelectTemplate,
  onToggleComplementary,
}: Props) {
  const mainTemplates = templates.filter((t) => !t.isComplementary);
  const complementaryTemplates = templates.filter((t) => t.isComplementary);

  return (
    <div className="space-y-8">
      {/* Main options */}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground mb-1">
          Opções estruturais
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Selecione a opção principal de desenho da cláusula. Cada opção traz um modelo-base completo.
        </p>
        <div className="space-y-4">
          {mainTemplates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              isRecommended={tpl.id === recommendedTemplateId}
              isSelected={tpl.id === selectedTemplateId}
              onSelect={() => onSelectTemplate(tpl.id)}
            />
          ))}
        </div>
      </div>

      {/* Complementary blocks */}
      {complementaryTemplates.length > 0 && (
        <div>
          <h3 className="font-display text-base font-semibold text-foreground mb-1">
            Blocos complementares
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Adicione blocos complementares à opção principal selecionada.
          </p>
          <div className="space-y-3">
            {complementaryTemplates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                isRecommended={false}
                isSelected={selectedComplementaryIds.includes(tpl.id)}
                onSelect={() => onToggleComplementary(tpl.id)}
                isComplementary
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  isRecommended,
  isSelected,
  onSelect,
  isComplementary = false,
}: {
  template: ClauseOptionTemplate;
  isRecommended: boolean;
  isSelected: boolean;
  onSelect: () => void;
  isComplementary?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(template.templateText);
    toast.success("Modelo copiado para a área de transferência.");
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${
        isSelected
          ? "border-primary shadow-sm"
          : "border-border hover:border-primary/30"
      }`}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex items-center justify-center h-8 w-8 rounded-lg text-sm font-bold shrink-0 ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {template.letter}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-foreground">{template.title}</h4>
              {isRecommended && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  <Star className="h-3 w-3" />
                  Recomendada
                </span>
              )}
              {isComplementary && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  Complementar
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{template.summary}</p>
          </div>
        </div>

        {/* Recommended when */}
        <div className="mt-3 ml-11">
          <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-medium mb-1.5">
            Indicada quando
          </p>
          <ul className="space-y-1">
            {template.recommendedWhen.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary/50 shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        {template.risks.length > 0 && (
          <div className="mt-3 ml-11">
            <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-medium mb-1.5">
              Pontos de atenção
            </p>
            <ul className="space-y-1">
              {template.risks.map((item, i) => (
                <li key={i} className="text-xs text-warning/80 flex items-start gap-1.5">
                  <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 ml-11">
          <button
            onClick={onSelect}
            className={`text-xs px-4 py-2 rounded-md font-medium transition-all active:scale-[0.97] ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
          >
            {isSelected ? (
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                {isComplementary ? "Ativado" : "Selecionada"}
              </span>
            ) : (
              isComplementary ? "Ativar bloco" : "Usar este modelo"
            )}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs px-3 py-2 rounded-md border border-border hover:bg-muted/30 text-muted-foreground transition-all flex items-center gap-1.5"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Ocultar modelo" : "Ver modelo completo"}
          </button>
        </div>
      </div>

      {/* Template text */}
      {expanded && (
        <div className="border-t border-border bg-muted/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              Modelo-base
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Copiar
            </button>
          </div>
          <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-serif">
            {template.templateText}
          </pre>
        </div>
      )}
    </div>
  );
}
