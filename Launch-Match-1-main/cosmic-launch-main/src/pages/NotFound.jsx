import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Hop as Home, Search, ArrowLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      {/* Your Content/Components */}
      <div className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-6">
            <Rocket className="h-16 w-16 text-blue-600 transform -rotate-45" />
          </div>

          <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            404
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have launched into orbit. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <Button className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Go Home
            </Button>
          </Link>

          <Link to="/startups-feed">
            <Button variant="outline" className="group w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105">
              <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Explore Startups
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-500 mb-4">Or try one of these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "About", href: "/#about" },
              { label: "Contact", href: "/contact" },
              { label: "Login", href: "/login" },
              { label: "Sign Up", href: "/signup" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back to previous page
        </motion.button>
      </div>
      </div>
    </div>
  );
};

export default NotFound;
