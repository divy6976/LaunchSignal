import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const faqs = useMemo(() => [
    {
      q: "What is LaunchSignal?",
      a: "LaunchSignal is a SaaS platform where founders showcase startups and early adopters discover, upvote, and give actionable feedback.",
    },
    {
      q: "How do I submit my startup?",
      a: "Create a founder account and open Founder Dashboard → Submit Startup. You can edit later anytime.",
    },
    {
      q: "Who can upvote startups?",
      a: "Only logged-in adopters can upvote. Upvotes are timestamped to power weekly trending.",
    },
    {
      q: "How are trending startups chosen?",
      a: "We rank by upvotes received in the last 7 days. Ties are broken with total upvotes and recency.",
    },
    {
      q: "Can I edit my startup after submitting?",
      a: "Yes. Go to Founder Dashboard and click Edit on your startup card to update details anytime.",
    },
    {
      q: "Is there a review before startups go live?",
      a: "Yes. Admin approval ensures quality and safety on the public feed.",
    },
  ], []);

  // Manage open accordion item at the component top-level to respect hooks rules.
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
      {/* Premium background matching Hero.jsx */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-blue-50/30 pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none -z-10" />
      
      <div className="container relative mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-blue-700 mb-8 shadow-soft">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Frequently Asked Questions</span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 text-balance leading-tight">
            Everything you need to{" "}
            <span className="hero-gradient-text">
              know
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Short answers about how the platform works
          </p>
        </div>

        <div className="columns-1 md:columns-2 gap-6 [column-fill:_balance] [&>*]:mb-6">
          {faqs.map((item, idx) => (
            <div
              key={item.q}
              className={`hero-card p-6 transition-all duration-300 cursor-pointer break-inside-avoid ${openIndex === idx ? 'border-blue-200/80 shadow-premium' : 'hover:shadow-premium'}`}
              onClick={() => toggle(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(idx); }}}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 pr-6 text-lg">{item.q}</span>
                <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-600'}`} />
              </div>
              {openIndex === idx && (
                <div className="mt-4 text-slate-600 text-base leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="#contact" 
            className="hero-button inline-flex items-center gap-3 group"
          >
            <span className="relative z-10">Still have questions? Contact us</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;


