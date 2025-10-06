import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const AppShell = ({ children }) => {
  const location = useLocation();
  const isAnalytics = location.pathname.startsWith("/analytics");
  const hideHeader = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/founder-dashboard" || isAnalytics;
  const hideFooter = location.pathname === "/login" || location.pathname === "/signup" || isAnalytics;

  // Cross-route smooth scroll to a section id when location state provides it
  useEffect(() => {
    const targetId = location?.state && location.state.scrollTo;
    if (targetId) {
      const scroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      // Allow the page to render first
      requestAnimationFrame(() => setTimeout(scroll, 0));
    }
  }, [location]);
  return (
    <div className="min-h-screen w-full relative">
      {/* Premium background with subtle patterns */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {!hideHeader && <Header />}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default AppShell;


