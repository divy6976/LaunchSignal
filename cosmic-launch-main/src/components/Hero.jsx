import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket, TrendingUp, Zap, Star, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-24 md:py-32 lg:py-40">
      {/* Premium animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {/* Primary gradient */}
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <motion.div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{ clipPath: 'polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)' }}
            animate={{
              rotate: [30, 35, 30],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        {/* Secondary gradient */}
        <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <motion.div
            className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-15deg] bg-gradient-to-tr from-blue-300 via-blue-400 to-blue-500 opacity-15 sm:left-[calc(50%+20rem)] sm:w-[60rem]"
            style={{ clipPath: 'polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)' }}
            animate={{
              rotate: [-15, -20, -15],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 opacity-60"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 opacity-50"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 opacity-40"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </div>

      <motion.div 
        className="container relative mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-8 hidden sm:inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-blue-700 shadow-soft"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
          <span>The future of startup discovery</span>
          <motion.div
            className="w-2 h-2 rounded-full bg-blue-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl text-balance leading-[1.1] mb-8"
        >
          Where startups meet{" "}
          <motion.span 
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            early adopters
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-8 max-w-3xl text-xl text-slate-600 sm:text-2xl text-balance leading-relaxed font-normal mb-12"
        >
          Discover innovative startups before they go mainstream. Get exclusive early access and help shape the future of technology.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6 mb-16"
        >
          <Link to="/signup?role=founder">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-premium hover:shadow-glow transition-all duration-300 w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="h-5 w-5" />
                  </motion.div>
                  Join as a Startup
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
          </Link>
          
          <Link to="/signup?role=adopter">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-premium hover:shadow-glow transition-all duration-300 w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="h-5 w-5" />
                  </motion.div>
                  Join as an Early Adopter
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats (pre-launch placeholders) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 text-sm text-slate-600"
        >
          <motion.div 
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 group-hover:shadow-soft transition-all duration-300">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-5 w-5 text-green-600" />
              </motion.div>
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">Launching Soon</div>
              <div className="text-slate-500">Founders waitlist open</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:shadow-soft transition-all duration-300">
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users className="h-5 w-5 text-blue-600" />
              </motion.div>
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">2,000+</div>
              <div className="text-slate-500">Early adopters on waitlist</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 group-hover:shadow-soft transition-all duration-300">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="h-5 w-5 text-orange-600" />
              </motion.div>
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">0</div>
              <div className="text-slate-500">Matches (pre‑launch)</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
