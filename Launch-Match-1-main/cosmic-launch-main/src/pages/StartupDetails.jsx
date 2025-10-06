import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Globe, MessageSquare, User as UserIcon, ExternalLink, ArrowLeft, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { startupAPI } from "../services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StartupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  
  const isVideo = (src) => {
    const s = String(src || '').toLowerCase();
    return s.startsWith('data:video') || s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.ogg');
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await startupAPI.getStartupById(id);
        setStartup(data);
      } catch (e) {
        setError("Failed to load startup");
      } finally {
        setLoading(false);
      }
    };
    
    // Check if user is logged in
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(!!loggedInStatus);
    
    fetchDetails();
  }, [id]);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim() || feedbackText.length < 10) {
      alert("Please provide feedback with at least 10 characters.");
      return;
    }

    if (!isLoggedIn) {
      alert("Please log in to submit feedback.");
      navigate('/login');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      // Import the feedback API function
      const { feedbackAPI } = await import("../services/api");
      await feedbackAPI.submitFeedback({
        startupId: id,
        comment: feedbackText
      });
      
      setFeedbackSubmitted(true);
      setFeedbackText("");
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error || !startup) return <div className="p-8 text-center text-red-500">{error || "Not found"}</div>;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      {/* Your Content/Components */}
      <div className="relative z-10">
      {/* Header rendered globally by AppShell */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6 inline-flex items-center gap-2 rounded-lg border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 bg-white shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Header/Hero */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {startup.logo ? (
                <img src={startup.logo} alt={startup.name} className="h-14 w-14 rounded-lg object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {(startup.name || '').substring(0,2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">{startup.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{startup.tagline}</p>
                <div className="mt-2 flex items-center flex-wrap gap-2 text-xs">
                  <Badge className="bg-green-100 text-green-700">LIVE</Badge>
                  <Badge className="bg-blue-100 text-blue-700">{startup.industry || startup.categories?.[0]}</Badge>
                  <Badge variant="outline">{startup.businessType}</Badge>
                  <div className="flex items-center gap-1 text-gray-500 ml-2">
                    <Eye className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-medium">{startup.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
            <a
              href={startup.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Visit Website
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: About, Target Users, Offer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Gallery (images/videos uploaded by founder) */}
            {Array.isArray(startup.media) && startup.media.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Media</h3>
                  {startup.media.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => setIsGalleryOpen(true)}>
                      View Gallery ({startup.media.length})
                    </Button>
                  )}
                </div>
                {/* Primary large viewer fills the box */}
                <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
                  {isVideo(startup.media[mediaIndex]) ? (
                    <video src={startup.media[mediaIndex]} controls className="w-full h-[28rem] md:h-[34rem] object-contain bg-white" />
                  ) : (
                    <img src={startup.media[mediaIndex]} alt={`media-${mediaIndex + 1}`} className="w-full h-[28rem] md:h-[34rem] object-contain bg-white" />
                  )}
                  {startup.media.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous media"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMediaIndex((prev) => (prev - 1 + startup.media.length) % startup.media.length); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next media"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMediaIndex((prev) => (prev + 1) % startup.media.length); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/80 px-2 py-1 rounded-full border border-gray-200">
                        {startup.media.map((_, i) => (
                          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === mediaIndex ? 'bg-gray-800' : 'bg-gray-300'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Gallery Modal */}
                <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                  <DialogContent className="max-w-5xl">
                    <DialogHeader>
                      <DialogTitle>Gallery</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {startup.media.map((src, idx) => (
                        <div key={idx} className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                          {isVideo(src) ? (
                            <video src={src} controls className="w-full h-64 object-contain bg-white" />
                          ) : (
                            <img src={src} alt={`media-${idx + 1}`} className="w-full h-64 object-contain bg-white" />
                          )}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-3">About {startup.name}</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{startup.description}</p>
            </div>

            {startup.targetAudience && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Target Users</h3>
                <p className="text-gray-700 leading-relaxed">{startup.targetAudience}</p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <h3 className="font-semibold text-green-800 mb-2">Special Offer for Early Adopters</h3>
              {(() => { const hasOffer = !!(startup.hasSpecialOffer || startup.specialOfferText || (startup.discount && startup.discount > 0) || startup.specialOfferCode); return (
                <div>
                  <p className="text-green-700 mb-3">
                    {hasOffer ? (startup.specialOfferText || 'Exclusive early adopter deal available.') : "This startup doesn't have a special offer right now."}
                  </p>
                  {hasOffer && (
                    <div className="inline-flex items-center gap-2">
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-md">{startup.discount ? `${startup.discount}% OFF` : 'Claim Offer'}</span>
                      {startup.specialOfferCode && (
                        <span className="text-[11px] font-mono bg-green-100 text-green-800 px-2 py-1 rounded-md border border-green-200">Code: {startup.specialOfferCode}</span>
                      )}
                    </div>
                  )}
                </div>
              ); })()}
            </div>
          </div>

          {/* Right: Sidebar cards */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {(startup.categories || []).map((c) => (
                  <Badge key={c} variant="outline" className="border-blue-200 bg-blue-50 text-blue-600">{c}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Founder</h3>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{startup.founderId?.fullName || 'Founder'}</div>
                  <div className="text-xs text-gray-500">Building in {startup.industry || 'Technology'}</div>
                </div>
              </div>
            </div>

            {startup.website && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Visit Website</h3>
                <p className="text-sm text-gray-600 mb-3">Check out {startup.name}'s official website.</p>
              <a 
                href={startup.website} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-2 rounded-lg transition-all"
              >
                  <Globe className="h-4 w-4" /> Visit Website
                </a>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Give Feedback</h3>
              <p className="text-sm text-gray-600 mb-3">Help {startup.name} improve by sharing your thoughts and feedback.</p>
              
              {feedbackSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <p className="text-green-700 text-sm">Thank you for your feedback! It has been submitted successfully.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts about this startup... (minimum 10 characters)"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="min-h-20 resize-none focus:ring-blue-500 focus:border-blue-500"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{feedbackText.length}/500 characters</span>
                    <Button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmittingFeedback || feedbackText.length < 10}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingFeedback ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </div>
                  {!isLoggedIn && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                      You need to be logged in to submit feedback.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Footer rendered globally by AppShell */}
      </div>
    </div>
  );
};

export default StartupDetails;


