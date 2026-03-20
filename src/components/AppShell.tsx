import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  HelpCircle,
  FileText,
  FolderOpen,
  AlertTriangle,
  FileOutput,
  ChevronRight,
  Shield,
} from "lucide-react";
import { usePatrimonialBuilderStore } from "../store/usePatrimonialBuilderStore";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { path: "questions", label: "Entrevista", icon: HelpCircle },
  { path: "premises", label: "Premissas", icon: FileText },
  { path: "clauses", label: "Cláusulas", icon: FileText },
  { path: "documents", label: "Documentos", icon: FolderOpen },
  { path: "risks", label: "Riscos", icon: AlertTriangle },
  { path: "output", label: "Saída", icon: FileOutput },
];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { caseProfile, activeClauseIds, risks, alerts, completedQuestionIds } = usePatrimonialBuilderStore();
  const caseId = caseProfile?.id || "case-001";
  const untreatedRisks = risks.filter(r => r.status === "nao_tratado").length;
  const totalQuestions = 18;
  const progress = Math.round((completedQuestionIds.length / totalQuestions) * 100);

  const moduleLabels: Record<string, string> = {
    succession_holding_module: "Sucessão Empresarial",
    governance_module: "Governança Societária",
    donation_module: "Doação de Quotas",
    family_protocol_module: "Protocolo Familiar",
    tax_memo_module: "Memorando Tributário",
    international_integration_module: "Integração Internacional",
  };

  const entryModeLabels: Record<string, string> = {
    problem: "Problema",
    clause: "Cláusula",
    package: "Pacote",
  };

  // Get current page title for breadcrumb
  const currentNav = navItems.find(item => location.pathname.includes(item.path));

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="block">
            <div className="flex items-center gap-2.5">
              <Shield className="h-6 w-6 text-sidebar-primary" />
              <span className="font-display text-lg font-semibold text-sidebar-primary">
                Arquiteto Patrimonial
              </span>
            </div>
          </Link>
        </div>

        {/* Case Info */}
        {caseProfile && (
          <div className="p-5 border-b border-sidebar-border space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50 font-medium">Caso</p>
              <p className="text-sm font-medium text-sidebar-accent-foreground mt-0.5 truncate">{caseProfile.caseName}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40">Módulo</p>
                <p className="text-xs text-sidebar-foreground/80 mt-0.5">{moduleLabels[caseProfile.selectedModule] || caseProfile.selectedModule}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40">Entrada</p>
                <p className="text-xs text-sidebar-foreground/80 mt-0.5">{entryModeLabels[caseProfile.selectedEntryMode] || caseProfile.selectedEntryMode}</p>
              </div>
            </div>
            {/* Progress */}
            <div>
              <div className="flex justify-between text-[10px] text-sidebar-foreground/50 mb-1.5">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-sidebar-accent rounded-full overflow-hidden">
                <div
                  className="h-full bg-sidebar-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="bg-sidebar-accent/50 rounded px-2 py-1.5 text-center">
                <p className="text-sm font-semibold text-sidebar-primary">{activeClauseIds.length}</p>
                <p className="text-[9px] text-sidebar-foreground/50 uppercase">Cláusulas</p>
              </div>
              <div className="bg-sidebar-accent/50 rounded px-2 py-1.5 text-center">
                <p className="text-sm font-semibold text-destructive">{untreatedRisks}</p>
                <p className="text-[9px] text-sidebar-foreground/50 uppercase">Riscos</p>
              </div>
              <div className="bg-sidebar-accent/50 rounded px-2 py-1.5 text-center">
                <p className="text-sm font-semibold text-warning">{alerts.length}</p>
                <p className="text-[9px] text-sidebar-foreground/50 uppercase">Alertas</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={`/case/${caseId}/${item.path}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-sidebar-primary" : "")} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="h-3 w-3 ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-[10px] text-sidebar-foreground/30 text-center">
            Arquiteto Patrimonial v1.0
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card flex items-center px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {caseProfile ? moduleLabels[caseProfile.selectedModule] : "Arquiteto Patrimonial"}
            </span>
            {currentNav && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                <span className="font-medium text-foreground">{currentNav.label}</span>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            {caseProfile && (
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded">
                {activeClauseIds.length} cláusulas · {untreatedRisks} riscos pendentes
              </span>
            )}
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border rounded-md">
              Exportar
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
