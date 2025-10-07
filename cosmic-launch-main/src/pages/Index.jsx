import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValuePropositions from "@/components/ValuePropositions";
import StartupDiscovery from "@/components/StartupDiscovery";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Heart, Sparkles } from "lucide-react";
import FAQ from "@/components/FAQ";
import { useEffect, useState } from "react";
import { startupAPI } from "@/services/api";

const Index = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await startupAPI.getTrending('week');
        if (Array.isArray(res)) setTrending(res);
      } catch (_) {
        // ignore; section components render without this
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      {/* Premium animated background matching Hero.jsx */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {/* Primary gradient */}
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{ clipPath: 'polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)' }}
          />
        </div>
        
        {/* Secondary gradient */}
        <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-15deg] bg-gradient-to-tr from-blue-300 via-blue-400 to-blue-500 opacity-15 sm:left-[calc(50%+20rem)] sm:w-[60rem]"
            style={{ clipPath: 'polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)' }}
          />
        </div>

        {/* Floating elements (polished orbit dots) */}
        <div className="absolute top-20 left-10 orbit-dot orbit-dot--primary floating-element" />
        <div className="absolute top-40 right-20 orbit-dot orbit-dot--ghost floating-element-delayed" />
        <div className="absolute bottom-40 left-20 orbit-dot orbit-dot--ghost floating-element-slow opacity-80" />
      </div>

      <div className="relative z-10">
        {/* Header rendered globally by AppShell */}
        <main>
          <Hero />
          <ValuePropositions />
          <StartupDiscovery />
          <FAQ />

          {/* Always-present anchor for smooth scrolling regardless of data load timing */}
          <div id="trending-section" className="h-0" />

        </main>
        {/* Footer rendered globally by AppShell */}
      </div>
    </div>
  );
};

export default Index;
