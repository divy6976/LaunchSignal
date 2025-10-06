import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Heart, 
  Filter,
  Settings,
  User,
  ChevronDown,
  Eye,
  ExternalLink,
  Gift,
  Globe
} from "lucide-react";
import { userAPI, startupAPI, handleAPIError } from "../services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StartupsFeed = () => {
  const [startups, setStartups] = useState([]);
  const [isLoadingStartups, setIsLoadingStartups] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [userName, setUserName] = useState("User");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [selectedB2B, setSelectedB2B] = useState(false);
  const [selectedB2C, setSelectedB2C] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [upvotedStartups, setUpvotedStartups] = useState(new Set());
  const [myUpvotedList, setMyUpvotedList] = useState([]);
  const [showUpvotedOnly, setShowUpvotedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Get user name from localStorage or URL params
  useEffect(() => {
    // Check if user is logged in
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(!!loggedInStatus);
    
    if (!loggedInStatus) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    // Try to get user name from localStorage first
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      // Try to get from URL params (if redirected from signup)
      const urlParams = new URLSearchParams(window.location.search);
      const nameFromUrl = urlParams.get('name');
      if (nameFromUrl) {
        setUserName(nameFromUrl);
        localStorage.setItem('userName', nameFromUrl);
      }
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowCategoryDropdown(false);
        setShowIndustryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load/save upvotes locally so the "Your Upvoted" view persists in dev
  useEffect(() => {
    try {
      const raw = localStorage.getItem('upvotedStartups');
      if (raw) setUpvotedStartups(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('upvotedStartups', JSON.stringify(Array.from(upvotedStartups)));
    } catch {}
  }, [upvotedStartups]);

  // Fetch startups and user's upvotes from API
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setIsLoadingStartups(true);
        const [feed, myUpvotes] = await Promise.all([
          startupAPI.getFeedForAdopter(),
          startupAPI.getMyUpvotes().catch(() => ({ startups: [] }))
        ]);
        setStartups(feed || []);
        if (myUpvotes && Array.isArray(myUpvotes.startups)) {
          setUpvotedStartups(new Set(myUpvotes.startups.map(s => s._id || s.id)));
          setMyUpvotedList(myUpvotes.startups);
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
        setStartups([]);
      } finally {
        setIsLoadingStartups(false);
      }
    };

    if (isLoggedIn) {
      fetchStartups();
    }
  }, [isLoggedIn]);

  // Fetch filter options for dropdowns
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await startupAPI.getFilterOptions();
        setCategories(["All", ...options.categories]);
        setIndustries(["All", ...options.industries]);
      } catch (error) {
        console.error("Error fetching filter options:", error);
        // Keep default values if API fails
      }
    };

    fetchFilterOptions();
  }, []);

  // Removed automatic view tracking - now only tracks on View Details clicks

  const toggleUpvote = (startupId) => {
    setUpvotedStartups(prev => {
      const newSet = new Set(prev);
      const isCurrentlyUpvoted = newSet.has(startupId);
      
      if (isCurrentlyUpvoted) {
        newSet.delete(startupId);
        startupAPI.removeUpvote(startupId).catch(() => {});
        // Decrease upvote count locally
        setStartups(prevStartups => 
          prevStartups.map(startup => 
            startup._id === startupId || startup.id === startupId
              ? { ...startup, upvotes: Math.max(0, (startup.upvotes || 0) - 1) }
              : startup
          )
        );
      } else {
        newSet.add(startupId);
        startupAPI.upvote(startupId).catch(() => {});
        // Increase upvote count locally
        setStartups(prevStartups => 
          prevStartups.map(startup => 
            startup._id === startupId || startup.id === startupId
              ? { ...startup, upvotes: (startup.upvotes || 0) + 1 }
              : startup
          )
        );
      }
      return newSet;
    });
  };

  const getUpvoteCount = (startup) => {
    // Use the actual upvote count from the database
    return startup.upvotes || 0;
  };

  const trackView = async (startupId) => {
    // Check if we've already tracked this startup in this session
    if (viewedStartups.current.has(startupId)) {
      return;
    }
    
    // Mark as viewed
    viewedStartups.current.add(startupId);
    
    try {
      const response = await startupAPI.incrementView(startupId);
      // Update the local view count
      setStartups(prevStartups => 
        prevStartups.map(startup => 
          startup._id === startupId || startup.id === startupId
            ? { ...startup, views: response.views }
            : startup
        )
      );
    } catch (error) {
      console.error("Error tracking view:", error);
      // Remove from viewed set if API call failed so it can be retried
      viewedStartups.current.delete(startupId);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call the logout API
      await userAPI.logout();
      
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      // Preserve user data like upvotes; remove only auth/session keys
      try {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
      } catch {}
      window.location.href = '/login';
    }
  };

  const mockStartups = [
    {
      id: 1,
      name: "EzyDocs",
      description: "Streamline your document management with our AI-powered platform that makes organizing and finding files effortless.",
      category: "Productivity",
      type: "B2B",
      tags: ["SaaS", "FinTech", "Productivity"],
      views: 2,
      upvotes: 0,
      hasSpecialOffer: true,
      specialOfferText: "Special Offer for Early Adopters. This startup has a special discount available for early adopters!",
      specialOfferCode: null,
      discount: 25,
      founder: "Emma Rodriguez",
      industry: "Technology"
    },
    {
      id: 2,
      name: "QuillSocial",
      description: "Revolutionary social media management platform that helps businesses create engaging content and grow their online presence.",
      category: "Social Media",
      type: "B2B",
      tags: ["SaaS", "Social Media", "AI/ML"],
      views: 8,
      upvotes: 1,
      hasSpecialOffer: true,
      specialOfferText: "Special Offer for Early Adopters. This startup has a special discount available for early adopters!",
      specialOfferCode: null,
      discount: 30,
      founder: "Sarah Johnson",
      industry: "Technology"
    },
    {
      id: 3,
      name: "Shaflex",
      description: "Advanced automation platform that helps businesses streamline their workflows and increase productivity through intelligent process management.",
      category: "Automation",
      type: "B2C",
      tags: ["SaaS", "Social Media", "Automation"],
      views: 14,
      upvotes: 4,
      hasSpecialOffer: false,
      specialOfferText: "This startup doesn't have a special offer right now.",
      specialOfferCode: null,
      discount: 0,
      founder: "David Kim",
      industry: "Technology"
    }
  ];

  const [categories, setCategories] = useState(["All"]);
  const [industries, setIndustries] = useState(["All"]);
  const viewedStartups = useRef(new Set());

  const sourceList = showUpvotedOnly ? myUpvotedList : startups;
  const filteredStartups = sourceList.filter(startup => {
    const name = String(startup.name || '').toLowerCase();
    const desc = String(startup.description || '').toLowerCase();
    const tagl = String(startup.tagline || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase()) || tagl.includes(searchTerm.toLowerCase());
    const categoriesArr = Array.isArray(startup.categories) ? startup.categories : [];
    const matchesCategory = selectedCategory === "All" || categoriesArr.includes(selectedCategory);
    const matchesIndustry = selectedIndustry === "All" || startup.industry === selectedIndustry;
    
    // B2B/B2C filtering
    let matchesType = true;
    if (selectedB2B && selectedB2C) {
      matchesType = true; // Show all if both are selected
    } else if (selectedB2B) {
      matchesType = startup.businessType === 'B2B';
    } else if (selectedB2C) {
      matchesType = startup.businessType === 'B2C';
    } else {
      matchesType = true; // Show all if none are selected
    }
    
    const passesBase = matchesSearch && matchesCategory && matchesIndustry && matchesType;
    if (!passesBase) return false;
    if (showUpvotedOnly) return upvotedStartups.has(startup._id || startup.id);
    return true;
  });

  // Reset pagination when filters/search/source list change
  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm, selectedCategory, selectedIndustry, selectedB2B, selectedB2C, startups]);

  const displayedStartups = filteredStartups.slice(0, visibleCount);

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

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 opacity-60 floating-element" />
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 opacity-50 floating-element-delayed" />
        <div className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 opacity-40 floating-element-slow" />
      </div>

      <div className="relative z-10">
      {/* Header rendered globally by AppShell */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Upvoted Toggle */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {showUpvotedOnly ? 'Your Upvoted Startups' : `Here are the latest startups for you, ${userName}!`}
            </h1>
            {showUpvotedOnly && (
              <p className="text-sm text-gray-600">Showing startups you upvoted. Use the toggle to go back.</p>
            )}
          </div>
          <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowUpvotedOnly(false)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${!showUpvotedOnly ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Explore All
            </button>
            <button
              type="button"
              onClick={() => setShowUpvotedOnly(true)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${showUpvotedOnly ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              title="Show your upvoted startups"
            >
              Your Upvoted <span className="ml-1 inline-flex items-center justify-center text-[11px] font-bold bg-blue-100 text-blue-700 rounded-full px-2 py-[1px]">{upvotedStartups.size}</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-sm border border-gray-200 focus:border-gray-300 focus:ring-0 rounded-xl bg-white shadow-sm text-gray-600 placeholder-gray-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative dropdown-container">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowIndustryDropdown(false);
              }}
              className="h-12 px-4 border border-gray-200 hover:border-gray-300 rounded-xl bg-white shadow-sm text-sm font-normal text-gray-600 min-w-[120px] flex items-center justify-between"
            >
              <span>{selectedCategory === "All" ? "Category" : selectedCategory}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </Button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      selectedCategory === category ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Industry Filter */}
          <div className="relative dropdown-container">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowIndustryDropdown(!showIndustryDropdown);
                setShowCategoryDropdown(false);
              }}
              className="h-12 px-4 border border-gray-200 hover:border-gray-300 rounded-xl bg-white shadow-sm text-sm font-normal text-gray-600 min-w-[120px] flex items-center justify-between"
            >
              <span>{selectedIndustry === "All" ? "Industry" : selectedIndustry}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
            </Button>
            {showIndustryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => {
                      setSelectedIndustry(industry);
                      setShowIndustryDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      selectedIndustry === industry ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* B2B Checkbox */}
          <div className="flex items-center space-x-2 px-2">
            <input
              id="b2b-checkbox"
              type="checkbox"
              checked={selectedB2B}
              onChange={(e) => setSelectedB2B(e.target.checked)}
              className="h-4 w-4 text-gray-600 focus:ring-gray-400 border-gray-200 rounded shadow-sm"
            />
            <label htmlFor="b2b-checkbox" className="text-sm font-medium text-gray-600 whitespace-nowrap">
              B2B
            </label>
          </div>

          {/* B2C Checkbox */}
          <div className="flex items-center space-x-2 px-2">
            <input
              id="b2c-checkbox"
              type="checkbox"
              checked={selectedB2C}
              onChange={(e) => setSelectedB2C(e.target.checked)}
              className="h-4 w-4 text-gray-600 focus:ring-gray-400 border-gray-200 rounded shadow-sm"
            />
            <label htmlFor="b2c-checkbox" className="text-sm font-medium text-gray-600 whitespace-nowrap">
              B2C
            </label>
          </div>
        </div>

        {/* Startups Grid */}
        {isLoadingStartups ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading startups...</div>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No startups found matching your criteria.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
            {displayedStartups.map((startup, index) => (
            <div 
              key={startup._id || startup.id} 
              className="startup-card group relative flex flex-col h-full"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="relative flex-shrink-0">
                    {startup.logo ? (
                      <img
                        src={startup.logo}
                        alt={startup.name}
                        className="h-12 w-12 rounded-full object-cover shadow-sm group-hover:scale-110 transition-all duration-300 group-hover:shadow-md"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        <span className="text-lg font-bold text-blue-600 group-hover:text-blue-700">
                          {startup.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300 mb-1 line-clamp-1 break-anywhere">
                      {startup.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{startup.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <button
                    onClick={() => toggleUpvote(startup._id || startup.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 ${
                      upvotedStartups.has(startup._id || startup.id)
                        ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:shadow-md'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500 hover:shadow-md'
                    }`}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        upvotedStartups.has(startup._id || startup.id) 
                          ? 'fill-current' 
                          : ''
                      }`} 
                    />
                    <span className="text-sm font-semibold">
                      {getUpvoteCount(startup)}
                    </span>
                  </button>
                  <Badge 
                    variant={startup.businessType === 'B2B' ? 'default' : 'secondary'} 
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      startup.businessType === 'B2B' 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-green-100 text-green-700 border-green-200'
                    }`}
                  >
                    {startup.businessType}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="relative z-10 mb-4 flex-1">
                <h4 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 break-anywhere">
                  {startup.tagline}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 break-anywhere">
                  {startup.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {startup.categories.map((tag, tagIndex) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs font-medium px-2 py-1 rounded-full border-blue-200 bg-blue-50 text-blue-600 hover:border-blue-300 hover:bg-blue-100 transition-all duration-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Special Offer */}
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 relative z-10 group-hover:bg-green-100 group-hover:border-green-300 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-sm flex-shrink-0 mt-0.5 group-hover:bg-green-600 group-hover:scale-110 transition-all duration-300">
                    <Gift className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-bold text-green-800 text-sm">Special Offer</span>
                    </div>
                    {(() => { const hasOffer = !!(startup.hasSpecialOffer || startup.specialOfferText || (startup.discount && startup.discount > 0) || startup.specialOfferCode); return (
                      <p className="text-xs text-green-700 leading-relaxed font-medium mb-2">
                      {hasOffer
                        ? (startup.specialOfferText || 'Exclusive early adopter deal available.')
                        : "This startup doesn't have a special offer right now."}
                      </p>
                    ); })()}
                    {(() => { const hasOffer = !!(startup.hasSpecialOffer || startup.specialOfferText || (startup.discount && startup.discount > 0) || startup.specialOfferCode); return hasOffer ? (
                      <div className="inline-flex items-center gap-2">
                        <div className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm hover:bg-green-700 hover:scale-105 transition-all duration-200 cursor-pointer">
                          {isLoggedIn 
                            ? (startup.discount ? `Get ${startup.discount}% OFF` : 'Claim Offer')
                            : 'Log in to see the discount'}
                        </div>
                        {startup.specialOfferCode && (
                          <span className="text-[11px] font-mono bg-green-100 text-green-800 px-2 py-1 rounded-md border border-green-200">
                            Code: {startup.specialOfferCode}
                          </span>
                        )}
                      </div>
                    ) : null; })()}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 relative z-10 mt-auto">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{startup.founderId?.fullName || 'Founder'}</span>
                  <span className="mx-1">•</span>
                  <span>{startup.industry}</span>
                </div>
                <a 
                  href={`/startups/${startup._id || startup.id}`}
                  onClick={() => trackView(startup._id || startup.id)}
                  className="text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg inline-flex items-center justify-center w-40 md:w-44 h-11"
                >
                  View Details
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Load More */}
        {displayedStartups.length < filteredStartups.length && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-base font-semibold border-2 border-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
              onClick={() => setVisibleCount(prev => prev + 6)}
              disabled={isLoadingStartups}
            >
              Load More Startups
            </Button>
          </div>
        )}
      </main>
      {/* Footer rendered globally by AppShell */}
      </div>
    </div>
  );
};

export default StartupsFeed;
