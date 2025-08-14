import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GenreCategoryProject from "./pages/GenreCategoryProject";
import SkillsetNetwork from "./pages/SkillsetNetwork";
import PortfolioSkillsDashboard from "./pages/PortfolioSkillsDashboard";
import TimelinePage from "./pages/TimelinePage";
import AcademicTimelinePage from "./pages/AcademicTimelinePage";
import SbcWorkflowPage from "./pages/SbcWorkflowPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLabNotes from "./pages/AdminLabNotes";
import AdminLabNoteEditor from "./pages/AdminLabNoteEditor";
import AdminTodoLists from "./pages/AdminTodoLists";
import AdminWorkJournal from "./pages/AdminWorkJournal";
import AdminResumeManager from "./pages/AdminResumeManager";
import AdminSectionManager from "./pages/AdminSectionManager";
import AdminPortfolioContent from "./pages/AdminPortfolioContent";
import PublicLabNotes from "./pages/PublicLabNotes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('App rendering, current location:', window.location.pathname);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/dna-data-journey">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/genre-category-project" element={<GenreCategoryProject />} />
            <Route path="/skillset-network" element={<SkillsetNetwork />} />
            <Route path="/portfolio-skills" element={<PortfolioSkillsDashboard />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/academic-timeline" element={<AcademicTimelinePage />} />
            <Route path="/sbc-workflow" element={<SbcWorkflowPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/lab-notes" element={<AdminLabNotes />} />
            <Route path="/admin/lab-notes/new" element={<AdminLabNoteEditor />} />
            <Route path="/admin/lab-notes/:id" element={<AdminLabNoteEditor />} />
            <Route path="/admin/todo-lists" element={<AdminTodoLists />} />
            <Route path="/admin/work-journal" element={<AdminWorkJournal />} />
            <Route path="/admin/resume" element={<AdminResumeManager />} />
          <Route path="/admin/section-manager" element={<AdminSectionManager />} />
          <Route path="/admin/portfolio-content" element={<AdminPortfolioContent />} />
            <Route path="/lab-notes" element={<PublicLabNotes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
