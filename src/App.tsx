import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NewCase from "./pages/NewCase";
import CaseOverview from "./pages/CaseOverview";
import CaseQuestions from "./pages/CaseQuestions";
import CasePremises from "./pages/CasePremises";
import CaseClauses from "./pages/CaseClauses";
import ClauseDetail from "./pages/ClauseDetail";
import CaseDocuments from "./pages/CaseDocuments";
import CaseRisks from "./pages/CaseRisks";
import CaseOutput from "./pages/CaseOutput";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/new-case" element={<NewCase />} />
          <Route path="/case/:id/overview" element={<CaseOverview />} />
          <Route path="/case/:id/questions" element={<CaseQuestions />} />
          <Route path="/case/:id/premises" element={<CasePremises />} />
          <Route path="/case/:id/clauses" element={<CaseClauses />} />
          <Route path="/case/:id/clauses/:clauseId" element={<ClauseDetail />} />
          <Route path="/case/:id/documents" element={<CaseDocuments />} />
          <Route path="/case/:id/risks" element={<CaseRisks />} />
          <Route path="/case/:id/output" element={<CaseOutput />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
