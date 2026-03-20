import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { modules } from "../data/modules";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { EntryMode, ModuleId } from "../types/enums";
import { CaseProfile } from "../types/case";
import { ArrowRight, Shield } from "lucide-react";

const entryModes: { value: EntryMode; label: string; description: string }[] = [
  { value: "problem", label: "Por problema", description: "Organizar sucessão, proteger patrimônio, manter controle, tratar incapacidade..." },
  { value: "clause", label: "Por cláusula", description: "Incomunicabilidade, usufruto, valuation, arbitragem, conselho familiar..." },
  { value: "package", label: "Por pacote", description: "Pacote sucessório, governança, proteção patrimonial, tributário..." },
];

export default function NewCase() {
  const navigate = useNavigate();
  const { setCaseProfile } = usePatrimonialBuilderStore();
  const [selectedModule, setSelectedModule] = useState<ModuleId>("succession_holding_module");
  const [selectedEntry, setSelectedEntry] = useState<EntryMode>("problem");
  const [caseName, setCaseName] = useState("");

  const handleCreate = () => {
    const profile: CaseProfile = {
      id: `case-${Date.now()}`,
      caseName: caseName || "Novo Caso",
      selectedModule,
      selectedEntryMode: selectedEntry,
      structureType: "holding_pura_patrimonial",
      primaryGoal: "continuidade_comando",
      founderKeepsControl: "sim",
      founderKeepsIncome: "sim",
      donationAlreadyMade: "nao",
      hasManagingHeirs: "sim",
      hasNonManagingHeirs: "sim",
      hasChildrenFromDifferentRelationships: "nao",
      concernWithSpouses: "sim",
      conflictRisk: "medio",
      hasInternationalElements: "nao",
      hasComplementaryDocuments: "sim",
      hasRelevantTaxConcerns: "sim",
    };
    setCaseProfile(profile);
    navigate(`/case/${profile.id}/questions`);
  };

  const activeModules = modules.filter(m => m.status === "active");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2.5 mb-8">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Novo Caso</h1>
        </div>

        {/* Module Selection */}
        <div className="mb-8">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3 block">
            Módulo
          </label>
          <div className="space-y-2">
            {activeModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.id)}
                className={`w-full text-left border rounded-lg p-4 transition-all ${
                  selectedModule === mod.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <p className="font-display text-base font-semibold text-foreground">{mod.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Entry Mode */}
        <div className="mb-8">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3 block">
            Modo de entrada
          </label>
          <div className="grid grid-cols-3 gap-3">
            {entryModes.map((em) => (
              <button
                key={em.value}
                onClick={() => setSelectedEntry(em.value)}
                className={`text-left border rounded-lg p-4 transition-all ${
                  selectedEntry === em.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <p className="text-sm font-semibold text-foreground mb-1">{em.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{em.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Case Name */}
        <div className="mb-10">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
            Nome do caso
          </label>
          <input
            type="text"
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
            placeholder="Ex: Família Silva Holding"
            className="w-full border border-border rounded-md px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Iniciar caso
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
