import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import HomePage from "./pages/HomePage";
import StudentChatPage from "./pages/StudentChatPage";
import StudyHubPage from "./pages/StudyHubPage";
import HomeworkSolverPage from "./pages/HomeworkSolverPage";
import MathHelpPage from "./pages/MathHelpPage";
import HomeworkHelperPage from "./pages/HomeworkHelperPage";
import ExplainSimplyPage from "./pages/ExplainSimplyPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={<StudentChatPage />} />
              <Route path="/library" element={<StudyHubPage />} />
              <Route path="/solver" element={<HomeworkSolverPage />} />
              {/* SEO Pages */}
              <Route path="/math-help" element={<MathHelpPage />} />
              <Route path="/homework-helper" element={<HomeworkHelperPage />} />
              <Route path="/explain-simply" element={<ExplainSimplyPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ThemeProvider>
);

export default App;
