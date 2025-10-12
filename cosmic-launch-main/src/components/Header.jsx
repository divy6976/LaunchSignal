import { Button } from "@/components/ui/button";
import { Rocket, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = typeof window !== 'undefined' ? !!localStorage.getItem('isLoggedIn') : false;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const userEmail = typeof window !== 'undefined' ? (localStorage.getItem('userEmail') || '').toLowerCase() : '';
  const isAdmin = userEmail === 'divyprakashpandey6@gmail.com';
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location?.pathname || '/';
  const isAdopterFeed = pathname.startsWith('/startups-feed');
  const isContactPage = pathname === '/contact';
  const isAnalyticsPage = pathname.startsWith('/analytics');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const goToSection = (sectionId) => {
    const smoothScrollById = () => {
      const resolveIds = (id) => id === 'trending' ? ['trending', 'trending-section'] : [id];
      const [primaryId, fallbackId] = resolveIds(sectionId);
      let el = document.getElementById(primaryId);
      if (!el && fallbackId) el = document.getElementById(fallbackId);
      if (!el) return false;
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80; // offset for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Update hash for accessibility/history
      try { history.replaceState(null, '', `#${primaryId}`); } catch {}
      return true;
    };

    if (pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }

    // If section isn't in DOM yet (due to async load), retry for up to 4s
    if (!smoothScrollById()) {
      let attempts = 0;
      const timer = setInterval(() => {
        attempts += 1;
        if (smoothScrollById() || attempts >= 20) {
          clearInterval(timer);
        }
      }, 200);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-[60] w-full transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-white/90 border-b border-slate-200/60 shadow-soft-lg"
          : "backdrop-blur-sm bg-white/70 border-b border-slate-100/50"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/">
          <motion.div
            className="flex items-center space-x-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                LaunchSignal
              </span>
            </div>
          </motion.div>
        </Link>

        <nav className="hidden lg:flex items-center">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-3 py-2 shadow-soft">
            {/* Simplified navigation for founders */}
            {isLoggedIn && (userRole === 'founder' || isAdmin) ? (
              <>
                <Link to="/founder-dashboard">
                  <motion.button 
                      className="group relative px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl transition-all duration-300"
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="relative z-10">Dashboard</span>
                  </motion.button>
                </Link>
                <Link to="/submit-startup">
                  <motion.button 
                      className="group relative px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl transition-all duration-300 hover:bg-blue-50/80"
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="relative z-10">Submit Startup</span>
                  </motion.button>
                </Link>
              </>
            ) : (
              /* Simplified navigation for adopters and visitors */
              <>
                {isLoggedIn && (userRole === 'adopter' || isAdmin) ? (
                  /* Adopter navigation - ultra clean with only My Feed */
                  <Link to="/startups-feed">
                    <motion.button 
                        className="group relative px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl transition-all duration-300"
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="relative z-10">My Feed</span>
                    </motion.button>
                  </Link>
                ) : (
                  /* Visitor navigation - minimal options */
                  <>
                    {!isAnalyticsPage && (
                      <motion.button 
                          className="group relative px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl transition-all duration-300 hover:bg-blue-50/80"
                          whileHover={{ y: -1 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => goToSection('trending')}
                        >
                          <span className="relative z-10">Explore Startups</span>
                          <motion.div
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                            initial={{ width: 0 }}
                            whileHover={{ width: "60%" }}
                            transition={{ duration: 0.3 }}
                          />
                      </motion.button>
                    )}
                    {!isAnalyticsPage && (
                      <motion.button 
                          className="group relative px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl transition-all duration-300 hover:bg-blue-50/80"
                          whileHover={{ y: -1 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => goToSection('faq')}
                        >
                          <span className="relative z-10">FAQ</span>
                          <motion.div
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                            initial={{ width: 0 }}
                            whileHover={{ width: "60%" }}
                            transition={{ duration: 0.3 }}
                          />
                      </motion.button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    className="text-sm font-semibold text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/80 px-6 py-2.5 rounded-xl transition-all duration-300 shadow-soft hover:shadow-soft-lg"
                  >
                    Log In
                  </Button>
                </motion.div>
              </Link>
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-premium hover:shadow-glow transition-all duration-300 group">
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Get Started
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
              </Link>
            </>
          ) : (
            <>
              {(userRole === 'founder' || isAdmin) && (
                <Link to="/startups-feed">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 shadow-soft hover:shadow-glow transition-all duration-300">
                      Explore Feed
                    </Button>
                  </motion.div>
                </Link>
              )}
              {(userRole === 'founder' || isAdmin) && (
                <Link to="/founder-dashboard">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="text-sm font-semibold border-slate-200 hover:border-blue-300 hover:bg-blue-50/80 rounded-xl px-5 py-2.5 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                      Dashboard
                    </Button>
                  </motion.div>
                </Link>
              )}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    try {
                      localStorage.removeItem('isLoggedIn');
                      localStorage.removeItem('userRole');
                      localStorage.removeItem('userName');
                      localStorage.removeItem('userEmail');
                    } catch {}
                    window.location.href = '/login';
                  }}
                  className="text-sm font-semibold border-slate-200 hover:border-red-300 hover:bg-red-50/80 hover:text-red-600 rounded-xl px-5 py-2.5 shadow-soft hover:shadow-soft-lg transition-all duration-300"
                >
                  Logout
                </Button>
              </motion.div>
            </>
          )}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden"
        >
          <Button
            variant="ghost"
            size="sm"
            className="p-3 hover:bg-blue-50/80 rounded-xl transition-colors border border-slate-200/60 shadow-soft"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-slate-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-slate-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-slate-200/60 z-[61]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-100/60">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg">
                      <Rocket className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                      LaunchSignal
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-slate-600" />
                  </motion.button>
                </div>

                <nav className="flex-1 overflow-y-auto p-6">
                  <div className="flex flex-col space-y-2">
                    {/* Simplified mobile navigation for founders */}
                    {isLoggedIn && (userRole === 'founder' || isAdmin) ? (
                      <>
                        <Link to="/founder-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                          <motion.button
                            className="w-full text-left text-blue-600 bg-blue-50 text-base font-semibold py-4 px-4 transition-all rounded-xl"
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            Dashboard
                          </motion.button>
                        </Link>
                        <Link to="/submit-startup" onClick={() => setIsMobileMenuOpen(false)}>
                          <motion.button
                            className="w-full text-left text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 text-base font-semibold py-4 px-4 transition-all rounded-xl"
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            Submit Startup
                          </motion.button>
                        </Link>
                      </>
                    ) : (
                      /* Mobile navigation for non-founders */
                      <>
                        {isLoggedIn && (userRole === 'adopter' || isAdmin) ? (
                          /* Adopter mobile navigation - ultra clean with only My Feed */
                          <Link to="/startups-feed" onClick={() => setIsMobileMenuOpen(false)}>
                            <motion.button 
                              className="w-full text-left text-blue-600 bg-blue-50 text-base font-semibold py-4 px-4 transition-all rounded-xl"
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              My Feed
                            </motion.button>
                          </Link>
                        ) : (
                          /* Visitor mobile navigation */
                          <>
                            {!(userRole === 'founder' && pathname.startsWith('/submit-startup')) && !isContactPage && (
                              <motion.button
                                className="text-left text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 text-base font-semibold py-4 px-4 transition-all rounded-xl"
                                onClick={() => { goToSection('trending'); setIsMobileMenuOpen(false); }}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                Explore Startups
                              </motion.button>
                            )}
                            {!isContactPage && (
                              <motion.button
                                className="text-left text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 text-base font-semibold py-4 px-4 transition-all rounded-xl"
                                onClick={() => { goToSection('faq'); setIsMobileMenuOpen(false); }}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                FAQ
                              </motion.button>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </nav>

                <div className="p-6 border-t border-slate-100/60 space-y-3">
                  <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Account</div>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full text-base font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 rounded-xl py-4 shadow-soft"
                      >
                        Log In
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-base font-semibold shadow-premium hover:shadow-glow rounded-xl py-4">
                        Get Started
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
