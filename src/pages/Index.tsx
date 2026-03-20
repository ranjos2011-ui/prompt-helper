import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, Lock } from "lucide-react";
import { modules } from "../data/modules";
import { mockCase } from "../data/mockCase";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";

const Index = () => {
  const navigate = useNavigate();
  const { setCaseProfile } = usePatrimonialBuilderStore();

  const handleLoadDemo = () => {
    setCaseProfile(mockCase);
    navigate(`/case/${mockCase.id}/overview`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-muted/30" />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Arquiteto Patrimonial
            </h1>
          </div>
          <p className="font-display text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mb-4">
            Plataforma de arquitetura jurídica e documental para holdings patrimoniais, sucessão, governança e planejamento tributário patrimonial.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed mb-10">
            O sistema não apenas sugere cláusulas. Ele revela o que precisa ser decidido, organiza os documentos adequados e sinaliza riscos patrimoniais, sucessórios, societários e tributários da estrutura.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/new-case")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Iniciar novo caso
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-accent transition-colors"
            >
              Carregar caso demonstrativo
            </button>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Módulos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`relative border border-border rounded-lg p-5 transition-all ${
                mod.status === "active"
                  ? "bg-card hover:border-primary/30 hover:shadow-sm cursor-pointer"
                  : "bg-muted/30 opacity-60"
              }`}
              onClick={() => {
                if (mod.status === "active") navigate("/new-case");
              }}
            >
              {mod.status === "coming_soon" && (
                <div className="absolute top-3 right-3">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
              <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">
                {mod.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mod.description}
              </p>
              {mod.status === "active" ? (
                <span className="inline-block mt-3 text-xs font-medium text-success bg-success/10 px-2.5 py-0.5 rounded-full">
                  Ativo
                </span>
              ) : (
                <span className="inline-block mt-3 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  Em breve
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
