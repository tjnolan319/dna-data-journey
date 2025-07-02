
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GenreCategoryProject from "./pages/GenreCategoryProject";
import SkillsetNetwork from "./pages/SkillsetNetwork";
import TimelinePage from "./pages/TimelinePage";
import AcademicTimelinePage from "./pages/AcademicTimelinePage";
import SbcWorkflowPage from "./pages/SbcWorkflowPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/dna-data-journey">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/genre-category-project" element={<GenreCategoryProject />} />
          <Route path="/skillset-network" element={<SkillsetNetwork />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/academic-timeline" element={<AcademicTimelinePage />} />
          <Route path="/sbc-workflow" element={<SbcWorkflowPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
