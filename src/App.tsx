import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import Services from "./pages/Solutions";
import Training from "./pages/Training";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRedirect from "./pages/AuthRedirect";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ClientDashboard from "./pages/workspace/ClientDashboard";
import UserDashboard from "./pages/workspace/UserDashboard";
import NewBrief from "./pages/workspace/NewBrief";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/training" element={<PageTransition><Training /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />

        {/* Legacy redirects */}
        <Route path="/solutions" element={<Navigate to="/services" replace />} />
        <Route path="/work" element={<Navigate to="/services" replace />} />
        <Route path="/insights" element={<Navigate to="/blog" replace />} />
        <Route path="/insights/:slug" element={<Navigate to="/blog" replace />} />
        <Route path="/how-it-works" element={<Navigate to="/services" replace />} />
        <Route path="/start-a-project" element={<Navigate to="/contact" replace />} />
        <Route path="/caption-generator" element={<Navigate to="/" replace />} />
        <Route path="/design-studio" element={<Navigate to="/" replace />} />
        <Route path="/platform" element={<Navigate to="/services" replace />} />
        <Route path="/case-studies" element={<Navigate to="/blog" replace />} />

        {/* Auth */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />

        {/* Client Workspace */}
        <Route path="/workspace" element={<PageTransition><ProtectedRoute><ClientDashboard /></ProtectedRoute></PageTransition>} />
        <Route path="/workspace/new-brief" element={<PageTransition><ProtectedRoute><NewBrief /></ProtectedRoute></PageTransition>} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<PageTransition><ProtectedRoute><UserDashboard /></ProtectedRoute></PageTransition>} />

        {/* Shared */}
        <Route path="/project/:id" element={<PageTransition><ProtectedRoute><ProjectDetail /></ProtectedRoute></PageTransition>} />

        {/* Admin */}
        <Route path="/admin" element={<PageTransition><ProtectedRoute requireInternal><AdminDashboard /></ProtectedRoute></PageTransition>} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
