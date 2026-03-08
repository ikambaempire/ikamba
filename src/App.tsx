import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Solutions from "./pages/Solutions";
import CaseStudies from "./pages/CaseStudies";
import Insights from "./pages/Insights";
import About from "./pages/About";
import Contact from "./pages/Contact";
import StartAProject from "./pages/StartAProject";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRedirect from "./pages/AuthRedirect";
import ClientDashboard from "./pages/workspace/ClientDashboard";
import NewBrief from "./pages/workspace/NewBrief";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/start-a-project" element={<StartAProject />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth-redirect" element={<AuthRedirect />} />

            {/* Client Workspace */}
            <Route path="/workspace" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/workspace/new-brief" element={<ProtectedRoute><NewBrief /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute requireInternal><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
