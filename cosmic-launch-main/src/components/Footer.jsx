import { Rocket, ArrowUp, Coffee, Heart, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Popover can be uncontrolled; keep a flag if needed later

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use the user's custom QR image placed at public/heart-qr.jpg, honoring Vite base path
  const qrSrc = `${import.meta.env.BASE_URL}heart-qr.jpg`;
  const [qrLoadError, setQrLoadError] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 via-white to-slate-100 border-t border-slate-200 shadow-lg">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 mb-12">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-block">
              <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  LaunchSignal
                </span>
              </div>
            </Link>
            <p className="text-slate-600 mb-8 max-w-md leading-relaxed text-lg font-medium">
              The premier platform connecting innovative startups with passionate early adopters. Discover the next big thing before it goes mainstream.
            </p>
            <div className="flex">
              <a
                href="https://buymeacoffee.com/Divy6976"
                target="_blank"
                rel="noreferrer"
                aria-label="Support on Buy Me a Coffee"
                className="inline-flex items-center gap-2 px-4 h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold border-2 border-amber-400 shadow hover:from-amber-500 hover:to-amber-600 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Coffee className="h-5 w-5" />
                <span>Support</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-bold text-slate-900 mb-6 text-xl">Platform</h3>
            <ul className="space-y-4">
              {[
                { label: "Explore Startups", href: "#startups" },
                { label: "Submit Startup", href: "/submit-startup" },
                { label: "For Adopters", href: "/signup" },
                { label: "Success Stories", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-all duration-300 text-base font-medium inline-flex items-center group hover:bg-blue-50 px-3 py-2 rounded-lg"
                  >
                    <span className="group-hover:translate-x-2 transition-transform duration-300">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className="font-bold text-slate-900 mb-6 text-xl">Resources</h3>
            <ul className="space-y-4">
              {[
                { label: "Help Center", href: "#" },
                { label: "FAQ", href: "#faq" },
                { label: "Community", href: "#" },
                { label: "Blog", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-all duration-300 text-base font-medium inline-flex items-center group hover:bg-blue-50 px-3 py-2 rounded-lg"
                  >
                    <span className="group-hover:translate-x-2 transition-transform duration-300">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-bold text-slate-900 mb-6 text-xl">Stay Updated</h3>
            <p className="text-slate-600 text-base mb-6 leading-relaxed font-medium">
              Get the latest startups and early adopter opportunities delivered to your inbox.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-base font-medium"
              />
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all hover:shadow-xl hover:scale-105 text-base">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-slate-300 pt-8">
          <div className="flex items-center justify-center">
            <p className="text-base text-slate-600 text-center font-medium">
              © 2025 LaunchSignal. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-20 md:bottom-8 md:right-[84px] z-50 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ring-2 ring-white/80 hover:ring-white hover:shadow-xl hover:bg-blue-700 transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-8 w-8 md:h-[54px] md:w-[54px]" />
        </motion.button>
      )}

      {/* Floating Heart Support Button as Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-white text-red-600 border border-slate-200 shadow-md ring-2 ring-white/80 hover:ring-white hover:shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Support"
            title="Support"
          >
          <Heart className="h-8 w-8 md:h-[54px] md:w-[54px]" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 mr-6 mb-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50">
          <div className="p-4 space-y-6">
            <a
              href="https://buymeacoffee.com/Divy6976"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-amber-400 bg-amber-50 shadow-sm hover:border-amber-500 hover:bg-amber-100 transition-colors"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-white"><Coffee className="h-5 w-5"/></span>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-slate-900">Buy Me Coffee</div>
              </div>
            </a>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white">UPI</span>
                <div className="font-semibold text-slate-900">UPI Payment</div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={qrSrc}
                  alt="Support QR"
                  className="rounded-md border border-slate-200 bg-white"
                  onError={() => setQrLoadError(true)}
                />
                <div className="text-sm text-slate-700">Scan this QR to support</div>
                {qrLoadError && (
                  <div className="text-xs text-red-600">Missing public/heart-qr.jpg</div>
                )}
                <div className="text-xs text-slate-500">No UPI ID shown for privacy</div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </footer>
  );
};

export default Footer;
