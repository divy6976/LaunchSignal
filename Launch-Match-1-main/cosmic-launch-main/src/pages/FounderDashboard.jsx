import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  User, 
  Zap, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  Sparkles,
  Edit,
  Star,
  Clock,
  Users,
  ExternalLink,
  BarChart3,
  Activity,
  Rocket
} from "lucide-react";
import { userAPI, startupAPI, handleAPIError } from "../services/api";
import AnalyticsModal from "../components/AnalyticsModal";

const FounderDashboard = () => {
  const navigate = useNavigate();
  const hasLoadedDataRef = useRef(false);
  const [userName, setUserName] = useState("User");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myStartups, setMyStartups] = useState([]);
  const [isLoadingStartups, setIsLoadingStartups] = useState(true);
  const [stats, setStats] = useState({ matches: 0, views: 0, feedbacks: 0, feedbackRate: 0 });
  const [feedbackList, setFeedbackList] = useState([]);
  const [trending, setTrending] = useState([]);
  // Modal state no longer needed with dedicated page

  // Check authentication and get user name
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    setIsLoggedIn(!!loggedInStatus);

    // Allow founders and admin email on this page; only redirect when not logged in
    if (!loggedInStatus) {
      window.location.href = '/login';
      return;
    }

    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Fetch startups once after login (guard against StrictMode double-invoke)
  useEffect(() => {
    if (!isLoggedIn) return;
    if (hasLoadedDataRef.current) return;
    hasLoadedDataRef.current = true;
    fetchMyStartups();
    fetchFounderAnalytics();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await userAPI.logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Remove only auth/session keys so user data like upvoted startups persists
      try {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
      } catch {}
      window.location.href = '/login';
    }
  };

  const fetchMyStartups = async () => {
    try {
      setIsLoadingStartups(true);
      const response = await startupAPI.getStartupsForFounder();
      
      if (response.startups) {
        setMyStartups(response.startups);
        // Derive local analytics without overriding matches from founder analytics
        fetchAnalytics(response.startups);
      }
    } catch (error) {
      console.error("Error fetching startups:", error);
      setMyStartups([]); // Set empty array on error
    } finally {
      setIsLoadingStartups(false);
    }
  };

  const fetchAnalytics = async (startups) => {
    try {
      if (startups.length === 0) {
        setStats({ matches: 0, views: 0, feedbacks: 0, feedbackRate: 0 });
        setFeedbackList([]);
        return;
      }

      // Derive basic metrics locally for now (robust fallback if backend analytics unavailable)
      const views = startups.reduce((acc, s) => acc + (s.views || 0), 0);

      // Fetch feedback for ALL startups owned by founder and aggregate
      let feedbacks = 0;
      const allFeedback = [];
      const feedbackPromises = startups.map(async (s) => {
        try {
          const fb = await startupAPI.getFeedbackForStartup(s._id || s.id);
          if (Array.isArray(fb)) {
            feedbacks += fb.length;
            fb.forEach(item => {
              allFeedback.push({
                content: item.comment || item.content || 'Feedback',
                author: item.userId?.fullName || 'Anonymous',
                time: new Date(item.createdAt || Date.now()).toLocaleString()
              });
            });
          }
        } catch (_) { /* ignore individual failures */ }
      });
      await Promise.all(feedbackPromises);

      // matches placeholder (until we add dedicated matches metric here)
      const matches = Math.max(0, startups.reduce((acc, s) => acc + (s.upvotes || 0), 0));
      // keep fractional value to avoid rounding to 0 for small rates
      const feedbackRate = views > 0 ? ((feedbacks / views) * 100) : 0;

      setStats(prev => ({ ...prev, matches: prev.matches ?? matches, views, feedbacks, feedbackRate }));
      setFeedbackList(allFeedback.slice(0, 10));
    } catch (e) {
      setStats({ matches: 0, views: 0, feedbacks: 0, feedbackRate: 0 });
      setFeedbackList([]);
    }
  };

  const fetchFounderAnalytics = async () => {
    try {
      const response = await startupAPI.getFounderAnalytics();
      if (response?.stats) {
        setStats(prev => ({
          ...prev,
          matches: Number(response.stats.matches || 0),
          views: Number(response.stats.views || prev.views || 0),
          feedbacks: Number(response.stats.feedbacks || prev.feedbacks || 0),
          feedbackRate: Number(response.stats.feedbackRate || prev.feedbackRate || 0),
        }));
      }
      if (Array.isArray(response?.trending)) {
        setTrending(response.trending);
      }
    } catch (e) {
      // ignore; fallback to local derived analytics
    }
  };

  const handleOpenAnalytics = (startup) => {
    const id = startup?._id || startup?.id;
    if (!id) return;
    navigate(`/analytics/${id}`);
  };

  const handleCloseAnalytics = () => {};

  // Format helpers
  const formatPercent = (n) => {
    if (!n) return '0%';
    if (n < 1) return `${n.toFixed(1)}%`;
    return `${Math.round(n)}%`;
  };

  // Quick stats config
  const quickStats = [
    {
      icon: Zap,
      label: "Total Matches",
      value: String(stats.matches),
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      icon: Eye,
      label: "Total Views",
      value: String(stats.views),
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      icon: MessageSquare,
      label: "Feedback Received",
      value: String(stats.feedbacks),
      color: "bg-orange-500",
      textColor: "text-orange-600"
    },
    {
      icon: TrendingUp,
      label: "Feedback Rate",
      value: formatPercent(stats.feedbackRate),
      color: "bg-purple-500",
      textColor: "text-purple-600"
    }
  ];


  const recentFeedback = feedbackList;

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      {/* Your Content/Components */}
      <div className="relative z-10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">LaunchSignal</span>
            </div>

            {/* Middle nav */}
            <nav className="hidden md:flex items-center">
              <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-1.5 py-1 shadow-sm">
                <a href="/founder-dashboard" className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">Dashboard</a>
              </div>
            </nav>

            <div className="flex items-center space-x-3">
              <span className="hidden sm:block text-sm text-gray-600">Hi, {userName}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <Button onClick={handleLogout} disabled={isLoggingOut} variant="outline" size="sm" className="border-gray-300">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Founder Dashboard</h1>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}:</p>
                      <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Overview */}
        {myStartups.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-700">Analytics Overview</h2>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Real-time insights</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.views.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{stats.matches.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Upvotes</div>
                  <div className="text-xs text-green-600 mt-1">+8% from last week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stats.feedbacks.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Feedback</div>
                  <div className="text-xs text-green-600 mt-1">+15% from last week</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Startups */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-700">My Startups</h2>
            {myStartups.length > 0 && (
              <Link to="/submit-startup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>+ Submit New Startup</span>
                </Button>
              </Link>
            )}
          </div>
          
          
          
          {isLoadingStartups ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading your startups...</div>
            </div>
          ) : myStartups.length === 0 ? (
            // Submit New Startup Card when no startups exist
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-12 shadow-lg border-2 border-dashed border-purple-300 hover:border-purple-400 transition-all duration-300 max-w-md w-full text-center">
                <div className="flex flex-col items-center space-y-6">
                  {/* Purple Plus Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500">
                    <span className="text-3xl font-bold text-white">+</span>
                  </div>
                  
                  {/* Heading */}
                  <h3 className="text-xl font-bold text-gray-900">Submit New Startup</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Share your startup with early adopters and get valuable feedback.
                  </p>
                  
                  {/* Submit Button */}
                  <Link to="/submit-startup">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
                      <span className="text-lg font-bold">+</span>
                      <span>Submit Startup</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // Show existing startups
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myStartups.map((startup, index) => (
                <div key={startup._id || startup.id} className="startup-card group relative flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="relative flex-shrink-0">
                        {startup.logo ? (
                          <img
                            src={startup.logo}
                            alt={startup.name}
                            className="h-12 w-12 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-all duration-300 shadow-sm">
                            <span className="text-lg font-bold text-blue-600">{(startup.name || '').substring(0,2).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300 mb-1 line-clamp-1 break-anywhere">
                          {startup.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="relative z-10 mb-4 flex-1">
                    <h4 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 break-anywhere">
                      {startup.tagline}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 break-anywhere">
                      {startup.description}
                    </p>

                    <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="text-xs text-green-800 font-semibold mb-1">Special Offer</div>
                      {(() => { const hasOffer = !!(startup.hasSpecialOffer || startup.specialOfferText || (startup.discount && startup.discount > 0) || startup.specialOfferCode); return (
                        <div className="text-xs text-green-700">
                          {hasOffer ? (startup.specialOfferText || 'Exclusive early adopter deal available.') : "This startup doesn't have a special offer right now."}
                        </div>
                      ); })()}
                      {(() => { const hasOffer = !!(startup.hasSpecialOffer || startup.specialOfferText || (startup.discount && startup.discount > 0) || startup.specialOfferCode); return hasOffer ? (
                        <div className="mt-2 inline-flex items-center gap-2">
                          <span className="bg-green-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                            {startup.discount ? `${startup.discount}% OFF` : 'Claim Offer'}
                          </span>
                          {startup.specialOfferCode && (
                            <span className="text-[11px] font-mono bg-green-100 text-green-800 px-2 py-1 rounded-md border border-green-200">
                              Code: {startup.specialOfferCode}
                            </span>
                          )}
                        </div>
                      ) : null; })()}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${ (startup.status||'pending')==='approved' ? 'bg-green-100 text-green-700' : (startup.status||'pending')==='pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700' }`}>
                        {startup.status || 'pending'}
                      </span>
                      <Badge className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {startup.industry || startup.categories?.[0] || 'Tech'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="pt-4 border-t border-gray-200 mt-auto space-y-4">
                    {/* Analytics Button */}
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer relative"
                      style={{ zIndex: 9999, position: 'relative' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenAnalytics(startup);
                      }}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </button>
                    
                    {/* Edit Button */}
                    {(() => { const id = startup._id || startup.id; const url = id ? `/submit-startup?startupId=${id}` : '#'; return (
                      <Link to={url} className="block mt-3" onClick={(e)=>{ if(!id){ e.preventDefault(); console.warn('No startup id to edit', startup); } }}>
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer relative"
                          style={{ zIndex: 9999, position: 'relative' }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Startup
                        </button>
                      </Link>
                    ); })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Feedback */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Recent Feedback</h2>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">Live</span>
          </div>

          {recentFeedback.length === 0 ? (
            <div className="text-center text-gray-500 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">No feedback yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentFeedback.map((feedback, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -top-10 -right-10 h-24 w-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 border border-orange-200 flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">{feedback.content}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 truncate max-w-[60%]">{feedback.author}</span>
                        <span className="inline-flex items-center text-[11px] text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {feedback.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        
      </main>
      </div>

      {/* Analytics Modal removed for dedicated page */}
    </div>
  );
};

export default FounderDashboard;
