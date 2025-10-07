import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Eye, 
  ExternalLink, 
  Zap, 
  Smartphone, 
  Globe, 
  Brain,
  Shield,
  Palette,
  ChevronRight,
  Heart,
  Gift,
  Rocket,
  ShoppingCart,
  Star,
  TrendingUp,
  Sparkles
} from "lucide-react";

import { startupAPI } from "@/services/api";

const StartupDiscovery = () => {
  const [upvotedStartups, setUpvotedStartups] = useState(new Set());
  const viewedStartups = useRef(new Set());
  const [trending, setTrending] = useState([
    {
      id: 'demo-3',
      name: 'Shaflex',
      description: 'Advanced automation platform that helps businesses streamline their workflows and increase productivity through intelligent process management.',
      categories: ['SaaS', 'Automation'],
      industry: 'Technology',
      businessType: 'B2C',
      views: 14,
      upvotes: 4,
      hasSpecialOffer: false,
      specialOfferText: "This startup doesn't have a special offer right now.",
    },
    {
      id: 'demo-2',
      name: 'QuillSocial',
      description: 'Revolutionary social media management platform that helps businesses create engaging content and grow their online presence.',
      categories: ['SaaS', 'Social Media', 'AI/ML'],
      industry: 'Technology',
      businessType: 'B2B',
      views: 8,
      upvotes: 1,
      hasSpecialOffer: true,
      specialOfferText: 'Special Offer for Early Adopters. This startup has a special discount available for early adopters!',
    },
    {
      id: 'demo-1',
      name: 'EzyDocs',
      description: 'Streamline your document management with our AI-powered platform that makes organizing and finding files effortless.',
      categories: ['SaaS', 'FinTech', 'Productivity'],
      industry: 'Technology',
      businessType: 'B2B',
      views: 2,
      upvotes: 0,
      hasSpecialOffer: true,
      specialOfferText: 'Special Offer for Early Adopters. This startup has a special discount available for early adopters!',
    },
  ]);

  const toggleUpvote = (startupId) => {
    setUpvotedStartups(prev => {
      const newSet = new Set(prev);
      const isCurrentlyUpvoted = newSet.has(startupId);
      
      if (isCurrentlyUpvoted) {
        newSet.delete(startupId);
        startupAPI.removeUpvote(startupId).catch(() => {});
        // Decrease upvote count locally
        setTrending(prevTrending => 
          prevTrending.map(startup => 
            startup._id === startupId || startup.id === startupId
              ? { ...startup, upvotes: Math.max(0, (startup.upvotes || 0) - 1) }
              : startup
          )
        );
      } else {
        newSet.add(startupId);
        startupAPI.upvote(startupId).catch(() => {});
        // Increase upvote count locally
        setTrending(prevTrending => 
          prevTrending.map(startup => 
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
    return startup?.upvotes || 0;
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
      setTrending(prevTrending => 
        prevTrending.map(startup => 
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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await startupAPI.getTrending('week');
        let items = Array.isArray(res?.startups) ? res.startups : [];
        if (!items.length) {
          const resAll = await startupAPI.getTrending('all');
          items = Array.isArray(resAll?.startups) ? resAll.startups : [];
        }
        
        // If still no items from trending, try the regular feed
        if (!items.length) {
          const feedRes = await startupAPI.getFeedForAdopter();
          items = Array.isArray(feedRes) ? feedRes : [];
        }
        
        items.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        
        if (items.length === 0) {
          const fallback = [
            {
              id: 'demo-3',
              name: 'Shaflex',
              description: 'Advanced automation platform that helps businesses streamline their workflows and increase productivity through intelligent process management.',
              categories: ['SaaS', 'Automation'],
              industry: 'Technology',
              businessType: 'B2C',
              views: 14,
              upvotes: 4,
              hasSpecialOffer: false,
              specialOfferText: "This startup doesn't have a special offer right now.",
            },
            {
              id: 'demo-2',
              name: 'QuillSocial',
              description: 'Revolutionary social media management platform that helps businesses create engaging content and grow their online presence.',
              categories: ['SaaS', 'Social Media', 'AI/ML'],
              industry: 'Technology',
              businessType: 'B2B',
              views: 8,
              upvotes: 1,
              hasSpecialOffer: true,
              specialOfferText: 'Special Offer for Early Adopters. This startup has a special discount available for early adopters!',
            },
            {
              id: 'demo-1',
              name: 'EzyDocs',
              description: 'Streamline your document management with our AI-powered platform that makes organizing and finding files effortless.',
              categories: ['SaaS', 'FinTech', 'Productivity'],
              industry: 'Technology',
              businessType: 'B2B',
              views: 2,
              upvotes: 0,
              hasSpecialOffer: true,
              specialOfferText: 'Special Offer for Early Adopters. This startup has a special discount available for early adopters!',
            },
          ];
          setTrending(fallback.slice(0, 3));
        } else {
          setTrending(items.slice(0, 3));
        }
      } catch (error) {
        console.error('Error loading trending startups:', error);
        const fallback = [
          {
            id: 'demo-3',
            name: 'Shaflex',
            description: 'Advanced automation platform that helps businesses streamline their workflows and increase productivity through intelligent process management.',
            categories: ['SaaS', 'Automation'],
            industry: 'Technology',
            businessType: 'B2C',
            views: 14,
            upvotes: 4,
            hasSpecialOffer: false,
            specialOfferText: "This startup doesn't have a special offer right now.",
          },
          {
            id: 'demo-2',
            name: 'QuillSocial',
            description: 'Revolutionary social media management platform that helps businesses create engaging content and grow their online presence.',
            categories: ['SaaS', 'Social Media', 'AI/ML'],
            industry: 'Technology',
            businessType: 'B2B',
            views: 8,
            upvotes: 1,
            hasSpecialOffer: true,
            specialOfferText: 'Special Offer for Early Adopters. This startup has a special discount available for early adopters!',
          },
          {
            id: 'demo-1',
            name: 'EzyDocs',
            description: 'Streamline your document management with our AI-powered platform that makes organizing and finding files effortless.',
            categories: ['SaaS', 'FinTech', 'Productivity'],
            industry: 'Technology',
            businessType: 'B2B',
            views: 2,
            upvotes: 0,
            hasSpecialOffer: true,
            specialOfferText: 'Special Offer for Early Adopters. This startup has a special discount available for early adopters!',
          },
        ];
        setTrending(fallback.slice(0, 3));
      }
    };
    load();
  }, []);

  // Removed automatic view tracking - now only tracks on View Details clicks

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="startups" className="relative py-12 md:py-16 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-blue-50/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />

      <motion.div 
        className="container relative mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-10 md:mb-12"
        >
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full border border-red-200/60 bg-red-50/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-red-700 mb-8 shadow-soft"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles className="h-4 w-4 text-red-600" />
            <span>Trending This Week</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 text-balance leading-tight">
            Hot startups{" "}
            <motion.span 
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              everyone's talking about
            </motion.span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Discover the hottest startups that early adopters are loving right now
          </p>
        </motion.div>

        {/* Startup Grid (Top 3 ranked) */}
        <motion.div 
          className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-3"
          variants={containerVariants}
        >
          {(() => {
            const top = (trending || []).filter(Boolean);
            if (top.length === 0) {
              return (
                <motion.div 
                  className="col-span-1 md:col-span-2 lg:col-span-3"
                  variants={itemVariants}
                >
                  <div className="text-center text-slate-500 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-12 shadow-soft">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4"
                    >
                      <Rocket className="h-8 w-8 text-slate-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No trending startups yet</h3>
                    <p className="text-slate-500">Be the first to discover amazing startups!</p>
                  </div>
                </motion.div>
              );
            }
            const ordered = top.length >= 3 ? [top[1], top[0], top[2]] : top; // left:#2, center:#1, right:#3
            return ordered.filter(Boolean).map((startup, index) => {
              const absoluteRank = Math.max(0, top.findIndex(s => (s?._id||s?.id) === (startup?._id||startup?.id)));
              const rankNum = absoluteRank + 1;
              const isCenter = index === 1;
              return (
                <motion.div 
                  key={startup?.id || index} 
                  className="relative pt-4"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Rank badge */}
                  <motion.div 
                    className={`absolute -left-4 -top-4 z-20 flex h-16 w-16 items-center justify-center rounded-2xl shadow-premium ${rankNum===1?'bg-gradient-to-br from-yellow-400 to-yellow-600': rankNum===2?'bg-gradient-to-br from-slate-400 to-slate-600':'bg-gradient-to-br from-orange-400 to-orange-600'}`}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-xl font-bold text-white">#{rankNum}</div>
                  </motion.div>
                  
                  <motion.div
                    className={`group relative flex flex-col bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-soft hover:shadow-premium transition-all duration-500 overflow-hidden ${isCenter ? 'lg:scale-[1.04] lg:-translate-y-1 border-blue-300/80' : 'hover:border-blue-200/80'} ${rankNum===1?'ring-2 ring-yellow-400/50 shadow-glow': ''}`}
                    whileHover={{ scale: isCenter ? 1.08 : 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Top accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-2 ${rankNum===1?'bg-gradient-to-r from-yellow-400 to-yellow-600': rankNum===2?'bg-gradient-to-r from-slate-400 to-slate-600':'bg-gradient-to-r from-orange-400 to-orange-600'}`} />
                    
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 p-6 md:p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4 flex-1">
                          <motion.div 
                            className="relative flex-shrink-0"
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-soft group-hover:shadow-glow">
                              <span className="text-xl font-bold text-blue-700">
                                {(startup?.name || '').substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-xl group-hover:text-blue-600 transition-colors duration-300 mb-2">
                              {startup?.name || ''}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{startup?.views || 0} views</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                          <motion.button
                            onClick={() => {
                              const sid = startup?._id || startup?.id; if (sid) toggleUpvote(sid);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                              upvotedStartups.has(startup?._id || startup?.id)
                                ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-red-500 border border-slate-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.div
                              animate={upvotedStartups.has(startup?._id || startup?.id) ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              <Heart 
                                className={`h-4 w-4 ${
                                  upvotedStartups.has(startup?._id || startup?.id) 
                                    ? 'fill-current' 
                                    : ''
                                }`} 
                                color={upvotedStartups.has(startup?._id || startup?.id) ? '#dc2626' : '#64748b'}
                                fill={upvotedStartups.has(startup?._id || startup?.id) ? '#dc2626' : 'none'}
                              />
                            </motion.div>
                            <span className="text-sm font-semibold">
                              {getUpvoteCount(startup)}
                            </span>
                          </motion.button>
                          <Badge 
                            variant={(startup?.businessType || startup?.type) === 'B2B' ? 'default' : 'secondary'} 
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                              (startup?.businessType || startup?.type) === 'B2B' 
                                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                : 'bg-green-100 text-green-700 border-green-200'
                            }`}
                          >
                            {startup?.businessType || startup?.type || 'B2C'}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-6 flex-1">
                        <h4 className="font-semibold text-slate-900 text-base md:text-lg mb-2">
                          {(startup?.description || '').split('.')[0]}.
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-4">
                          {(startup?.description || '').split('.').slice(1).join('.').trim()}
                        </p>

                        {/* Enhanced Tags */}
                        <div className="flex flex-wrap gap-2">
                          {(startup?.categories || []).map((tag) => (
                            <motion.div
                              key={tag}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge 
                                variant="outline" 
                                className="text-xs font-medium px-3 py-1.5 rounded-full border-blue-200 bg-blue-50 text-blue-600 hover:border-blue-300 hover:bg-blue-100 transition-all duration-200"
                              >
                                {tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced Special Offer */}
                      <div className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-soft">
                        <div className="flex items-start space-x-4">
                          <motion.div 
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500 shadow-soft flex-shrink-0 mt-1"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Gift className="h-4 w-4 text-white" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="font-bold text-green-800 text-base">Special Offer</span>
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Sparkles className="h-4 w-4 text-green-600" />
                              </motion.div>
                            </div>
                            <p className="text-sm text-green-700 leading-relaxed font-medium mb-3">
                              {startup?.hasSpecialOffer
                                ? (startup?.specialOfferText || 'Exclusive early adopter deal available.')
                                : 'Check back soon for exciting offers and early adopter benefits.'}
                            </p>
                            <motion.div 
                              className="inline-block"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-soft">
                                {startup?.hasSpecialOffer ? 'Log in to see the discount' : 'Stay updated'}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-200">
                        <div className="text-sm text-slate-500">
                          <span className="font-medium">{startup?.founderId?.fullName || 'Founder'}</span>
                          <span className="mx-2">•</span>
                          <span>{startup?.industry || (startup?.categories||[])[0]}</span>
                        </div>
                        <Link to={`/startups/${startup?._id || startup?.id || ''}`}>
                          <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => trackView(startup?._id || startup?.id)}
                          >
                            <Button className="inline-flex items-center justify-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold rounded-xl transition-all duration-300 hover:shadow-premium w-44 h-12">
                              View Details
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </motion.div>
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            });
          })()}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center mt-8 md:mt-10"
        >
          <Link to="/login">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 md:px-10 py-5 md:py-6 text-base md:text-lg font-semibold rounded-2xl shadow-premium hover:shadow-glow transition-all duration-300 w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Globe className="h-6 w-6" />
                  </motion.div>
                  Login to see more startups
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StartupDiscovery;