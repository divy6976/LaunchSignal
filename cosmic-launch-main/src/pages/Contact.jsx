import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setSent(true);
      } else {
        setError(data.message || "Could not send your message. Please try again.");
      }
    } catch (e) {
      console.error('Contact form error:', e);
      setError("Could not send your message. Please try again.");
    }
  };

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-6 py-3 text-slate-700 hover:text-white border-2 border-slate-300 hover:border-blue-500 bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Go Back</span>
          </Button>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700 border border-blue-100">
            <span className="text-xs font-semibold tracking-wide">Contact Us</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">We'd love to hear from you</h1>
          <p className="text-sm text-gray-600 mt-2">Have a question, feature idea, or partnership? Send us a message.</p>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-xl border-0 p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">✓</div>
              <h2 className="text-xl font-bold text-gray-900">Message sent!</h2>
              <p className="text-gray-600 mt-1">Thanks for reaching out. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={onChange} placeholder="John Doe" className="h-11" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" className="h-11" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Input id="subject" name="subject" value={form.subject} onChange={onChange} placeholder="How can we help?" className="h-11" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea id="message" name="message" value={form.message} onChange={onChange} placeholder="Write your message..." className="min-h-32" required />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button type="submit" className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">Send Message</Button>
              </div>
            </form>
          )}
        </div>

      </div>
      {/* Footer rendered globally by AppShell */}
      </div>
    </div>
  );
};

export default Contact;


