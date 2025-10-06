import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AppShell from "@/components/AppShell";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StartupsFeed from "./pages/StartupsFeed";
import StartupDetails from "./pages/StartupDetails";
import FounderDashboard from "./pages/FounderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SubmitStartup from "./pages/SubmitStartup";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import StartupAnalyticsPage from "./pages/StartupAnalyticsPage";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {[
          { p: "/", e: <Index /> },
          { p: "/login", e: <Login /> },
          { p: "/signup", e: <Signup /> },
          { p: "/startups-feed", e: <StartupsFeed /> },
          { p: "/founder-dashboard", e: <FounderDashboard /> },
          { p: "/admin-dashboard", e: <AdminDashboard /> },
          { p: "/startups/:id", e: <StartupDetails /> },
          { p: "/analytics/:startupId", e: <StartupAnalyticsPage /> },
          { p: "/submit-startup", e: <SubmitStartup /> },
          { p: "/contact", e: <Contact /> },
          { p: "*", e: <NotFound /> },
        ].map(({ p, e }) => (
          <Route
            key={p}
            path={p}
            element={
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {e}
              </motion.div>
            }
          />
        ))}
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
        <AppShell>
          <AnimatedRoutes />
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
