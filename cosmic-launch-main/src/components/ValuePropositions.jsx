import { Rocket, Target, Handshake, Users, TrendingUp, Zap, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ValuePropositions = () => {
  const features = [
    {
      icon: Rocket,
      title: "For Startups (Pre‑launch)",
      description: "Apply to our early access. Get onboarded for launch and be first in line when we open matching.",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      stats: "Join the Founders Waitlist",
      color: "blue"
    },
    {
      icon: Target,
      title: "For Early Adopters",
      description: "Discover innovative products before they go mainstream. Join the waitlist and get access at launch.",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-100/50",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
      stats: "2,000+ on Waitlist",
      color: "green"
    },
    {
      icon: Handshake,
      title: "Perfect Match",
      description: "Smart matching goes live at launch. Be among the first to get matched.",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100/50",
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
      stats: "Matches open at launch",
      color: "orange"
    }
  ];

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
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-blue-50/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />

      <motion.div 
        className="container relative mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-20"
        >
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-blue-700 mb-8 shadow-soft"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-4 w-4" />
            </motion.div>
            <span>Why choose us</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-blue-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 text-balance leading-tight">
            Built for{" "}
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
              innovation
            </motion.span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Whether you're launching a startup or seeking the next big thing, we've got you covered with our premium platform
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-3 items-stretch"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative h-full"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow effect */}
              <div className={`absolute -inset-4 bg-gradient-to-br ${feature.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />

              <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-soft hover:shadow-premium transition-all duration-500 group-hover:border-blue-200/80 h-full flex flex-col">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-50/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <motion.div 
                  className={`relative inline-flex h-16 w-16 items-center justify-center rounded-2xl ${feature.iconBg} shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-300 mb-8`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-base md:text-lg mb-8 font-normal">
                  {feature.description}
                </p>

                {/* Stats */}
                <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200/70">
                  <div className="text-2xl font-bold text-emerald-900 mb-1">{feature.stats}</div>
                  <div className="text-sm text-emerald-700 font-medium">Active on platform</div>
                </div>

                {/* CTA removed as requested */}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced stats section (pre-launch) */}
        <motion.div
          variants={itemVariants}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            { icon: Users, label: "Waitlist", value: "2,000+", color: "blue" },
            { icon: Rocket, label: "Founders Ready", value: "Hundreds", color: "green" },
            { icon: TrendingUp, label: "Successful Matches", value: "0 (pre‑launch)", color: "orange" },
            { icon: Zap, label: "Daily Connections", value: "Coming Soon", color: "purple" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group text-center p-6 rounded-2xl bg-white border border-slate-200/60 shadow-soft hover:shadow-premium transition-all duration-300 hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 mb-4 group-hover:shadow-soft transition-all duration-300`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </motion.div>
              <div className="text-3xl font-bold text-slate-900 mb-2 break-words">{stat.value}</div>
              <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ValuePropositions;
