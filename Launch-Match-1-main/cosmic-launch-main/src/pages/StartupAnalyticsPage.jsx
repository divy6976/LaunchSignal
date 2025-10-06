import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
import StartupAnalytics from "@/components/StartupAnalytics";
import { useEffect, useState } from "react";
import { startupAPI } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StartupAnalyticsPage = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Startup");

  useEffect(() => {
    const load = async () => {
      try {
        const s = await startupAPI.getStartupById(startupId);
        if (s?.name) setTitle(s.name);
      } catch (_) {}
    };
    if (startupId) load();
  }, [startupId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Startup Analytics</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Link to="/founder-dashboard">
            <Button variant="default">Founder Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-4">
        <StartupAnalytics startupId={startupId} startupName={title} />
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default StartupAnalyticsPage;


